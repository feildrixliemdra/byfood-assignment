package service

import (
	"context"
	"url-cleanup-backend/internal/payload"
)

type UrlCleanupService interface {
	CleanUpUrl(ctx context.Context, request payload.CleanUpUrlRequest) (payload.CleanUpUrlResponse, error)
}

type urlCleanupService struct{}

func NewUrlCleanupService() UrlCleanupService {
	return &urlCleanupService{}
}

func (s *urlCleanupService) CleanUpUrl(ctx context.Context, request payload.CleanUpUrlRequest) (payload.CleanUpUrlResponse, error) {
	return payload.CleanUpUrlResponse{}, nil
}
