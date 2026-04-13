package article_api

import (
	"errors"

	"myblogx/models"
	"myblogx/models/ctype"
	"myblogx/models/enum"
	"myblogx/service/site_service"
	"myblogx/service/user_service"
	"myblogx/utils/jwts"
	"myblogx/utils/markdown"

	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

var (
	errArticleUserNotFound     = errors.New("用户不存在")
	errArticleNotFound         = errors.New("文章不存在")
	errArticleCategoryNotFound = errors.New("分类不存在")
	errArticleTagInvalid       = errors.New("标签不存在或已停用")
)

type articleWriteService struct {
	DB          *gorm.DB
	Logger      *logrus.Logger
	RuntimeSite *site_service.RuntimeConfigService
}

type articleUpdateResult struct {
	UpdateMap  map[string]any
	OldTagIDs  []ctype.ID
	NewTagIDs  []ctype.ID
	TagChanged bool
	ContentSet bool
	Noop       bool
}

func newArticleWriteService(db *gorm.DB, logger *logrus.Logger, runtimeSite *site_service.RuntimeConfigService) *articleWriteService {
	return &articleWriteService{
		DB:          db,
		Logger:      logger,
		RuntimeSite: runtimeSite,
	}
}

func (h *articleWriteService) CreateArticle(claims *jwts.MyClaims, cr ArticleCreateRequest) (*models.ArticleModel, []ctype.ID, error) {
	if h.RuntimeSite == nil {
		return nil, nil, errors.New("运行时配置服务未初始化")
	}
	runtimeSite := h.RuntimeSite.GetRuntimeSite()

	if err := h.DB.Take(&models.UserModel{}, claims.UserID).Error; err != nil {
		return nil, nil, errArticleUserNotFound
	}

	if err := validateArticleCategory(h.DB, claims.UserID, cr.CategoryID); err != nil {
		return nil, nil, errArticleCategoryNotFound
	}

	tagList, err := loadEnabledTagsByIDs(h.DB, cr.TagIDs)
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
	if err := h.DB.Transaction(func(tx *gorm.DB) error {
		if err := tx.Create(article).Error; err != nil {
			return err
		}
		if err := syncArticleTags(tx, article.ID, tagIDs); err != nil {
			return err
		}
		return user_service.StatApplyArticleDelta(tx, article.AuthorID, 1, 0)
	}); err != nil {
		return nil, nil, err
	}

	return article, tagIDs, nil
}

func (h *articleWriteService) UpdateArticle(articleID ctype.ID, claims *jwts.MyClaims, cr ArticleUpdateRequest) (*models.ArticleModel, articleUpdateResult, error) {
	if err := h.DB.Take(&models.UserModel{}, claims.UserID).Error; err != nil {
		return nil, articleUpdateResult{}, errArticleUserNotFound
	}

	var article models.ArticleModel
	if err := h.DB.Take(&article, "id = ? AND author_id = ?", articleID, claims.UserID).Error; err != nil {
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
			if err := validateArticleCategory(h.DB, claims.UserID, cr.CategoryID); err != nil {
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
		oldTagIDs, err := loadArticleTagIDs(h.DB, article.ID)
		if err != nil {
			return nil, articleUpdateResult{}, err
		}

		tagList, err := loadEnabledTagsByIDs(h.DB, *cr.TagIDs)
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

	if h.RuntimeSite == nil {
		return nil, articleUpdateResult{}, errors.New("运行时配置服务未初始化")
	}
	if !h.RuntimeSite.GetRuntimeArticle().SkipExamining && article.Status == enum.ArticleStatusPublished {
		updateMap["status"] = enum.ArticleStatusExamining
	}

	if err := h.DB.Transaction(func(tx *gorm.DB) error {
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
