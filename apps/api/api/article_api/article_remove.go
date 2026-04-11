package article_api

import (
	"fmt"
	"myblogx/common/res"
	"myblogx/middleware"
	"myblogx/models"
	"myblogx/service/article_service"

	"github.com/gin-gonic/gin"
)

func (h ArticleApi) ArticleRemoveView(c *gin.Context) {
	cr := middleware.GetBindJson[models.IDListRequest](c)

	var list []models.ArticleModel
	h.App.DB.Find(&list, "id in ?", cr.IDList)

	if len(list) == 0 {
		res.FailWithMsg("删除失败，文章不存在", c)
		return
	}
	if err := article_service.DeleteArticles(h.App.DB, list, false); err != nil {
		res.FailWithMsg("删除文章失败", c)
		return
	}
	res.OkWithMsg(fmt.Sprintf("文章删除成功, 成功删除%d条", len(list)), c)
	middleware.EmitActionAuditFromGin(c, middleware.GinAuditInput{
		ActionName:  "article_admin_remove",
		TargetType:  "article",
		Success:     true,
		Message:     fmt.Sprintf("文章删除成功, 成功删除%d条", len(list)),
		RequestBody: map[string]any{"id_list": cr.IDList},
		ResponseBody: map[string]any{
			"deleted_count": len(list),
		},
		UseRawRequestBody: true,
		UseRawRequestHead: true,
	})
}
