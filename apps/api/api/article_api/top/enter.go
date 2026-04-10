package top

import (
	"myblogx/appctx"

	"github.com/gin-gonic/gin"
)

type TopApi struct {
}

func New(ctx *appctx.AppContext) TopApi {
	_ = ctx
	return TopApi{}
}

func mustApp(c *gin.Context) *appctx.AppContext {
	return appctx.MustFromGin(c)
}
