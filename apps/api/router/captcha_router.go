package router

import (
	"myblogx/api"

	"github.com/gin-gonic/gin"
)

func CaptchaRouter(r *gin.RouterGroup, appContainer api.Api) {
	api := appContainer.ImageCaptchaApi
	r.GET("/imagecaptcha", api.CaptchaView)
}
