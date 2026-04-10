package banner_api

import (
	"fmt"
	"myblogx/appctx"
	"myblogx/common"
	"myblogx/common/res"
	"myblogx/middleware"
	"myblogx/models"
	"myblogx/service/log_service"
	"strconv"

	"github.com/gin-gonic/gin"
)

type BannerApi struct{}

func New(ctx *appctx.AppContext) BannerApi {
	_ = ctx
	return BannerApi{}
}

func mustApp(c *gin.Context) *appctx.AppContext {
	return appctx.MustFromGin(c)
}

type BannerCreateRequest struct {
	Cover string `json:"cover" binding:"required"`
	Href  string `json:"href"`
	Show  bool   `json:"show"`
}

func (BannerApi) BannerCreateView(c *gin.Context) {
	cr := middleware.GetBindJson[BannerCreateRequest](c)

	model := models.BannerModel{
		Cover: cr.Cover,
		Href:  cr.Href,
		Show:  cr.Show,
	}
	if err := mustApp(c).DB.Create(&model).Error; err != nil {
		res.FailWithError(err, c)
		return
	}
	res.OkWithMsg("创建轮播图成功", c)
	log_service.EmitActionAuditFromGin(c, log_service.GinAuditInput{
		ActionName:        "banner_create",
		TargetType:        "banner",
		TargetID:          strconv.FormatUint(uint64(model.ID), 10),
		Success:           true,
		Message:           "创建轮播图成功",
		RequestBody:       cr,
		UseRawRequestBody: true,
		UseRawRequestHead: true,
	})
}

type BannerListRequest struct {
	common.PageInfo
	Show bool `form:"show"`
}

func (BannerApi) BannerListView(c *gin.Context) {
	cr := middleware.GetBindQuery[BannerListRequest](c)

	list, hasMore, err := common.ListQueryHasMore(models.BannerModel{
		Show: cr.Show,
	}, common.Options{
		DB:       mustApp(c).DB,
		PageInfo: cr.PageInfo,
	})
	if err != nil {
		res.FailWithError(err, c)
		return
	}

	res.OkWithHasMoreList(list, hasMore, c)
}

func (BannerApi) BannerRemoveView(c *gin.Context) {
	cr := middleware.GetBindJson[models.IDListRequest](c)

	var list []models.BannerModel
	if err := mustApp(c).DB.Find(&list, "id IN ?", cr.IDList).Error; err != nil {
		res.FailWithError(err, c)
		return
	}
	if len(list) > 0 {
		if err := mustApp(c).DB.Delete(&list).Error; err != nil {
			res.FailWithError(err, c)
			return
		}
	}
	res.OkWithMsg(fmt.Sprintf("请求删除轮播图%d个, 成功%d条", len(cr.IDList), len(list)), c)
	log_service.EmitActionAuditFromGin(c, log_service.GinAuditInput{
		ActionName:  "banner_remove",
		TargetType:  "banner",
		Success:     true,
		Message:     fmt.Sprintf("请求删除轮播图%d个, 成功%d条", len(cr.IDList), len(list)),
		RequestBody: map[string]any{"id_list": cr.IDList},
		ResponseBody: map[string]any{
			"deleted_count": len(list),
		},
		UseRawRequestBody: true,
		UseRawRequestHead: true,
	})
}

func (BannerApi) BannerUpdateView(c *gin.Context) {
	id := middleware.GetBindUri[models.IDRequest](c)

	cr := middleware.GetBindJson[BannerCreateRequest](c)

	var model models.BannerModel
	if err := mustApp(c).DB.Take(&model, id.ID).Error; err != nil {
		res.FailWithMsg("轮播图不存在", c)
		return
	}

	if err := mustApp(c).DB.Model(&model).Updates(models.BannerModel{
		Cover: cr.Cover,
		Href:  cr.Href,
		Show:  cr.Show,
	}).Error; err != nil {
		res.FailWithError(err, c)
		return
	}
	res.OkWithMsg("更新轮播图成功", c)
	log_service.EmitActionAuditFromGin(c, log_service.GinAuditInput{
		ActionName:        "banner_update",
		TargetType:        "banner",
		TargetID:          strconv.FormatUint(uint64(model.ID), 10),
		Success:           true,
		Message:           "更新轮播图成功",
		RequestBody:       cr,
		UseRawRequestBody: true,
		UseRawRequestHead: true,
	})
}
