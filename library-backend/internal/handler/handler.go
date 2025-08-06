package handler

import (
	"library-backend/internal/config"
	"library-backend/internal/service"
)

type Handler struct{}

type Option struct {
	Config  *config.Config
	Service *service.Service
}

func InitiateHandler(opt Option) *Handler {
	return &Handler{}
}
