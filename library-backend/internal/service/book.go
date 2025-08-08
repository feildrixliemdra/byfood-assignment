package service

import (
	"context"
	"errors"
	"library-backend/errorcustom"
	"library-backend/internal/payload"
	"library-backend/internal/repository"
	"log/slog"
	"math"
	"reflect"
	"strings"
)

type BookService interface {
	CreateBook(ctx context.Context, request payload.CreateBookRequest) (payload.CreateBookResponse, error)
	GetBooks(ctx context.Context, request payload.GetBooksRequest) (payload.GetBooksResponse, error)
	GetBookByID(ctx context.Context, id string) (payload.GetBookByIDResponse, error)
	UpdateBook(ctx context.Context, request payload.UpdateBookRequest) error
}

type bookService struct {
	bookRepo repository.BookRepository
}

func NewBookService(bookRepo repository.BookRepository) BookService {
	return &bookService{bookRepo: bookRepo}
}

func (s *bookService) CreateBook(ctx context.Context, request payload.CreateBookRequest) (res payload.CreateBookResponse, err error) {
	book := request.ToModel()

	err = s.bookRepo.CreateBook(ctx, book)
	if err != nil {
		slog.ErrorContext(ctx, "[BookService][CreateBook] failed to create book", "error", err)
		return res, err
	}

	res.ID = book.ID

	return res, nil
}

func (s *bookService) GetBooks(ctx context.Context, request payload.GetBooksRequest) (res payload.GetBooksResponse, err error) {
	offset := (request.Page - 1) * request.Limit

	// get books with pagination
	books, err := s.bookRepo.GetBooks(ctx, request.Limit, offset)
	if err != nil {
		slog.ErrorContext(ctx, "[BookService][GetBooks] failed to get books", "error", err)
		return res, err
	}

	// get total count of books
	totalCount, err := s.bookRepo.GetBooksCount(ctx)
	if err != nil {
		slog.ErrorContext(ctx, "[BookService][GetBooks] failed to get books count", "error", err)
		return res, err
	}

	totalPages := int(math.Ceil(float64(totalCount) / float64(request.Limit)))

	bookResponses := make([]payload.BookResponse, len(books))
	for i, book := range books {
		bookResponses[i] = payload.BookResponse{
			ID:                book.ID,
			ISBN:              book.ISBN,
			Title:             book.Title,
			Author:            book.Author,
			Publisher:         book.Publisher,
			YearOfPublication: book.YearOfPublication,
			Category:          book.Category,
			ImageURL:          book.ImageURL,
			CreatedAt:         book.CreatedAt,
			UpdatedAt:         book.UpdatedAt,
		}
	}

	res.Books = bookResponses
	res.Pagination = payload.Pagination{
		Page:      request.Page,
		Limit:     request.Limit,
		TotalPage: totalPages,
		TotalItem: totalCount,
	}

	return res, nil
}

func (s *bookService) GetBookByID(ctx context.Context, id string) (res payload.GetBookByIDResponse, err error) {
	book, err := s.bookRepo.GetBookByID(ctx, id)
	if err != nil {
		slog.ErrorContext(ctx, "[BookService][GetBookByID] failed to get book by ID", "error", err, "id", id)
		return res, err
	}

	if book == nil {
		return res, errorcustom.ErrBookNotFound
	}

	res.BookResponse = payload.BookResponse{
		ID:                book.ID,
		ISBN:              book.ISBN,
		Title:             book.Title,
		Author:            book.Author,
		Publisher:         book.Publisher,
		YearOfPublication: book.YearOfPublication,
		Category:          book.Category,
		ImageURL:          book.ImageURL,
		CreatedAt:         book.CreatedAt,
		UpdatedAt:         book.UpdatedAt,
	}

	return res, nil
}

func (s *bookService) buildUpdateMap(request payload.UpdateBookRequest) map[string]any {
	updates := make(map[string]any)

	v := reflect.ValueOf(request)
	t := reflect.TypeOf(request)

	for i := 0; i < v.NumField(); i++ {
		field := v.Field(i)
		fieldType := t.Field(i)

		jsonTag := fieldType.Tag.Get("json")
		if jsonTag == "" || jsonTag == "-" {
			continue
		}

		// Extract field name from json tag (remove ",omitempty" etc.)
		fieldName := jsonTag
		if commaIdx := strings.Index(jsonTag, ","); commaIdx != -1 {
			fieldName = jsonTag[:commaIdx]
		}

		// Skip ID field as it shouldn't be updated
		if fieldName == "id" {
			continue
		}

		if field.Kind() == reflect.Ptr && !field.IsNil() {
			updates[fieldName] = field.Elem().Interface()
		}
	}

	return updates
}

func (s *bookService) UpdateBook(ctx context.Context, request payload.UpdateBookRequest) (err error) {
	// Check if book exists s
	book, err := s.bookRepo.GetBookByID(ctx, request.ID)
	if err != nil {
		slog.ErrorContext(ctx, "[BookService][UpdateBook] failed to check book existence", "error", err, "id", request.ID)
		return err
	}

	if book == nil {
		return errorcustom.ErrBookNotFound
	}

	// Build update map
	updates := s.buildUpdateMap(request)
	if len(updates) == 0 {
		return errors.New("no fields to update")
	}

	// Update the book
	err = s.bookRepo.UpdateBook(ctx, request.ID, updates)
	if err != nil {
		slog.ErrorContext(ctx, "[BookService][UpdateBook] failed to update book", "error", err, "id", request.ID)
		return err
	}

	return nil
}
