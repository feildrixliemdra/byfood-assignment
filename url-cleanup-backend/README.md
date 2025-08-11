# URL Cleanup API

A Go-based REST API for URL cleanup operations built with Fiber web framework following clean architecture principles with dependency injection.

## Prerequisites

- Go 1.23.0 or higher
- Air (for hot reloading in development, optional)

## Quick Start

1. **Clone the repository and navigate to the url-cleanup-backend directory:**

   ```bash
   cd url-cleanup-backend
   ```

2. **Install dependencies:**

   ```bash
   go mod download
   ```

3. **Set up environment variables (optional):**

   ```bash
   make env  # if .env.example exists
   ```

   Or set environment variables directly:

   ```bash
   export APP_PORT=8000
   export APP_NAME=url-cleanup-service
   ```

4. **Run the application:**

   ```bash
   # Development mode with hot reloading (if Air is installed)
   make dev

   # OR run directly
   make run
   ```

5. **Access the API:**
   - Base URL: `http://localhost:8000`
   - Health check: `http://localhost:8000/`
   - Swagger docs: `http://localhost:8000/swagger/index.html`

## Project Structure

```
url-cleanup-backend/
├── bootstrap/              # Application initialization
│   ├── config.go          # Environment configuration with Viper
│   └── validator.go       # Request validation setup
├── cmd/                   # Application entry point
│   └── cmd.go             # Service orchestration and startup
├── docs/                  # Auto-generated Swagger documentation
├── internal/              # Private application code
│   ├── config/            # Configuration management
│   │   └── config.go      # Environment variable mapping
│   ├── handler/           # HTTP request handlers (Fiber)
│   │   ├── handler.go     # Handler interfaces and setup
│   │   └── url-cleanup.go # URL cleanup endpoints
│   ├── payload/           # Request/response structures
│   │   ├── payload.go     # URL cleanup request/response models
│   │   └── response.go    # Standard response formats
│   ├── router/            # HTTP routing and middleware
│   │   ├── router.go      # Route definitions with CORS
│   │   └── server.go      # Server startup with graceful shutdown
│   ├── service/           # Business logic layer
│   │   ├── service.go     # Service interfaces
│   │   ├── url-cleanup.go # URL cleanup business logic
│   │   └── url-cleanup_test.go # Unit tests
│   ├── util/              # Utility functions
│   │   └── response.go    # Response helpers
│   └── validator/         # Custom validation rules
│       └── validator.go   # Validation helper functions
└── main.go               # Application entry point
```

## Architecture

### Clean Architecture Layers

1. **Bootstrap Layer**: Application initialization and configuration
2. **Handler Layer**: HTTP request handling with Fiber
3. **Service Layer**: Business logic for URL cleanup operations
4. **Payload Layer**: Request/response structures with validation
5. **Router Layer**: HTTP routing with CORS middleware

### Dependency Injection Flow

The application follows a strict dependency injection pattern:
Config → Validator → Service → Handler → Router → Server

## API Endpoints

### URL Cleanup

| Method | Endpoint           | Description                 |
| ------ | ------------------ | --------------------------- |
| GET    | `/`                | Health check endpoint       |
| POST   | `/v1/url-cleanup/` | Process URL cleanup request |

### Example Request/Response

**URL Cleanup:**

```bash
curl -X POST http://localhost:8000/v1/url-cleanup/ \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/path?param1=value1&param2=value2",
    "operation": "canonical"
  }'
```

**Request Payload:**

```json
{
  "url": "URL to process",
  "operation": "canonical | redirection | all"
}
```

**Response:**

```json
{
  "success": true,
  "message": "URL processed successfully",
  "data": {
    "processed_url": "https://example.com/path"
  }
}
```

**Operation Types:**

- `canonical`: Clean up URLs to their canonical form
- `redirection`: Follow redirects to find final destination
- `all`: Perform both canonical and redirection cleanup

## Development Commands

| Command                   | Description                           |
| ------------------------- | ------------------------------------- |
| `make run`                | Run application directly              |
| `make dev`                | Run with hot reloading (Air)          |
| `make build`              | Build binary as `url-cleanup-backend` |
| `make run-build`          | Build and run the binary              |
| `make swagger`            | Generate Swagger documentation        |
| `make env`                | Copy `.env.example` to `.env`         |
| `make test`               | Run all tests                         |
| `make test-coverage`      | Run tests with coverage report        |
| `make test-coverage-html` | Generate HTML coverage report         |

## Environment Variables

Configure these variables in your `.env` file or environment:

```env
# Server Configuration
APP_PORT=8000
APP_NAME=url-cleanup-service
```

## Running Tests

```bash
# Run all tests
make test

# Run tests with verbose output
go test -v ./...

# Run tests for specific package
go test ./internal/service

# Run tests with coverage
make test-coverage

# Generate HTML coverage report
make test-coverage-html
```

The HTML coverage report will be generated as `coverage.html` in the project root.

## Additional Go Commands

```bash
# Format code
go fmt ./...

# Run static analysis
go vet ./...

# Clean up dependencies
go mod tidy

# Download dependencies
go mod download
```

## Key Technologies

- **Web Framework**: Fiber v2 (Express-like for Go)
- **Configuration**: Viper with .env file support
- **Validation**: go-playground/validator/v10
- **Documentation**: Swagger/swag integration
- **UUID**: Google UUID library
- **CORS**: Built-in Fiber CORS middleware

## API Documentation

Once the server is running, visit `http://localhost:8000/swagger/index.html` to access the interactive Swagger documentation.

To regenerate documentation after making changes:

```bash
make swagger
```

## Request Validation

The API includes comprehensive request validation:

- **URL**: Must be a valid HTTP/HTTPS URL
- **Operation**: Must be one of `canonical`, `redirection`, or `all`
- **Required Fields**: All fields marked as required must be present

Invalid requests will return detailed validation error messages.

## Error Handling

The API uses standardized error responses:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "url",
      "message": "must be a valid URL"
    }
  ]
}
```

## Health Check

The API includes a health check endpoint at the root path (`/`) that returns a JSON response:

```json
{
  "message": "URL Cleanup API is running"
}
```

## License

This project is part of the ByFood assignment.
