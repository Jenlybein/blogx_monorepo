package profile_api

import (
	"myblogx/appctx"

	"github.com/gin-gonic/gin"
)

type ProfileApi struct {
}

func New(ctx *appctx.AppContext) ProfileApi {
	_ = ctx
	return ProfileApi{}
}

func mustApp(c *gin.Context) *appctx.AppContext {
	return appctx.MustFromGin(c)
}
