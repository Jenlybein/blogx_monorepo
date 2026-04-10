package appctx

import (
	"database/sql"

	"myblogx/conf"
	"myblogx/global"

	"github.com/elastic/go-elasticsearch/v7"
	"github.com/gin-gonic/gin"
	"github.com/go-redis/redis/v8"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

const ginContextKey = "_app_ctx"

type AppContext struct {
	Config     *conf.Config
	Logger     *logrus.Logger
	DB         *gorm.DB
	Redis      *redis.Client
	ClickHouse *sql.DB
	ESClient   *elasticsearch.Client
}

func New(config *conf.Config, logger *logrus.Logger, db *gorm.DB, redisClient *redis.Client, clickHouse *sql.DB, esClient *elasticsearch.Client) *AppContext {
	return &AppContext{
		Config:     config,
		Logger:     logger,
		DB:         db,
		Redis:      redisClient,
		ClickHouse: clickHouse,
		ESClient:   esClient,
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
	// 兼容仍直接调用 handler / middleware 的旧测试与旧入口，
	// 避免依赖注入改造期间把所有测试一次性打碎。
	if global.Config != nil || global.Logger != nil || global.DB != nil || global.Redis != nil || global.ClickHouse != nil || global.ESClient != nil {
		return New(global.Config, global.Logger, global.DB, global.Redis, global.ClickHouse, global.ESClient)
	}
	panic("app context not found in gin context")
}
