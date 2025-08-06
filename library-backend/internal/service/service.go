package service

import (
	"library-backend/internal/config"
	"library-backend/internal/repository"
)

type Service struct{}

type Option struct {
	Config     *config.Config
	Repository *repository.Repository
}

func InitiateService(opt Option) *Service {
	return &Service{}
}
