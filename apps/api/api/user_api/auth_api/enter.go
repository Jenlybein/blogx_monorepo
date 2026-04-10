package auth_api

import (
	"myblogx/appctx"

	"github.com/gin-gonic/gin"
)

type AuthApi struct {
}

func New(ctx *appctx.AppContext) AuthApi {
	_ = ctx
	return AuthApi{}
}

func mustApp(c *gin.Context) *appctx.AppContext {
	return appctx.MustFromGin(c)
}
