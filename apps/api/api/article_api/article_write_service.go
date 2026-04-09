package article_api

import (
	"errors"

	"myblogx/models"
	"myblogx/models/ctype"
	"myblogx/models/enum"
	"myblogx/service/site_service"
	"myblogx/utils/jwts"
	"myblogx/utils/markdown"

	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

var (
	errArticleUserNotFound     = errors.New("用户不存在")
	errArticleNotFound         = errors.New("文章不存在")
	errArticleCategoryNotFound = errors.New("分类不存在")
)

type articleWriteService struct {
	DB     *gorm.DB
	Logger *logrus.Logger
}

type articleUpdateResult struct {
	UpdateMap  map[string]any
	OldTagIDs  []ctype.ID
	NewTagIDs  []ctype.ID
	TagChanged bool
	ContentSet bool
	Noop       bool
}

func newArticleWriteService(db *gorm.DB, logger *logrus.Logger) *articleWriteService {
	return &articleWriteService{
		DB:     db,
		Logger: logger,
	}
}

func (s *articleWriteService) CreateArticle(claims *jwts.MyClaims, cr ArticleCreateRequest) (*models.ArticleModel, []ctype.ID, error) {
	runtimeSite := site_service.GetRuntimeSite()

	if err := s.DB.Take(&models.UserModel{}, claims.UserID).Error; err != nil {
		return nil, nil, errArticleUserNotFound
	}

	if err := validateArticleCategory(s.DB, claims.UserID, cr.CategoryID); err != nil {
		return nil, nil, errArticleCategoryNotFound
	}

	tagList, err := loadEnabledTagsByIDs(s.DB, cr.TagIDs)
	if err != nil {
		return nil, nil, err
	}

	safeContent := markdown.MdToSafe(cr.Content)
	if cr.Abstract == "" {
		textContent := markdown.MdToText(safeContent)
		cr.Abstract = markdown.ExtractText(textContent, 200)
	}

	article := &models.ArticleModel{
		AuthorID:       claims.UserID,
		Title:          cr.Title,
		Abstract:       cr.Abstract,
		Content:        safeContent,
		CategoryID:     cr.CategoryID,
		Cover:          cr.Cover,
		CommentsToggle: cr.CommentsToggle,
		Status:         cr.Status,
	}

	if runtimeSite.Article.SkipExamining && cr.Status == enum.ArticleStatusExamining {
		article.Status = enum.ArticleStatusPublished
	}

	tagIDs := extractTagIDs(tagList)
	if err := s.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(article).Error; err != nil {
			return err
		}
		return syncArticleTags(tx, article.ID, tagIDs)
	}); err != nil {
		return nil, nil, err
	}

	return article, tagIDs, nil
}

func (s *articleWriteService) UpdateArticle(articleID ctype.ID, claims *jwts.MyClaims, cr ArticleUpdateRequest) (*models.ArticleModel, articleUpdateResult, error) {
	if err := s.DB.Take(&models.UserModel{}, claims.UserID).Error; err != nil {
		return nil, articleUpdateResult{}, errArticleUserNotFound
	}

	var article models.ArticleModel
	if err := s.DB.Take(&article, "id = ? AND author_id = ?", articleID, claims.UserID).Error; err != nil {
		return nil, articleUpdateResult{}, errArticleNotFound
	}

	updateMap := map[string]any{}
	if cr.Title != nil {
		updateMap["title"] = *cr.Title
	}
	if cr.Content != nil {
		updateMap["content"] = markdown.MdToSafe(*cr.Content)
	}
	if cr.Abstract != nil {
		abstract := *cr.Abstract
		if abstract == "" {
			content := article.Content
			if cr.Content != nil {
				content = markdown.MdToSafe(*cr.Content)
			}
			textContent := markdown.MdToText(content)
			abstract = markdown.ExtractText(textContent, 200)
		}
		updateMap["abstract"] = abstract
	}

	if cr.CategoryID != nil {
		if *cr.CategoryID == 0 {
			updateMap["category_id"] = nil
		} else {
			if err := validateArticleCategory(s.DB, claims.UserID, cr.CategoryID); err != nil {
				return nil, articleUpdateResult{}, errArticleCategoryNotFound
			}
			updateMap["category_id"] = cr.CategoryID
		}
	}
	if cr.Cover != nil {
		updateMap["cover"] = *cr.Cover
	}
	if cr.CommentsToggle != nil {
		updateMap["comments_toggle"] = *cr.CommentsToggle
	}

	result := articleUpdateResult{
		UpdateMap:  updateMap,
		ContentSet: cr.Content != nil,
	}

	if cr.TagIDs != nil {
		oldTagIDs, err := loadArticleTagIDs(s.DB, article.ID)
		if err != nil {
			return nil, articleUpdateResult{}, err
		}

		tagList, err := loadEnabledTagsByIDs(s.DB, *cr.TagIDs)
		if err != nil {
			return nil, articleUpdateResult{}, err
		}
		result.OldTagIDs = oldTagIDs
		result.NewTagIDs = extractTagIDs(tagList)
		result.TagChanged = true
	}

	if len(updateMap) == 0 && !result.TagChanged {
		result.Noop = true
		return &article, result, nil
	}

	if !site_service.GetRuntimeArticle().SkipExamining && article.Status == enum.ArticleStatusPublished {
		updateMap["status"] = enum.ArticleStatusExamining
	}

	if err := s.DB.Transaction(func(tx *gorm.DB) error {
		if len(updateMap) > 0 {
			if err := tx.Model(&article).Updates(updateMap).Error; err != nil {
				return err
			}
		}
		if result.TagChanged {
			return syncArticleTags(tx, article.ID, result.NewTagIDs)
		}
		return nil
	}); err != nil {
		return nil, articleUpdateResult{}, err
	}

	return &article, result, nil
}
