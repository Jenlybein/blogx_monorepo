package ai_api

import (
	"myblogx/appctx"

	"github.com/gin-gonic/gin"
)

type AIApi struct {
}

func New(ctx *appctx.AppContext) AIApi {
	_ = ctx
	return AIApi{}
}

func mustApp(c *gin.Context) *appctx.AppContext {
	return appctx.MustFromGin(c)
}
