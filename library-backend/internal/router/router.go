package router

import (
	"library-backend/internal/handler" // swagger handler

	_ "library-backend/docs"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/swagger"
)

func NewRouter(hndler *handler.Handler) *fiber.App {
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept",
		AllowMethods: "GET, POST, PUT, DELETE",
	}))
	app.Get("/swagger/*", swagger.HandlerDefault)

	app.Get("/", GetHello)

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
