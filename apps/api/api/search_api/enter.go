package search_api

import (
	"myblogx/appctx"

	"github.com/gin-gonic/gin"
)

type SearchApi struct{}

func New(ctx *appctx.AppContext) SearchApi {
	_ = ctx
	return SearchApi{}
}

func mustApp(c *gin.Context) *appctx.AppContext {
	return appctx.MustFromGin(c)
}
