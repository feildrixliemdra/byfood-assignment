# Library Management API

A Go-based REST API for library management built with Fiber web framework following clean architecture principles with dependency injection.

## Prerequisites

### Docker (Recommended)
- Docker and Docker Compose

### Local Development
- Go 1.23.0 or higher
- PostgreSQL database
- Air (for hot reloading in development)

## Quick Start

### Option 1: Docker Compose (Recommended)

#### Production Setup
1. **Clone the repository and navigate to the library-backend directory:**

   ```bash
   cd library-backend
   ```

2. **Start with Docker Compose:**

   ```bash
   # Start PostgreSQL and the application (production build)
   docker-compose up -d
   
   # View logs
   docker-compose logs -f
   
   # Stop services
   docker-compose down
   ```

#### Development Setup with Hot Reload
1. **For development with hot reload:**

   ```bash
   # Start with development configuration
   docker-compose -f docker-compose.dev.yml up -d
   
   # View logs
   docker-compose -f docker-compose.dev.yml logs -f
   
   # Stop services
   docker-compose -f docker-compose.dev.yml down
   ```

3. **Access the API:**
   - Base URL: `http://localhost:8080`
   - Swagger docs: `http://localhost:8080/swagger/index.html`

The Docker setup includes:
- PostgreSQL 17 database with sample data
- Automatic database initialization
- Health checks for reliable startup
- Volume persistence for data
- Production build uses compiled binary
- Development build supports hot reload with Air

### Option 2: Local Development

1. **Prerequisites:**
   - Go 1.23.0 or higher
   - PostgreSQL database running locally

2. **Install dependencies:**

   ```bash
   go mod download
   ```

3. **Set up environment variables:**

   ```bash
   make env
   ```

   Then edit the `.env` file with your database configuration.

4. **Set up database:**
   - Create a PostgreSQL database named `library`
   - Run the `init.sql` file to create tables and sample data

5. **Run the application:**

   ```bash
   # Development mode with hot reloading
   make dev

   # OR run directly
   make run
   ```

6. **Access the API:**
   - Base URL: `http://localhost:8080`
   - Swagger docs: `http://localhost:8080/swagger/index.html`

## Project Structure

```
library-backend/
├── bootstrap/              # Application initialization
│   ├── config.go          # Environment configuration with Viper
│   ├── db.go              # PostgreSQL database setup with sqlx
│   └── validator.go       # Request validation setup
├── cmd/                   # Application entry point
│   └── cmd.go             # Service orchestration and startup
├── docs/                  # Auto-generated Swagger documentation
├── errorcustom/           # Custom error definitions
├── internal/              # Private application code
│   ├── config/            # Configuration management
│   ├── handler/           # HTTP request handlers (Fiber)
│   │   ├── book.go        # Book-related endpoints
│   │   └── handler.go     # Handler interfaces
│   ├── model/             # Domain entities
│   │   └── book.go        # Book model with UUID, timestamps
│   ├── payload/           # Request/response structures
│   │   ├── book.go        # Book payloads
│   │   └── response.go    # Standard response formats
│   ├── repository/        # Data access layer
│   │   ├── book.go        # Book repository with Squirrel queries
│   │   ├── mock/          # Generated mocks for testing
│   │   └── repository.go  # Repository interfaces
│   ├── router/            # HTTP routing and middleware
│   │   ├── router.go      # Route definitions
│   │   └── server.go      # Server startup with graceful shutdown
│   ├── service/           # Business logic layer
│   │   ├── book.go        # Book business logic
│   │   ├── book_test.go   # Unit tests for book service
│   │   └── service.go     # Service interfaces
│   ├── util/              # Utility functions
│   │   └── response.go    # Response helpers
│   └── validator/         # Custom validation rules
└── main.go               # Application entry point
```

## Architecture

### Clean Architecture Layers

1. **Bootstrap Layer**: Application initialization and configuration
2. **Handler Layer**: HTTP request handling with Fiber
3. **Service Layer**: Business logic implementation
4. **Repository Layer**: Data access with PostgreSQL and Squirrel
5. **Model Layer**: Domain entities with proper struct tags

### Dependency Injection Flow

The application follows a strict dependency injection pattern:
Config → Database → Validator → Repository → Service → Handler → Router → Server

## API Endpoints

### Books

| Method | Endpoint        | Description       |
| ------ | --------------- | ----------------- |
| POST   | `/v1/books`     | Create a new book |
| GET    | `/v1/books`     | Get all books     |
| GET    | `/v1/books/:id` | Get book by ID    |
| PUT    | `/v1/books/:id` | Update book by ID |
| DELETE | `/v1/books/:id` | Delete book by ID |

### API Examples

#### 1. Create Book

```bash
curl -X POST http://localhost:8080/v1/books \
  -H "Content-Type: application/json" \
  -d '{
    "isbn": "9780134190440",
    "title": "The Go Programming Language",
    "author": "Alan Donovan",
    "publisher": "Addison-Wesley",
    "year_of_publication": 2015,
    "category": "Programming",
    "image_url": "https://example.com/book-cover.jpg"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000"
  }
}
```

#### 2. Get All Books (with pagination)

```bash
# Get first page with default limit (10)
curl -X GET "http://localhost:8080/v1/books"

# Get specific page with custom limit
curl -X GET "http://localhost:8080/v1/books?page=2&limit=5"
```

**Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "books": [
      {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "isbn": "9780134190440",
        "title": "The Go Programming Language",
        "author": "Alan Donovan",
        "publisher": "Addison-Wesley",
        "year_of_publication": 2015,
        "category": "Programming",
        "image_url": "https://example.com/book-cover.jpg",
        "created_at": "2024-01-01T12:00:00Z",
        "updated_at": "2024-01-01T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total_page": 1,
      "total_item": 1
    }
  }
}
```

#### 3. Get Book by ID

```bash
curl -X GET "http://localhost:8080/v1/books/123e4567-e89b-12d3-a456-426614174000"
```

**Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "isbn": "9780134190440",
    "title": "The Go Programming Language",
    "author": "Alan Donovan",
    "publisher": "Addison-Wesley",
    "year_of_publication": 2015,
    "category": "Programming",
    "image_url": "https://example.com/book-cover.jpg",
    "created_at": "2024-01-01T12:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  }
}
```

#### 4. Update Book

```bash
curl -X PUT "http://localhost:8080/v1/books/123e4567-e89b-12d3-a456-426614174000" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Go Programming Language - Updated Edition",
    "year_of_publication": 2024
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": null
}
```

#### 5. Delete Book

```bash
curl -X DELETE "http://localhost:8080/v1/books/123e4567-e89b-12d3-a456-426614174000"
```

**Response:**

```json
{
  "success": true,
  "message": "Success",
  "data": null
}
```

#### Error Responses

**Validation Error:**

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "isbn",
      "message": "isbn must be a valid ISBN"
    }
  ]
}
```

**Not Found Error:**

```json
{
  "success": false,
  "message": "Book not found"
}
```

## Development Commands

### Local Development
| Command                   | Description                       |
| ------------------------- | --------------------------------- |
| `make run`                | Run application directly with auto-migration          |
| `make dev`                | Run with hot reloading (Air) and auto-migration      |
| `make build`              | Build binary as `library-backend` |
| `make run-build`          | Build and run the binary with auto-migration          |
| `make swagger`            | Generate Swagger documentation    |
| `make env`                | Copy `.env.example` to `.env`     |
| `make mock-repostiory`    | Generate repository mocks         |
| `make test`               | Run all tests                     |
| `make test-coverage`      | Run tests with coverage report    |
| `make test-coverage-html` | Generate HTML coverage report     |

### Docker Commands

#### Production Commands
| Command                       | Description                         |
| ----------------------------- | ----------------------------------- |
| `docker-compose up -d`        | Start services in background       |
| `docker-compose up`           | Start services with logs           |
| `docker-compose down`         | Stop and remove containers         |
| `docker-compose logs -f`      | Follow logs from all services      |
| `docker-compose logs app`     | View application logs               |
| `docker-compose logs db`      | View database logs                  |
| `docker-compose restart app`  | Restart application container       |
| `docker-compose build --no-cache` | Rebuild application image      |

#### Development Commands
| Command                                          | Description                         |
| ------------------------------------------------ | ----------------------------------- |
| `docker-compose -f docker-compose.dev.yml up -d` | Start dev services in background   |
| `docker-compose -f docker-compose.dev.yml up`   | Start dev services with logs       |
| `docker-compose -f docker-compose.dev.yml down` | Stop and remove dev containers     |
| `docker-compose -f docker-compose.dev.yml logs -f` | Follow logs from dev services    |

## Environment Variables

Configure these variables in your `.env` file:

```env
# Database Configuration
DB_URL=postgres://user:password@localhost:5432/library_db?sslmode=disable
DB_MAX_IDLE_CONN=10
DB_MAX_OPEN_CONN=20

# Server Configuration
APP_PORT=8080
APP_NAME=library-management-api
```

## Running Tests

```bash
# Run all tests
make test

# Run tests with coverage
make test-coverage

# Generate HTML coverage report
make test-coverage-html
```

The HTML coverage report will be generated as `coverage.html` in the project root.

## Database Setup

This API requires a PostgreSQL database. The application automatically runs database migrations on startup, so you only need to ensure your database is running and properly configured in the `.env` file.

### Automatic Migration

When you start the application with any of the following commands, database migrations will automatically run:
- `make run` or `go run main.go`
- `make dev`
- `make run-build`

The application will:
1. Connect to the database
2. Run all pending migrations from the `migration/` directory
3. Start the HTTP server

### Manual Migration Commands

For manual database operations, you can still use the migration command:

```bash
# Run migrations manually
go run main.go db:migrate up

# Create a new migration
go run main.go db:migrate create migration_name

# Check migration status
go run main.go db:migrate status

# Rollback migrations
go run main.go db:migrate down

# See all available migration commands
go run main.go db:migrate --guide
```

### Migration Files

Migration files are located in the `migration/` directory and follow the naming pattern:
- `YYYYMMDDHHMMSS_description.sql` (e.g., `20240101120000_create_books_table.sql`)

Each migration file should contain both `-- +goose Up` and `-- +goose Down` sections for forward and backward migrations.

### Key Technologies

- **Web Framework**: Fiber v2 (Express-like for Go)
- **Database**: PostgreSQL with sqlx and pgx drivers
- **Query Builder**: Squirrel for dynamic SQL generation
- **Configuration**: Viper with .env file support
- **Validation**: go-playground/validator
- **Documentation**: Swagger/swag
- **Development**: Air for hot reloading
- **Testing**: Gomock for mocking
- **UUID**: Google UUID library

## API Documentation

Once the server is running, visit `http://localhost:8080/swagger/index.html` to access the interactive Swagger documentation.

To regenerate documentation after making changes:

```bash
make swagger
```

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

## Health Check

The API includes a health check endpoint at the root path (`/`) that returns a JSON response:

```json
{
  "message": "Library Management API is running"
}
```

## License

This project is part of the ByFood assignment.
