package user_service

import (
	"myblogx/appctx"
	"myblogx/conf"
	"myblogx/service/redis_service"

	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

type Deps struct {
	JWT    conf.Jwt
	Env    string
	DB     *gorm.DB
	Logger *logrus.Logger
	Redis  redis_service.Deps
}

func DepsFromApp(ctx *appctx.AppContext) Deps {
	if ctx == nil || ctx.Config == nil {
		return Deps{}
	}
	return Deps{
		JWT:    ctx.Config.Jwt,
		Env:    ctx.Config.System.Env,
		DB:     ctx.DB,
		Logger: ctx.Logger,
		Redis:  redis_service.DepsFromApp(ctx),
	}
}

func DepsFromGin(c *gin.Context) Deps {
	return DepsFromApp(appctx.MustFromGin(c))
}
