package image_ref_river_service

import (
	"myblogx/conf"

	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

var (
	imageRefRiverConfig conf.ImageRefRiver
	imageRefQiNiuConfig conf.QiNiu
	imageRefLogger      *logrus.Logger
	imageRefDB          *gorm.DB
)

func Configure(riverConfig conf.ImageRefRiver, qiNiuConfig conf.QiNiu, logger *logrus.Logger, db *gorm.DB) {
	imageRefRiverConfig = riverConfig
	imageRefQiNiuConfig = qiNiuConfig
	imageRefLogger = logger
	imageRefDB = db
}
