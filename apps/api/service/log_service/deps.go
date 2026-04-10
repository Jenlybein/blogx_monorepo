package log_service

import (
	"database/sql"

	"myblogx/appctx"
	"myblogx/conf"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
)

type Deps struct {
	LogConfig        conf.Logrus
	SystemConfig     conf.System
	ClickHouseEnable bool
	Logger           *logrus.Logger
	ClickHouse       *sql.DB
}

func DepsFromApp(ctx *appctx.AppContext) Deps {
	if ctx == nil || ctx.Config == nil {
		return Deps{}
	}
	return Deps{
		LogConfig:        ctx.Config.Log,
		SystemConfig:     ctx.Config.System,
		ClickHouseEnable: ctx.Config.ClickHouse.Enabled,
		Logger:           ctx.Logger,
		ClickHouse:       ctx.ClickHouse,
	}
}

func DepsFromGin(c *gin.Context) Deps {
	if c == nil {
		return Deps{}
	}
	return DepsFromApp(appctx.MustFromGin(c))
}

