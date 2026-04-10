package search_service

import "gorm.io/gorm"

var searchDB *gorm.DB

func Configure(db *gorm.DB) {
	searchDB = db
}
