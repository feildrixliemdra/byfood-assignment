package handler

import (
	"library-backend/internal/config"
	"library-backend/internal/service"
)

type Handler struct {
	BookHandler BookHandler
}

type Option struct {
	Config  *config.Config
	Service *service.Service
}

func InitiateHandler(opt Option) *Handler {
	return &Handler{
		BookHandler: NewBookHandler(opt.Service.BookService),
	}
}
