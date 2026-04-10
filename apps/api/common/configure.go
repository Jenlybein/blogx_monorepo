package common

import "gorm.io/gorm"

var defaultDB *gorm.DB

func Configure(db *gorm.DB) {
	defaultDB = db
}
