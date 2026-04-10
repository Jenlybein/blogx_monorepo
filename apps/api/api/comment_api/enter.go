package comment_api

import (
	"myblogx/appctx"

	"github.com/gin-gonic/gin"
)

type CommentApi struct {
}

func New(ctx *appctx.AppContext) CommentApi {
	_ = ctx
	return CommentApi{}
}

func mustApp(c *gin.Context) *appctx.AppContext {
	return appctx.MustFromGin(c)
}
