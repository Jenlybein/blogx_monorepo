package jwts

import "myblogx/conf"

var jwtConfig conf.Jwt

func Configure(config conf.Jwt) {
	jwtConfig = config
}
