package appctx

import (
	"database/sql"

	"myblogx/conf"

	"github.com/elastic/go-elasticsearch/v7"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/mojocn/base64Captcha"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

const ginContextKey = "_app_ctx"

type AppContext struct {
	Version           string
	ConfigFile        string
	Config            *conf.Config
	Logger            *logrus.Logger
	DB                *gorm.DB
	Redis             *redis.Client
	ClickHouse        *sql.DB
	ESClient          *elasticsearch.Client
	ImageCaptchaStore base64Captcha.Store
}

func New(version string, configFile string, config *conf.Config, logger *logrus.Logger, db *gorm.DB, redisClient *redis.Client, clickHouse *sql.DB, esClient *elasticsearch.Client, imageCaptchaStore base64Captcha.Store) *AppContext {
	return &AppContext{
		Version:           version,
		ConfigFile:        configFile,
		Config:            config,
		Logger:            logger,
		DB:                db,
		Redis:             redisClient,
		ClickHouse:        clickHouse,
		ESClient:          esClient,
		ImageCaptchaStore: imageCaptchaStore,
	}
}

func WithGin(c *gin.Context, ctx *AppContext) {
	c.Set(ginContextKey, ctx)
}

func FromGin(c *gin.Context) (*AppContext, bool) {
	value, ok := c.Get(ginContextKey)
	if !ok {
		return nil, false
	}
	ctx, ok := value.(*AppContext)
	return ctx, ok
}

func MustFromGin(c *gin.Context) *AppContext {
	ctx, ok := FromGin(c)
	if ok && ctx != nil {
		return ctx
	}
	panic("app context not found in gin context")
}
