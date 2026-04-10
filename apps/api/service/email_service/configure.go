package email_service

import "myblogx/conf"

var emailConfig conf.Email

func Configure(config conf.Email) {
	emailConfig = config
}
