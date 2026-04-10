package middleware

import (
	"myblogx/common/res"
	"myblogx/service/site_service"
	"myblogx/utils/io_util"

	"github.com/gin-gonic/gin"
)

type CaptchaMiddlewareRequest struct {
	CaptchaID   string `json:"captcha_id" binding:"required"`
	CaptchaCode string `json:"captcha_code" binding:"required"`
}

func CaptchaMiddleware(c *gin.Context) {
	app := mustApp(c)
	if !site_service.GetRuntimeLogin().Captcha {
		return
	}

	var cr CaptchaMiddlewareRequest
	if err := io_util.ShouldBindJSONWithRecover(c, &cr); err != nil {
		app.Logger.Errorf("图形验证失败：请求体绑定失败：%v", err)
		res.FailWithMsg("图形验证失败：请求体绑定失败", c)
		c.Abort()
		return
	}

	if !app.ImageCaptchaStore.Verify(cr.CaptchaID, cr.CaptchaCode, true) {
		res.FailWithMsg("图形验证码错误", c)
		c.Abort()
		return
	}
}
