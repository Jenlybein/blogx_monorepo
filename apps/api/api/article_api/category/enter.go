package category

import (
	"myblogx/appctx"

	"github.com/gin-gonic/gin"
)

type CategoryApi struct {
}

func New(ctx *appctx.AppContext) CategoryApi {
	_ = ctx
	return CategoryApi{}
}

func mustApp(c *gin.Context) *appctx.AppContext {
	return appctx.MustFromGin(c)
}
