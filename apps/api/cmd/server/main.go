// 主程序入口

package main

import (
	"myblogx/api"
	"myblogx/appctx"
	"myblogx/buildinfo"
	"myblogx/core"
	"myblogx/flags"
	"myblogx/router"
	"myblogx/service/cron_service"
	"myblogx/service/log_service"

	"github.com/mojocn/base64Captcha"
)

func main() {
	flag := flags.Parse()

	config := core.ReadCfg(&flag.File)
	if err := core.InitSnowflake(config); err != nil {
		panic(err)
	}

	logger := core.InitLogrus(&config.Log, &config.System)
	redisClient := core.InitRedis(&config.Redis, logger)
	db := core.InitDB(config.DB, config.GORM, config.Log, logger, redisClient)
	clickHouse := core.InitClickHouse(&config.ClickHouse)
	esClient := core.EsConnect(&config.ES, logger)

	if err := log_service.EnsureDailyLogFiles(log_service.Deps{
		LogConfig:        config.Log,
		SystemConfig:     config.System,
		ClickHouseEnable: config.ClickHouse.Enabled,
		Logger:           logger,
		ClickHouse:       clickHouse,
	}); err != nil {
		logger.Errorf("初始化结构化日志文件失败: %v", err)
	}

	flags.Run(flag, flags.Deps{
		RiverConfig: config.River,
		Logger:      logger,
		DB:          db,
		ESClient:    esClient,
		ESIndex:     config.ES.Index,
	})
	if err := core.InitRuntimeSite(config, logger, db, flag.File); err != nil {
		logger.Fatalf("运行时站点配置初始化失败: %v", err)
	}

	ctx := appctx.New(
		buildinfo.Version,
		flag.File,
		config,
		logger,
		db,
		redisClient,
		clickHouse,
		esClient,
		base64Captcha.DefaultMemStore,
	)

	core.InitMySQLES(ctx)
	core.InitImageRefRiver(ctx)

	cron_service.NewScheduler(ctx).Start()

	router.Run(ctx, api.New(ctx))
}
