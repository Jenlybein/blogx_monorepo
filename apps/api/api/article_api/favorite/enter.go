package favorite

import (
	"myblogx/appctx"

	"github.com/gin-gonic/gin"
)

type FavoriteApi struct {
}

func New(ctx *appctx.AppContext) FavoriteApi {
	_ = ctx
	return FavoriteApi{}
}

func mustApp(c *gin.Context) *appctx.AppContext {
	return appctx.MustFromGin(c)
}
