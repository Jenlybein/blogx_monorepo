package tags

import (
	"myblogx/appctx"

	"github.com/gin-gonic/gin"
)

type TagsApi struct{}

func New(ctx *appctx.AppContext) TagsApi {
	_ = ctx
	return TagsApi{}
}

func mustApp(c *gin.Context) *appctx.AppContext {
	return appctx.MustFromGin(c)
}
