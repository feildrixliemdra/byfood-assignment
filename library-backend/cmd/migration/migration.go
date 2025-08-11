package migration

import (
	"library-backend/bootstrap"
	"library-backend/pkg/dbmigration"
)

func MigrateDatabase() {
	cfg := bootstrap.NewConfig()

	dbmigration.DatabaseMigration(cfg)
}

// AutoMigrate runs database migration up automatically
func AutoMigrate() {
	cfg := bootstrap.NewConfig()

	dbmigration.AutoMigrateUp(cfg)
}
