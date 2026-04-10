package ai_service

import (
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

var (
	aiReady  bool
	aiDB     *gorm.DB
	aiLogger *logrus.Logger
)

func Configure(db *gorm.DB, logger *logrus.Logger) {
	aiReady = true
	aiDB = db
	aiLogger = logger
}

func Ready() bool {
	return aiReady
}

func DB() *gorm.DB {
	return aiDB
}

func Logger() *logrus.Logger {
	return aiLogger
}
