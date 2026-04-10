package image_api

import (
	"myblogx/appctx"

	"github.com/gin-gonic/gin"
)

type ImageApi struct{}

func New(ctx *appctx.AppContext) ImageApi {
	_ = ctx
	return ImageApi{}
}

func mustApp(c *gin.Context) *appctx.AppContext {
	return appctx.MustFromGin(c)
}
