package article_api

import (
	"errors"
	"myblogx/common/res"
	"myblogx/global"
	"myblogx/middleware"
	"myblogx/models/ctype"
	"myblogx/models/enum"
	"myblogx/service/es_service"
	"myblogx/service/log_service"
	"myblogx/service/site_service"
	"myblogx/utils/jwts"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (ArticleApi) ArticleCreateView(c *gin.Context) {
	cr := middleware.GetBindJson[ArticleCreateRequest](c)
	claims := jwts.MustGetClaimsByGin(c)
	writer := newArticleWriteService(global.DB, global.Logger)

	if claims.Role != enum.RoleAdmin && site_service.GetRuntimeSite().SiteInfo.Mode == enum.SiteModeBlog {
		res.FailWithMsg("站点处于个人博客模式，普通用户无法创建文章", c)
		return
	}

	article, tagIDs, err := writer.CreateArticle(claims, cr)
	if err != nil {
		switch {
		case errors.Is(err, errArticleUserNotFound), errors.Is(err, errArticleCategoryNotFound):
			res.FailWithMsg(err.Error(), c)
		default:
			res.FailWithMsg("创建文章失败", c)
		}
		return
	}

	applyTagArticleCountDelta(buildTagArticleCountDelta(nil, tagIDs))
	if len(tagIDs) > 0 {
		if err := es_service.UpdateESDocsTags([]ctype.ID{article.ID}); err != nil {
			global.Logger.Errorf("创建文章后刷新 ES 标签失败: 文章ID=%d 错误=%v", article.ID, err)
		}
	}

	res.OkWithMsg("创建文章成功", c)

	log_service.EmitActionAuditFromGin(c, log_service.GinAuditInput{
		ActionName: "article_create",
		TargetType: "article",
		TargetID:   strconv.FormatUint(uint64(article.ID), 10),
		Success:    true,
		Message:    "创建文章成功",
		RequestBody: map[string]any{
			"title":           cr.Title,
			"abstract":        cr.Abstract,
			"cover":           cr.Cover,
			"category_id":     cr.CategoryID,
			"status":          cr.Status,
			"comments_toggle": cr.CommentsToggle,
			"tag_ids":         cr.TagIDs,
			"content_length":  len(cr.Content),
			"content_changed": len(cr.Content) > 0,
		},
	})
}
