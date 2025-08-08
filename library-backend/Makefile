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

mock-repostiory:
	mockgen -source=./internal/repository/book.go -destination=./internal/repository/mock/book_mock.go -package=mock

test:
	go test ./...

test-coverage:
	go test ./... -coverprofile=coverage.out

test-coverage-html: test-coverage
	go tool cover -html=coverage.out -o coverage.html