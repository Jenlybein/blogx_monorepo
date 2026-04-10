package captcha_api

import (
	"myblogx/appctx"

	"github.com/gin-gonic/gin"
)

func New(ctx *appctx.AppContext) ImageCaptchaApi {
	_ = ctx
	return ImageCaptchaApi{}
}

func mustApp(c *gin.Context) *appctx.AppContext {
	return appctx.MustFromGin(c)
}
