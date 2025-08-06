run:
	go run main.go

dev:
	air

build:
	go build -o library-backend main.go

run-build: build
	./library-backend

swagger:
	swag init -g main.go -d . -o ./docs

env: cp .env.example .env