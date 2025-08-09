package handler

import "url-cleanup-backend/internal/service"

type Handler struct {
	UrlCleanupHandler UrlCleanupHandler
}

type Option struct {
	Service *service.Service
}

func InitiateHandler(opt Option) *Handler {
	return &Handler{
		UrlCleanupHandler: NewUrlCleanupHandler(opt.Service.UrlCleanupService),
	}
}
