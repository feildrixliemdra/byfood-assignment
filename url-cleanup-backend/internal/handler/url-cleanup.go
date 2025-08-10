package handler

import (
	"url-cleanup-backend/internal/payload"
	"url-cleanup-backend/internal/service"
	"url-cleanup-backend/internal/util"
	"url-cleanup-backend/internal/validator"

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

// CleanUpUrl processes URL cleanup request
// @Summary Process URL cleanup
// @Description Clean up URLs based on operation type (canonical, redirection, or all)
// @Tags URL Cleanup
// @Accept json
// @Produce json
// @Param request body payload.CleanUpUrlRequest true "URL cleanup request"
// @Success 200 {object} payload.Response{data=payload.CleanUpUrlResponse}
// @Failure 400 {object} payload.Response
// @Failure 422 {object} payload.Response
// @Failure 500 {object} payload.Response
// @Router /v1/url-cleanup [post]
func (h *urlCleanupHandler) CleanUpUrl(c *fiber.Ctx) error {
	var request payload.CleanUpUrlRequest

	if err := c.BodyParser(&request); err != nil {
		return util.ErrBindResponse(c, err)
	}

	if err := validator.Validate.Struct(&request); err != nil {
		return util.ErrBindResponse(c, err)
	}

	response, err := h.service.CleanUpUrl(c.Context(), request)
	if err != nil {
		return util.ErrInternalResponse(c)
	}

	return util.SuccessResponse(c, response)
}
