package captcha_api

import (
	"myblogx/apideps"
)

func New(deps apideps.Deps) ImageCaptchaApi {
	return ImageCaptchaApi{App: deps}
}
