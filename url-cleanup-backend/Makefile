run:
	go run main.go

dev:
	air

build:
	go build -o url-cleanup-backend main.go

run-build: build
	./url-cleanup-backend

swagger:
	swag init -g main.go -d . -o ./docs

env: cp .env.example .env
test:
	go test ./...

test-coverage:
	go test ./... -coverprofile=coverage.out

test-coverage-html: test-coverage
	go tool cover -html=coverage.out -o coverage.html