package qq_service

import "myblogx/conf"

var qqConfig conf.QQ

func Configure(config conf.QQ) {
	qqConfig = config
}
