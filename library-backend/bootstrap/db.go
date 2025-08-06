package bootstrap

import (
	"library-backend/internal/config"

	"github.com/jmoiron/sqlx"

	_ "github.com/jackc/pgx/v5/stdlib"
)

func InitiatePostgreSQL(cfg *config.Config) (*sqlx.DB, error) {
	db, err := sqlx.Connect("pgx", cfg.DBURL) // you can change it to mysql or any other supported sql db
	if err != nil {
		return db, err
	}

	db.SetMaxIdleConns(cfg.DBMaxIdleConn)
	db.SetMaxOpenConns(cfg.DBMaxOpenConn)

	return db, db.Ping()
}
