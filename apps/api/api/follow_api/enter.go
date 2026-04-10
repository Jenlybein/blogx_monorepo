package follow_api

import (
	"myblogx/appctx"

	"github.com/gin-gonic/gin"
)

type FollowApi struct{}

func New(ctx *appctx.AppContext) FollowApi {
	_ = ctx
	return FollowApi{}
}

func mustApp(c *gin.Context) *appctx.AppContext {
	return appctx.MustFromGin(c)
}
