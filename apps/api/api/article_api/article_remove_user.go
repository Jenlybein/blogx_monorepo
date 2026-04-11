package article_api

import (
	"myblogx/common/res"
	"myblogx/middleware"
	"myblogx/models"
	"myblogx/service/article_service"
	"myblogx/utils/jwts"

	"github.com/gin-gonic/gin"
)

func (h ArticleApi) ArticleRemoveUserView(c *gin.Context) {
	cr := middleware.GetBindUri[models.IDRequest](c)

	claims := jwts.GetClaimsByGin(c)

	var model models.ArticleModel
	if err := h.App.DB.Take(&model, "author_id = ? and id = ?", claims.UserID, cr.ID).Error; err != nil {
		res.FailWithMsg("文章不存在", c)
		return
	}

	// 软删除
	if err := article_service.DeleteArticles(h.App.DB, []models.ArticleModel{model}, false); err != nil {
		res.FailWithMsg("删除文章失败", c)
		return
	}
	res.OkWithMsg("文章删除成功", c)
}
