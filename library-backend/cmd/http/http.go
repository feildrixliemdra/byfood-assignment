package http

import (
	"library-backend/bootstrap"
	"library-backend/cmd/migration"
	"library-backend/internal/handler"
	"library-backend/internal/repository"
	"library-backend/internal/router"
	"library-backend/internal/service"
	"log"
)

func Start() {
	//==============================================
	// bootstrap application dependencies
	//==============================================

	// initialize config
	config := bootstrap.NewConfig()

	// initialize database
	db, err := bootstrap.InitiatePostgreSQL(config)
	if err != nil {
		log.Fatalf("Database connection failed: %v", err)
	}
	defer db.Close()

	// run migration
	migration.AutoMigrate()

	// initialize validator
	bootstrap.NewXValidator()

	//==============================================
	// initialize Dependencies Injections
	//==============================================

	// initialize repository
	repo := repository.InitiateRepository(repository.Option{
		DB: db,
	})

	// initialize service
	svc := service.InitiateService(service.Option{
		Config:     config,
		Repository: repo,
	})

	// initialize handler
	hndler := handler.InitiateHandler(handler.Option{
		Config:  config,
		Service: svc,
	})

	//==============================================
	// initialize router
	//==============================================

	app := router.NewRouter(hndler)

	// start HTTP server
	router.StartServer(app, config.AppPort)
}
