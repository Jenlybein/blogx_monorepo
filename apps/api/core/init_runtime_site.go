package core

import (
	"myblogx/conf"
	"myblogx/service/site_service"

	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

func InitRuntimeSite(baseConfig *conf.Config, logger *logrus.Logger, db *gorm.DB, configFile string) error {
	site_service.ConfigureRuntimeConfig(baseConfig.Site, baseConfig.AI, func(site conf.Site, ai conf.AI) {
		baseConfig.Site = site
		baseConfig.AI = ai
	}, logger, db, configFile)
	return site_service.InitRuntimeConfig()
}
