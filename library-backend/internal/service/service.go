package service

import (
	"library-backend/internal/config"
	"library-backend/internal/repository"
)

type Service struct {
	BookService BookService
}

type Option struct {
	Config     *config.Config
	Repository *repository.Repository
}

func InitiateService(opt Option) *Service {
	return &Service{
		BookService: NewBookService(opt.Repository.BookRepository),
	}
}
