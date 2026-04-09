// 获取文章一级评论列表
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

type CommentRootListRequest struct {
	common.PageInfo
	ArticleID ctype.ID `form:"article_id" binding:"required"`
}

type CommentRootListResponse struct {
	ID           ctype.ID           `json:"id"`
	CreatedAt    time.Time          `json:"created_at"`
	Content      string             `json:"content"`
	UserID       ctype.ID           `json:"user_id"`
	ReplyId      ctype.ID           `json:"reply_id"`
	RootID       ctype.ID           `json:"root_id"`
	DiggCount    int                `json:"digg_count"`
	ReplyCount   int                `json:"reply_count"`
	IsDigg       bool               `json:"is_digg"`
	Relation     int8               `json:"relation"`
	Status       enum.CommentStatus `json:"status"`
	UserNickname string             `json:"user_nickname"`
	UserAvatar   string             `json:"user_avatar"`
}

func (CommentApi) CommentRootListView(c *gin.Context) {
	cr := middleware.GetBindQuery[CommentRootListRequest](c)
	queryService := comment_service.NewQueryService(global.DB)

	var article models.ArticleModel
	if err := global.DB.Select("id").Take(&article, cr.ArticleID).Error; err != nil {
		res.FailWithMsg("文章不存在", c)
		return
	}

	// reply_id/root_id 的零值条件不能依赖结构体过滤，需要显式 Where。
	rows, hasMore, err := queryService.ListPublishedRootComments(cr.ArticleID, cr.PageInfo)
	if err != nil {
		res.FailWithMsg("查询一级评论失败 "+err.Error(), c)
		return
	}

	// 查询缓存内存的点赞、回复数增量
	commentIDs := make([]ctype.ID, 0, len(rows))
	for _, item := range rows {
		commentIDs = append(commentIDs, item.ID)
	}
	replyCountMap := map[ctype.ID]int{}
	diggCountMap := map[ctype.ID]int{}
	if len(commentIDs) > 0 {
		replyCountMap = redis_comment.GetBatchCacheReply(commentIDs)
		diggCountMap = redis_comment.GetBatchCacheDigg(commentIDs)
	}

	// 批量查询点赞，好友关系
	viewerUserID := commentViewerIDFromGin(c)
	userIDs := make([]ctype.ID, 0, len(rows))
	for _, item := range rows {
		userIDs = append(userIDs, item.UserID)
	}
	isDiggMap := buildCommentDiggMap(viewerUserID, commentIDs)
	relationMap := buildCommentRelationMap(viewerUserID, userIDs)

	// 组装响应
	responseList := make([]CommentRootListResponse, 0, len(rows))
	for _, item := range rows {
		item.ReplyCount += replyCountMap[item.ID]
		item.DiggCount += diggCountMap[item.ID]
		relation := relationship_enum.RelationStranger
		if got, ok := relationMap[item.UserID]; ok {
			relation = got
		}
		responseList = append(responseList, CommentRootListResponse{
			ID:           item.ID,
			CreatedAt:    item.CreatedAt,
			Content:      item.Content,
			UserID:       item.UserID,
			ReplyId:      item.ReplyID,
			RootID:       item.RootID,
			DiggCount:    item.DiggCount,
			ReplyCount:   item.ReplyCount,
			IsDigg:       isDiggMap[item.ID],
			Relation:     int8(relation),
			Status:       item.Status,
			UserNickname: item.UserNickname,
			UserAvatar:   item.UserAvatar,
		})
	}

	res.OkWithData(map[string]any{
		"list":     responseList,
		"has_more": hasMore,
	}, c)
}
