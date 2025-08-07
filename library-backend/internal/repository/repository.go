package repository

import (
	"github.com/jmoiron/sqlx"
)

type Repository struct {
	BookRepository BookRepository
}

type Option struct {
	DB *sqlx.DB
}

func InitiateRepository(opt Option) *Repository {
	return &Repository{
		BookRepository: NewBookRepository(opt.DB),
	}
}
