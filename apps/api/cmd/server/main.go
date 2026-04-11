// 主程序入口

package main

import (
	"myblogx/api"
	"myblogx/apideps"
	"myblogx/buildinfo"
	"myblogx/core"
	"myblogx/flags"
	"myblogx/platform/cachex"
	"myblogx/platform/dbx"
	"myblogx/platform/searchx"
	"myblogx/router"
	"myblogx/service/cron_service"
	"myblogx/service/log_service"
	"strings"

	"github.com/mojocn/base64Captcha"
)

func main() {
	flag := flags.Parse()

	config := core.ReadCfg(&flag.File)
	if err := core.InitSnowflake(config); err != nil {
		panic(err)
	}

	logger := core.InitLogrus(&config.Log, &config.System)
	redisClient := cachex.Init(&config.Redis, logger)
	db := dbx.Init(config.DB, config.GORM, config.Log, logger, redisClient)
	clickHouse := core.InitClickHouse(&config.ClickHouse)
	esClient := searchx.Init(&config.ES, logger)

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
	runtimeSite, err := core.InitRuntimeSite(config, logger, db, flag.File)
	if err != nil {
		logger.Fatalf("运行时站点配置初始化失败: %v", err)
	}

	apiDeps := apideps.Deps{
		Version:           buildinfo.Version,
		ConfigFile:        flag.File,
		System:            config.System,
		JWT:               config.Jwt,
		Log:               config.Log,
		ClickHouseConfig:  config.ClickHouse,
		ES:                config.ES,
		QQ:                config.QQ,
		Email:             config.Email,
		QiNiu:             config.QiNiu,
		Upload:            config.Upload,
		Logger:            logger,
		DB:                db,
		Redis:             redisClient,
		ClickHouse:        clickHouse,
		ESClient:          esClient,
		RuntimeSite:       runtimeSite,
		ImageCaptchaStore: base64Captcha.DefaultMemStore,
	}

	role := strings.ToLower(strings.TrimSpace(flag.Role))
	switch role {
	case "api":
		router.Run(apiDeps, api.New(apiDeps))
		return
	case "river":
		core.InitMySQLES(core.MySQLESDeps{
			RiverConfig: config.River,
			Logger:      logger,
			DB:          db,
			ESClient:    esClient,
		})
		select {}
	case "image-ref":
		core.InitImageRefRiver(core.ImageRefRiverDeps{
			ImageRefRiverConfig: config.ImageRefRiver,
			QiNiuConfig:         config.QiNiu,
			Logger:              logger,
			DB:                  db,
		})
		select {}
	case "cron":
		cron_service.NewSchedulerRaw(db, redisClient, logger).Start()
		select {}
	case "worker":
		core.InitMySQLES(core.MySQLESDeps{
			RiverConfig: config.River,
			Logger:      logger,
			DB:          db,
			ESClient:    esClient,
		})
		core.InitImageRefRiver(core.ImageRefRiverDeps{
			ImageRefRiverConfig: config.ImageRefRiver,
			QiNiuConfig:         config.QiNiu,
			Logger:              logger,
			DB:                  db,
		})
		cron_service.NewSchedulerRaw(db, redisClient, logger).Start()
		select {}
	case "all":
		core.InitMySQLES(core.MySQLESDeps{
			RiverConfig: config.River,
			Logger:      logger,
			DB:          db,
			ESClient:    esClient,
		})
		core.InitImageRefRiver(core.ImageRefRiverDeps{
			ImageRefRiverConfig: config.ImageRefRiver,
			QiNiuConfig:         config.QiNiu,
			Logger:              logger,
			DB:                  db,
		})
		cron_service.NewSchedulerRaw(db, redisClient, logger).Start()
		router.Run(apiDeps, api.New(apiDeps))
		return
	default:
		logger.Fatalf("未知 role 参数: %s，可选值: api|river|image-ref|cron|worker|all", role)
	}
}
