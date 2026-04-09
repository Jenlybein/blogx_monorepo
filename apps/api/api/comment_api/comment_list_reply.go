package comment_api

import (
	"myblogx/common"
	"myblogx/common/res"
	"myblogx/global"
	"myblogx/middleware"
	"myblogx/models"
	"myblogx/models/ctype"
	"myblogx/models/enum"
	"myblogx/models/enum/relationship_enum"
	"myblogx/service/comment_service"
	"myblogx/service/redis_service/redis_comment"
	"time"

	"github.com/gin-gonic/gin"
)

type CommentReplyListRequest struct {
	common.PageInfo
	ArticleID ctype.ID `form:"article_id" binding:"required"`
	RootID    ctype.ID `form:"root_id" binding:"required"`
}

type CommentReplyListResponse struct {
	CreatedAt         time.Time          `json:"created_at"`
	Content           string             `json:"content"`
	UserID            ctype.ID           `json:"user_id"`
	ReplyId           ctype.ID           `json:"reply_id"`
	DiggCount         int                `json:"digg_count"`
	ReplyCount        int                `json:"reply_count"`
	IsDigg            bool               `json:"is_digg"`
	Relation          int8               `json:"relation"`
	Status            enum.CommentStatus `json:"status"`
	UserNickname      string             `json:"user_nickname"`
	UserAvatar        string             `json:"user_avatar"`
	ReplyUserNickname string             `json:"reply_user_nickname"`
}

func (CommentApi) CommentReplyListView(c *gin.Context) {
	cr := middleware.GetBindQuery[CommentReplyListRequest](c)
	queryService := comment_service.NewQueryService(global.DB)

	// 查询一级评论
	var root models.CommentModel
	if err := global.DB.Select("id", "article_id", "reply_id", "root_id", "reply_count").
		Take(&root, "id = ? and article_id = ? and status = ?", cr.RootID, cr.ArticleID, enum.CommentStatusPublished).Error; err != nil {
		res.FailWithMsg("一级评论不存在", c)
		return
	}
	if root.ReplyId != 0 || root.RootID != 0 {
		res.FailWithMsg("必须是一级评论", c)
		return
	}

	rows, hasMore, err := queryService.ListPublishedReplyComments(cr.ArticleID, cr.RootID, cr.PageInfo)
	if err != nil {
		res.FailWithMsg("查询二级评论失败 "+err.Error(), c)
		return
	}

	// 批量查询回复数和点赞数
	commentIDs := make([]ctype.ID, 0, len(rows))
	for _, item := range rows {
		commentIDs = append(commentIDs, item.ID)
	}
	replyCountMap := redis_comment.GetBatchCacheReply(commentIDs)
	diggCountMap := redis_comment.GetBatchCacheDigg(commentIDs)

	// 批量查询点赞，好友关系
	viewerUserID := commentViewerIDFromGin(c)
	userIDs := make([]ctype.ID, 0, len(rows))
	for _, item := range rows {
		userIDs = append(userIDs, item.UserID)
	}
	isDiggMap := buildCommentDiggMap(viewerUserID, commentIDs)
	relationMap := buildCommentRelationMap(viewerUserID, userIDs)

	// 组装响应
	responseList := make([]CommentReplyListResponse, 0, len(rows))
	for _, item := range rows {
		item.ReplyCount += replyCountMap[item.ID]
		item.DiggCount += diggCountMap[item.ID]
		relation := relationship_enum.RelationStranger
		if got, ok := relationMap[item.UserID]; ok {
			relation = got
		}
		resp := CommentReplyListResponse{
			CreatedAt:    item.CreatedAt,
			Content:      item.Content,
			UserID:       item.UserID,
			ReplyId:      item.ReplyID,
			DiggCount:    item.DiggCount,
			ReplyCount:   item.ReplyCount,
			IsDigg:       isDiggMap[item.ID],
			Relation:     int8(relation),
			Status:       item.Status,
			UserNickname: item.UserNickname,
			UserAvatar:   item.UserAvatar,
		}
		resp.ReplyUserNickname = item.ReplyUserNickname
		responseList = append(responseList, resp)
	}

	rootReplyCount := root.ReplyCount + redis_comment.GetCacheReply(cr.RootID)
	res.OkWithData(map[string]any{
		"root_id":     cr.RootID,
		"reply_count": rootReplyCount,
		"list":        responseList,
		"has_more":    hasMore,
	}, c)
}
