package user_service

import (
	"myblogx/conf"

	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

var (
	userJWTConfig conf.Jwt
	userEnv       string
	userDB        *gorm.DB
	userLogger    *logrus.Logger
)

func Configure(jwtConfig conf.Jwt, env string, db *gorm.DB, logger *logrus.Logger) {
	userJWTConfig = jwtConfig
	userEnv = env
	userDB = db
	userLogger = logger
}
