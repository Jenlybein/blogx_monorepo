package data_api

import (
	"myblogx/appctx"

	"github.com/gin-gonic/gin"
)

type DataApi struct {
}

func New(ctx *appctx.AppContext) DataApi {
	_ = ctx
	return DataApi{}
}

func mustApp(c *gin.Context) *appctx.AppContext {
	return appctx.MustFromGin(c)
}
