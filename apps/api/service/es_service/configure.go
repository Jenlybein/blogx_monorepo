package es_service

import (
	"github.com/elastic/go-elasticsearch/v7"
	"gorm.io/gorm"
)

var (
	esDB     *gorm.DB
	esClient *elasticsearch.Client
)

func Configure(db *gorm.DB, client *elasticsearch.Client) {
	esDB = db
	esClient = client
}
