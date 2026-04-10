package auth_api

import (
	"fmt"
	"myblogx/common/res"
	"myblogx/middleware"
	"myblogx/models"
	"myblogx/service/email_service"
	"myblogx/service/redis_service"
	"myblogx/service/redis_service/redis_email"
	"myblogx/service/redis_service/redis_user"
	"myblogx/service/site_service"
	"myblogx/service/user_service"

	"github.com/gin-gonic/gin"
	"github.com/mojocn/base64Captcha"
)

type SendEmailRequest struct {
	Type  int8   `json:"type"` // 1:注册 2:重置密码 3:绑定邮箱 4:邮箱登录
	Email string `json:"email" binding:"required,email"`
}

type SendEmailResponse struct {
	ID string `json:"id"`
}

func (AuthApi) SendEmailView(c *gin.Context) {
	app := mustApp(c)
	loginConf := site_service.GetRuntimeLogin()
	if !loginConf.EmailLogin {
		res.FailWithMsg("站点未启用邮箱功能", c)
		return
	}

	cr := middleware.GetBindJson[SendEmailRequest](c)
	redisDeps := redis_service.DepsFromGin(c)
	meta := user_service.BuildSessionMetaFromGin(c)
	if !redis_user.AllowEmailSend(redisDeps, cr.Email, meta.IP, cr.Type) {
		res.FailWithMsg("请求过于频繁，请稍后再试", c)
		return
	}

	var user models.UserModel
	code := base64Captcha.RandText(4, "0123456789")
	timeout := loginConf.EmailCodeTimeout
	if timeout <= 0 {
		timeout = 5
	}
	isEmailExist := app.DB.Take(&user, "email = ?", cr.Email).Error == nil

	var err error
	shouldSend := false
	switch cr.Type {
	case 1:
		shouldSend = !isEmailExist
		if shouldSend {
			err = email_service.SendRegisterCode(app.Config.Email, cr.Email, code, timeout)
		}
	case 2:
		shouldSend = isEmailExist
		if shouldSend {
			err = email_service.SendResetPwdCode(app.Config.Email, cr.Email, code, timeout)
		}
	case 3:
		shouldSend = !isEmailExist
		if shouldSend {
			err = email_service.SendBindEmailCode(app.Config.Email, cr.Email, code, timeout)
		}
	case 4:
		shouldSend = isEmailExist
		if shouldSend {
			err = email_service.SendLoginCode(app.Config.Email, cr.Email, code, timeout)
		}
	default:
		res.FailWithMsg("邮件发送失败：不存在的操作类型", c)
		return
	}

	if err != nil {
		fmt.Println(err)
		app.Logger.Errorf("邮件发送失败: %v", err)
		res.FailWithMsg("邮件发送失败", c)
		return
	}

	id := base64Captcha.RandomId()
	if shouldSend {
		if err = redis_email.Store(redisDeps, id, cr.Email, code, timeout, 3); err != nil {
			app.Logger.Errorf("邮件验证码存储失败: %v", err)
			res.FailWithMsg("邮件发送失败", c)
			return
		}
	}

	res.OkWithData(SendEmailResponse{ID: id}, c)
}
