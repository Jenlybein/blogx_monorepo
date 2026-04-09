package comment_service

import (
	"myblogx/common"
	"myblogx/global"
	"myblogx/models"
	"myblogx/models/ctype"
	"myblogx/models/enum"
	"time"

	"gorm.io/gorm"
)

type RootCommentRow struct {
	ID           ctype.ID           `gorm:"column:id"`
	CreatedAt    time.Time          `gorm:"column:created_at"`
	Content      string             `gorm:"column:content"`
	UserID       ctype.ID           `gorm:"column:user_id"`
	ReplyID      ctype.ID           `gorm:"column:reply_id"`
	RootID       ctype.ID           `gorm:"column:root_id"`
	DiggCount    int                `gorm:"column:digg_count"`
	ReplyCount   int                `gorm:"column:reply_count"`
	Status       enum.CommentStatus `gorm:"column:status"`
	UserNickname string             `gorm:"column:user_nickname"`
	UserAvatar   string             `gorm:"column:user_avatar"`
}

type ReplyCommentRow struct {
	ID                ctype.ID           `gorm:"column:id"`
	CreatedAt         time.Time          `gorm:"column:created_at"`
	Content           string             `gorm:"column:content"`
	UserID            ctype.ID           `gorm:"column:user_id"`
	ReplyID           ctype.ID           `gorm:"column:reply_id"`
	DiggCount         int                `gorm:"column:digg_count"`
	ReplyCount        int                `gorm:"column:reply_count"`
	Status            enum.CommentStatus `gorm:"column:status"`
	UserNickname      string             `gorm:"column:user_nickname"`
	UserAvatar        string             `gorm:"column:user_avatar"`
	ReplyUserNickname string             `gorm:"column:reply_user_nickname"`
}

type QueryService struct {
	DB *gorm.DB
}

func NewQueryService(db *gorm.DB) *QueryService {
	return &QueryService{DB: db}
}

func ListPublishedRootComments(articleID ctype.ID, page common.PageInfo) ([]RootCommentRow, bool, error) {
	return NewQueryService(global.DB).ListPublishedRootComments(articleID, page)
}

func (s *QueryService) ListPublishedRootComments(articleID ctype.ID, page common.PageInfo) ([]RootCommentRow, bool, error) {
	limit := page.GetLimit()
	offset := page.GetOffsetNoCount()
	db := s.DB
	if db == nil {
		db = global.DB
	}

	var rows []RootCommentRow
	err := db.Model(&models.CommentModel{}).
		Select([]string{
			"comment_models.id",
			"comment_models.created_at",
			"comment_models.content",
			"comment_models.user_id",
			"comment_models.reply_id",
			"comment_models.root_id",
			"comment_models.digg_count",
			"comment_models.reply_count",
			"comment_models.status",
			"user_models.nickname AS user_nickname",
			"user_models.avatar AS user_avatar",
		}).
		Joins("JOIN user_models ON user_models.id = comment_models.user_id").
		Where("comment_models.article_id = ? AND comment_models.status = ? AND comment_models.reply_id = 0 AND comment_models.root_id = 0",
			articleID, enum.CommentStatusPublished).
		Order("comment_models.created_at DESC").
		Limit(limit + 1).
		Offset(offset).
		Scan(&rows).Error
	if err != nil {
		return nil, false, err
	}

	hasMore := len(rows) > limit
	if hasMore {
		rows = rows[:limit]
	}
	return rows, hasMore, nil
}

func ListPublishedReplyComments(articleID, rootID ctype.ID, page common.PageInfo) ([]ReplyCommentRow, bool, error) {
	return NewQueryService(global.DB).ListPublishedReplyComments(articleID, rootID, page)
}

func (s *QueryService) ListPublishedReplyComments(articleID, rootID ctype.ID, page common.PageInfo) ([]ReplyCommentRow, bool, error) {
	limit := page.GetLimit()
	offset := page.GetOffsetNoCount()
	db := s.DB
	if db == nil {
		db = global.DB
	}

	var rows []ReplyCommentRow
	err := db.Model(&models.CommentModel{}).
		Select([]string{
			"comment_models.id",
			"comment_models.created_at",
			"comment_models.content",
			"comment_models.user_id",
			"comment_models.reply_id",
			"comment_models.digg_count",
			"comment_models.reply_count",
			"comment_models.status",
			"user_models.nickname AS user_nickname",
			"user_models.avatar AS user_avatar",
			"parent_users.nickname AS reply_user_nickname",
		}).
		Joins("JOIN user_models ON user_models.id = comment_models.user_id").
		Joins("LEFT JOIN comment_models AS parent_comments ON parent_comments.id = comment_models.reply_id").
		Joins("LEFT JOIN user_models AS parent_users ON parent_users.id = parent_comments.user_id").
		Where("comment_models.article_id = ? AND comment_models.root_id = ? AND comment_models.status = ?",
			articleID, rootID, enum.CommentStatusPublished).
		Order("comment_models.created_at ASC").
		Limit(limit + 1).
		Offset(offset).
		Scan(&rows).Error
	if err != nil {
		return nil, false, err
	}

	hasMore := len(rows) > limit
	if hasMore {
		rows = rows[:limit]
	}
	return rows, hasMore, nil
}
