package flags

import (
	"myblogx/conf"

	"github.com/elastic/go-elasticsearch/v7"
	"github.com/sirupsen/logrus"
	"gorm.io/gorm"
)

var (
	flagRiverConfig conf.River
	flagLogger      *logrus.Logger
	flagDB          *gorm.DB
	flagES          *elasticsearch.Client
)

func Configure(riverConfig conf.River, logger *logrus.Logger, db *gorm.DB, esClient *elasticsearch.Client) {
	flagRiverConfig = riverConfig
	flagLogger = logger
	flagDB = db
	flagES = esClient
}
