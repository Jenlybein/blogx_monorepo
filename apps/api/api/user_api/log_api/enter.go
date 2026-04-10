package log_api

import (
	"myblogx/appctx"

	"github.com/gin-gonic/gin"
)

type LogApi struct {
}

func New(ctx *appctx.AppContext) LogApi {
	_ = ctx
	return LogApi{}
}

func mustApp(c *gin.Context) *appctx.AppContext {
	return appctx.MustFromGin(c)
}
