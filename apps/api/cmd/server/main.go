// 主程序入口

package main

import (
	"myblogx/api"
	"myblogx/appctx"
	"myblogx/buildinfo"
	"myblogx/common"
	"myblogx/core"
	"myblogx/flags"
	"myblogx/models"
	"myblogx/router"
	"myblogx/service/ai_service"
	"myblogx/service/article_service"
	"myblogx/service/chat_service"
	"myblogx/service/cron_service"
	"myblogx/service/email_service"
	"myblogx/service/follow_service"
	"myblogx/service/image_service"
	"myblogx/service/log_service"
	"myblogx/service/message_service"
	"myblogx/service/qq_service"
	"myblogx/service/search_service"
	"myblogx/service/user_service"
	"myblogx/utils/ipmeta"
	"myblogx/utils/jwts"

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

	log_service.Configure(config.Log, config.System, config.ClickHouse, logger, clickHouse)
	email_service.Configure(config.Email)
	common.Configure(db)
	models.Configure(config.ES.Index)
	flags.Configure(config.River, logger, db, esClient)
	user_service.Configure(config.Jwt, config.System.Env, db, logger)
	message_service.Configure(db, logger)
	search_service.Configure(db)
	follow_service.Configure(db)
	article_service.Configure(logger)
	chat_service.Configure(db, logger)
	image_service.Configure(config.QiNiu, config.Upload, db, logger)
	qq_service.Configure(config.QQ)
	ai_service.Configure(db, logger)
	jwts.Configure(config.Jwt)
	ipmeta.Configure(logger)

	if err := log_service.EnsureDailyLogFiles(); err != nil {
		logger.Errorf("初始化结构化日志文件失败: %v", err)
	}

	flags.Run(flag, db)
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
