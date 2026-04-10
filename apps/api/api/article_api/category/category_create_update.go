package category

import (
	"errors"
	"fmt"
	"myblogx/common/res"
	"myblogx/middleware"
	"myblogx/models"
	"myblogx/models/ctype"
	"myblogx/service/es_service"
	"myblogx/service/log_service"
	"myblogx/utils/jwts"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

// 创建或者编辑分类（传入ID则视为创建，不传入则视为编辑）
func (CategoryApi) CategoryCreateUpdateView(c *gin.Context) {
	cr := middleware.GetBindJson[CategoryRequest](c)
	claims := jwts.MustGetClaimsByGin(c)

	// 创建
	if cr.ID == 0 {
		// 分类创建改为直接创建新记录，不再恢复同名软删数据。
		if err := mustApp(c).DB.Create(&models.CategoryModel{
			Title:  cr.Title,
			UserID: claims.UserID,
		}).Error; err != nil {
			if errors.Is(err, gorm.ErrDuplicatedKey) {
				res.FailWithMsg("分类名称重复", c)
				return
			}
			res.FailWithMsg(fmt.Sprintf("创建分类失败 %v", err), c)
			return
		}
		res.OkWithMsg("创建成功", c)
		log_service.EmitActionAuditFromGin(c, log_service.GinAuditInput{
			ActionName:        "category_create",
			TargetType:        "category",
			Success:           true,
			Message:           "创建分类成功",
			RequestBody:       cr,
			UseRawRequestBody: true,
		})
		return
	}

	// 编辑
	var category models.CategoryModel
	if err := mustApp(c).DB.Take(&category, "user_id = ? and id = ?", claims.UserID, cr.ID).Error; err != nil {
		res.FailWithMsg("分类不存在", c)
		return
	}

	if err := mustApp(c).DB.Model(&category).Update("title", cr.Title).Error; err != nil {
		if errors.Is(err, gorm.ErrDuplicatedKey) {
			res.FailWithMsg("分类名称重复", c)
			return
		}
		res.FailWithMsg(fmt.Sprintf("更新分类失败 %v", err), c)
		return
	}
	if err := es_service.SyncESDocsByCategoryIDs([]ctype.ID{category.ID}); err != nil {
		mustApp(c).Logger.Errorf("同步分类相关文章 ES 文档失败: 分类ID=%d 错误=%v", category.ID, err)
	}
	res.OkWithMsg("更新分类成功", c)
	log_service.EmitActionAuditFromGin(c, log_service.GinAuditInput{
		ActionName:        "category_update",
		TargetType:        "category",
		TargetID:          strconv.FormatUint(uint64(category.ID), 10),
		Success:           true,
		Message:           "更新分类成功",
		RequestBody:       cr,
		UseRawRequestBody: true,
	})
}
