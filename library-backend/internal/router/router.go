package router

import (
	"library-backend/internal/handler" // swagger handler
	"library-backend/internal/payload"

	_ "library-backend/docs"

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
	bookGroup := v1.Group("/books")
	bookGroup.Get("/", hndler.BookHandler.GetBooks)
	bookGroup.Get("/:id", hndler.BookHandler.GetBookByID)
	bookGroup.Post("/", hndler.BookHandler.CreateBook)

	return app
}

// GetHello Getting Hello
//
//	@Summary        Getting Hello
//	@Description    Getting Hello in detail
//	@Tags            Hello
//	@Accept            json
//	@Produce        json
//	@Success        200                {string}    string
//	@Router            / [get]
func GetHello(c *fiber.Ctx) error {
	return c.SendString("Hello, World!")
}
