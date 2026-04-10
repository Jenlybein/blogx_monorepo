package log_service

import (
	"database/sql"

	"myblogx/conf"

	"github.com/sirupsen/logrus"
)

var (
	logSettings          conf.Logrus
	logSystemSettings    conf.System
	logClickHouseEnabled bool
	logLogger            *logrus.Logger
	logClickHouse        *sql.DB
)

func Configure(logConfig conf.Logrus, systemConfig conf.System, clickHouseConfig conf.ClickHouse, logger *logrus.Logger, clickHouse *sql.DB) {
	logSettings = logConfig
	logSystemSettings = systemConfig
	logClickHouseEnabled = clickHouseConfig.Enabled
	logLogger = logger
	logClickHouse = clickHouse
}
