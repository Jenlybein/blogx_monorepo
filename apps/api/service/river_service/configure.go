package river_service

import (
	"myblogx/conf"

	"github.com/sirupsen/logrus"
)

var (
	riverConfig conf.River
	riverLogger *logrus.Logger
)

func Configure(config conf.River, logger *logrus.Logger) {
	riverConfig = config
	riverLogger = logger
}
