package view_history

import (
	"myblogx/appctx"

	"github.com/gin-gonic/gin"
)

type ViewHistoryApi struct {
}

func New(ctx *appctx.AppContext) ViewHistoryApi {
	_ = ctx
	return ViewHistoryApi{}
}

func mustApp(c *gin.Context) *appctx.AppContext {
	return appctx.MustFromGin(c)
}
