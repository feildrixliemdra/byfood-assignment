package router

import (
	_ "url-cleanup-backend/docs"
	"url-cleanup-backend/internal/handler"
	"url-cleanup-backend/internal/payload"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/swagger"
)

func NewRouter(hndler *handler.Handler) *fiber.App {
	app := fiber.New(fiber.Config{
		// Global custom error handler
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			return c.Status(fiber.StatusBadRequest).JSON(payload.GlobalErrorHandlerResp{
				Success: false,
				Message: err.Error(),
			})
		},
	})

	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
		AllowMethods: "GET, POST, PUT, DELETE",
	}))
	app.Get("/swagger/*", swagger.HandlerDefault)

	app.Get("/", GetHello)

	v1 := app.Group("/v1")

	// book route
	urlCleanupGroup := v1.Group("/url-cleanup")
	urlCleanupGroup.Post("/", hndler.UrlCleanupHandler.CleanUpUrl)
	return app
}

// GetHello Getting Hello
//
//	@Summary        Getting Hello
//	@Description    Getting Hello in detail
//	@Tags            Hello
//	@Accept            json
//	@Produce        json
//	@Success        200                {object}    map[string]string
//	@Router            / [get]
func GetHello(c *fiber.Ctx) error {
	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "URL Cleanup API is running",
	})
}
