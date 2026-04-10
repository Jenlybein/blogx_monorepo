package core

import (
	"myblogx/appctx"
	"myblogx/service/image_ref_river_service"
)

func InitImageRefRiver(ctx *appctx.AppContext) {
	if !ctx.Config.ImageRefRiver.Enabled {
		ctx.Logger.Infof("配置中未启用图片引用监听")
		return
	}

	r, err := image_ref_river_service.NewRiver(ctx.Config.ImageRefRiver, ctx.Config.QiNiu, ctx.Logger, ctx.DB)
	if err != nil {
		ctx.Logger.Fatal(err)
	}
	go func() {
		if err := r.Run(); err != nil {
			ctx.Logger.Errorf("图片引用监听运行失败: %v", err)
		}
	}()
}
