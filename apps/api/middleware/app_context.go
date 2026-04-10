package middleware

import (
	"myblogx/appctx"

	"github.com/gin-gonic/gin"
)

func WithAppContext(ctx *appctx.AppContext) gin.HandlerFunc {
	return func(c *gin.Context) {
		appctx.WithGin(c, ctx)
		c.Next()
	}
}

func mustApp(c *gin.Context) *appctx.AppContext {
	return appctx.MustFromGin(c)
}
