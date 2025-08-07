package service

import (
	"context"
	"library-backend/internal/payload"
	"library-backend/internal/repository"
	"log/slog"
)

type BookService interface {
	CreateBook(ctx context.Context, request payload.CreateBookRequest) (payload.CreateBookResponse, error)
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
