package app

import (
	"database/sql"
	"fmt"

	"myblogx/conf"
	"myblogx/core"
	"myblogx/platform/cachex"
	"myblogx/platform/dbx"
	"myblogx/platform/searchx"
	"myblogx/service/log_service"
	"myblogx/service/site_service"

	"github.com/elastic/go-elasticsearch/v7"
	"github.com/go-redis/redis/v8"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

// Infra 是启动后可复用的基础设施句柄集合。
type Infra struct {
	Version    string
	ConfigFile string
	Config     *conf.Config

	Logger      *logrus.Logger
	DB          *gorm.DB
	Redis       *redis.Client
	ESClient    *elasticsearch.Client
	ClickHouse  *sql.DB
	RuntimeSite *site_service.RuntimeConfigService
}

// Bootstrap 统一初始化基础设施：Logger/Redis/DB/ES/RuntimeConfigService。
func Bootstrap(cfg *conf.Config, configFile string, version string) (*Infra, error) {
	if cfg == nil {
		return nil, fmt.Errorf("bootstrap 失败: 配置不能为空")
	}
	normalizeConfig(cfg)

	if err := core.InitSnowflake(cfg); err != nil {
		return nil, fmt.Errorf("bootstrap 失败: %w", err)
	}

	logger := core.InitLogrus(&cfg.Log, &cfg.System)
	redisClient := cachex.Init(&cfg.Redis, logger)
	db := dbx.Init(cfg.DB, cfg.GORM, cfg.Log, logger, redisClient)
	clickHouse := core.InitClickHouse(&cfg.ClickHouse)
	esClient := searchx.Init(&cfg.ES, logger)

	if err := log_service.EnsureDailyLogFiles(log_service.Deps{
		LogConfig:        cfg.Log,
		SystemConfig:     cfg.System,
		ClickHouseEnable: cfg.ClickHouse.Enabled,
		Logger:           logger,
		ClickHouse:       clickHouse,
	}); err != nil {
		logger.Errorf("初始化结构化日志文件失败: %v", err)
	}

	runtimeSite, err := core.InitRuntimeSite(cfg, logger, db, configFile)
	if err != nil {
		return nil, fmt.Errorf("bootstrap 失败: 运行时站点配置初始化失败: %w", err)
	}

	return &Infra{
		Version:     version,
		ConfigFile:  configFile,
		Config:      cfg,
		Logger:      logger,
		DB:          db,
		Redis:       redisClient,
		ESClient:    esClient,
		ClickHouse:  clickHouse,
		RuntimeSite: runtimeSite,
	}, nil
}

func validateInfra(infra *Infra) error {
	if infra == nil {
		return fmt.Errorf("infra 不能为空")
	}
	if infra.Config == nil {
		return fmt.Errorf("infra.Config 不能为空")
	}
	if infra.Logger == nil {
		return fmt.Errorf("infra.Logger 不能为空")
	}
	return nil
}
