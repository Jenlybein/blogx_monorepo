package chat_service

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

var (
	chatDB     *gorm.DB
	chatLogger *logrus.Logger
)

func Configure(db *gorm.DB, logger *logrus.Logger) {
	chatDB = db
	chatLogger = logger
}
