package article_api

import (
	"errors"
	"myblogx/common/res"
	"myblogx/middleware"
	"myblogx/models/enum"
	"myblogx/service/log_service"
	"myblogx/service/redis_service"
	"myblogx/service/site_service"
	"myblogx/utils/jwts"
	"strconv"

	"github.com/gin-gonic/gin"
)

func (ArticleApi) ArticleCreateView(c *gin.Context) {
	cr := middleware.GetBindJson[ArticleCreateRequest](c)
	claims := jwts.MustGetClaimsByGin(c)
	writer := newArticleWriteService(mustApp(c).DB, mustApp(c).Logger)

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

	applyTagArticleCountDelta(redis_service.DepsFromGin(c), buildTagArticleCountDelta(nil, tagIDs))

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
