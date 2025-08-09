package handler

import (
	"url-cleanup-backend/internal/service"

	"github.com/gofiber/fiber/v2"
)

type UrlCleanupHandler interface {
	CleanUpUrl(c *fiber.Ctx) error
}

type urlCleanupHandler struct {
	service service.UrlCleanupService
}

func NewUrlCleanupHandler(service service.UrlCleanupService) UrlCleanupHandler {
	return &urlCleanupHandler{service: service}
}

func (h *urlCleanupHandler) CleanUpUrl(c *fiber.Ctx) error {
	return nil
}
