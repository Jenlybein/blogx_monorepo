package follow_service

import "gorm.io/gorm"

var followDB *gorm.DB

func Configure(db *gorm.DB) {
	followDB = db
}
