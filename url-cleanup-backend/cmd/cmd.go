package cmd

import (
	"url-cleanup-backend/bootstrap"
	"url-cleanup-backend/internal/handler"
	"url-cleanup-backend/internal/router"
	"url-cleanup-backend/internal/service"
)

func Start() {

	// initialize config
	config := bootstrap.NewConfig()

	// initialize validator
	bootstrap.NewXValidator()

	// initialize service
	svc := service.InitiateService(service.Option{})

	// initialize handler
	hndler := handler.InitiateHandler(handler.Option{
		Service: svc,
	})

	app := router.NewRouter(hndler)

	// start HTTP server
	router.StartServer(app, config.AppPort)
}
