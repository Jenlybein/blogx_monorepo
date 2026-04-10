package message_service

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

var (
	messageDB     *gorm.DB
	messageLogger *logrus.Logger
)

func Configure(db *gorm.DB, logger *logrus.Logger) {
	messageDB = db
	messageLogger = logger
}
