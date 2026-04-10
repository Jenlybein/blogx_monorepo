package core

import (
	"myblogx/appctx"
	"myblogx/service/es_service"
	"myblogx/service/river_service"
)

func InitMySQLES(ctx *appctx.AppContext) {
	if !ctx.Config.River.Enabled {
		ctx.Logger.Infof("配置中未启用 MySQL 同步任务")
		return
	}

	es_service.Configure(ctx.DB, ctx.ESClient)
	river_service.Configure(ctx.Config.River, ctx.Logger)
	r, err := river_service.NewRiver()
	if err != nil {
		ctx.Logger.Fatal(err)
	}

	go r.Run()
}
