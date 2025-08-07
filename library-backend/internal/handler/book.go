package handler

import (
	"library-backend/internal/payload"
	"library-backend/internal/service"
	"library-backend/internal/util"
	"library-backend/internal/validator"

	"github.com/gofiber/fiber/v2"
)

type BookHandler interface {
	CreateBook(c *fiber.Ctx) error
}

type bookHandler struct {
	bookService service.BookService
}

func NewBookHandler(bookService service.BookService) BookHandler {
	return &bookHandler{bookService: bookService}
}

func (h *bookHandler) CreateBook(c *fiber.Ctx) error {
	var request payload.CreateBookRequest

	err := validator.Validate.Struct(request)
	if err != nil {
		return util.ErrBindResponse(c, err)
	}

	res, err := h.bookService.CreateBook(c.Context(), request)
	if err != nil {
		return util.ErrInternalResponse(c)
	}

	return util.SuccessResponse(c, res)
}
