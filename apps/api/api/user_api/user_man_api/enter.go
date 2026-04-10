package user_man_api

import (
	"myblogx/appctx"

	"github.com/gin-gonic/gin"
)

type UserManApi struct {
}

func New(ctx *appctx.AppContext) UserManApi {
	_ = ctx
	return UserManApi{}
}

func mustApp(c *gin.Context) *appctx.AppContext {
	return appctx.MustFromGin(c)
}
