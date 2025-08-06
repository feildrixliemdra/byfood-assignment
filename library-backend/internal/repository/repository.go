package repository

import (
	"github.com/jmoiron/sqlx"
)

type Repository struct{}

type Option struct {
	DB *sqlx.DB
}

func InitiateRepository(opt Option) *Repository {
	return &Repository{}
}
