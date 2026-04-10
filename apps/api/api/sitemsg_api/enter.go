package sitemsg_api

import (
	"myblogx/appctx"

	"github.com/gin-gonic/gin"
)

type SitemsgApi struct {
}

func New(ctx *appctx.AppContext) SitemsgApi {
	_ = ctx
	return SitemsgApi{}
}

func mustApp(c *gin.Context) *appctx.AppContext {
	return appctx.MustFromGin(c)
}
