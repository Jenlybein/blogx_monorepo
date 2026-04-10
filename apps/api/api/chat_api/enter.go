package chat_api

import (
	"myblogx/appctx"

	"github.com/gin-gonic/gin"
)

type ChatApi struct {
}

func New(ctx *appctx.AppContext) ChatApi {
	_ = ctx
	return ChatApi{}
}

func mustApp(c *gin.Context) *appctx.AppContext {
	return appctx.MustFromGin(c)
}
