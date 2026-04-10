package core

import (
	"myblogx/appctx"
	"myblogx/service/river_service"
)

func InitMySQLES(ctx *appctx.AppContext) {
	if !ctx.Config.River.Enabled {
		ctx.Logger.Infof("配置中未启用 MySQL 同步任务")
		return
	}

	r, err := river_service.NewRiver(ctx.Config.River, ctx.Logger, ctx.DB, ctx.ESClient)
	if err != nil {
		ctx.Logger.Fatal(err)
	}

	go r.Run()
}
