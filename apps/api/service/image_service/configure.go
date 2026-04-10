package image_service

import (
	"myblogx/conf"

	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

var (
	imageQiNiuConfig  conf.QiNiu
	imageUploadConfig conf.Upload
	imageDB           *gorm.DB
	imageLogger       *logrus.Logger
)

func Configure(qiNiuConfig conf.QiNiu, uploadConfig conf.Upload, db *gorm.DB, logger *logrus.Logger) {
	imageQiNiuConfig = qiNiuConfig
	imageUploadConfig = uploadConfig
	imageDB = db
	imageLogger = logger
}
