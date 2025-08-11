package util

import (
	"errors"
	"library-backend/internal/payload"

	val "library-backend/internal/validator"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

func SuccessResponse(c *fiber.Ctx, data interface{}) error {
	return c.Status(fiber.StatusOK).JSON(
		payload.Response{
			Success: true,
			Message: "Success",
			Data:    data,
		},
	)
}

func ErrBindResponse(c *fiber.Ctx, err error) error {
	var validationErrors validator.ValidationErrors

	if errors.As(err, &validationErrors) {
		return c.Status(fiber.StatusUnprocessableEntity).JSON(payload.Response{
			Success: false,
			Message: "Validation failed",
			Errors:  val.TranslateErrorValidator(err),
		})
	}

	return c.Status(fiber.StatusBadRequest).JSON(payload.Response{
		Success: false,
		Message: "Bad request",
	})
}

func ErrInternalResponse(c *fiber.Ctx) error {
	return c.Status(fiber.StatusInternalServerError).JSON(
		payload.Response{
			Success: false,
			Message: "Internal server error",
		},
	)
}

func ErrBadRequestResponse(c *fiber.Ctx, err string) error {
	return c.Status(fiber.StatusBadRequest).JSON(payload.Response{
		Success: false,
		Message: err,
	})
}

func ErrNotFoundResponse(c *fiber.Ctx) error {
	return c.Status(fiber.StatusNotFound).JSON(payload.Response{
		Success: false,
		Message: "Not found",
	})
}
