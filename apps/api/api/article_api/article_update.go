package article_api

import (
	"errors"
	"myblogx/common/res"
	"myblogx/global"
	"myblogx/middleware"
	"myblogx/models"
	"myblogx/models/ctype"
	"myblogx/service/es_service"
	"myblogx/service/log_service"
	"myblogx/service/read_service"
	"myblogx/utils/jwts"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (ArticleApi) ArticleUpdateView(c *gin.Context) {
	id := middleware.GetBindUri[models.IDRequest](c)
	cr := middleware.GetBindJson[ArticleUpdateRequest](c)
	claims := jwts.MustGetClaimsByGin(c)
	writer := newArticleWriteService(global.DB, global.Logger)
	article, result, err := writer.UpdateArticle(id.ID, claims, cr)
	if err != nil {
		switch {
		case errors.Is(err, errArticleUserNotFound), errors.Is(err, errArticleNotFound), errors.Is(err, errArticleCategoryNotFound):
			res.FailWithMsg(err.Error(), c)
		default:
			res.FailWithMsg("更新文章失败", c)
		}
		return
	}

	if result.Noop {
		res.OkWithMsg("更新文章成功", c)
		return
	}

	if result.TagChanged {
		applyTagArticleCountDelta(buildTagArticleCountDelta(result.OldTagIDs, result.NewTagIDs))
		if err := es_service.UpdateESDocsTags([]ctype.ID{article.ID}); err != nil {
			global.Logger.Errorf("更新文章标签后刷新 ES 标签失败: 文章ID=%d 错误=%v", article.ID, err)
		}
	} else if result.ContentSet {
		if err := es_service.UpdateESDocsContent([]ctype.ID{article.ID}); err != nil {
			global.Logger.Errorf("更新文章正文后刷新 ES 文档失败: 文章ID=%d 错误=%v", article.ID, err)
		}
	}
	if err := read_service.SyncArticleFavorSnapshots(global.DB, []ctype.ID{article.ID}); err != nil {
		global.Logger.Errorf("同步文章收藏快照失败: 文章ID=%d 错误=%v", article.ID, err)
	}
	res.OkWithMsg("更新文章成功", c)
	log_service.EmitActionAuditFromGin(c, log_service.GinAuditInput{
		ActionName: "article_update",
		TargetType: "article",
		TargetID:   strconv.FormatUint(uint64(article.ID), 10),
		Success:    true,
		Message:    "更新文章成功",
		RequestBody: map[string]any{
			"title":           cr.Title,
			"abstract":        cr.Abstract,
			"cover":           cr.Cover,
			"category_id":     cr.CategoryID,
			"status":          result.UpdateMap["status"],
			"comments_toggle": cr.CommentsToggle,
			"tag_ids":         cr.TagIDs,
			"content_length": func() int {
				if cr.Content == nil {
					return 0
				}
				return len(*cr.Content)
			}(),
			"content_changed": cr.Content != nil,
		},
	})
}
