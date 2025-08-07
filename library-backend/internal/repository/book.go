package repository

import (
	"context"
	"library-backend/internal/model"

	sq "github.com/Masterminds/squirrel"
	"github.com/jmoiron/sqlx"
)

type BookRepository interface {
	CreateBook(ctx context.Context, book model.Book) error
}

type bookRepository struct {
	db *sqlx.DB
}

func NewBookRepository(db *sqlx.DB) BookRepository {
	return &bookRepository{db: db}
}

func (r *bookRepository) CreateBook(ctx context.Context, book model.Book) error {
	q := sq.Insert("books").
		Columns("id", "isbn", "title", "author", "publisher", "year_of_publication", "category", "image_url").
		Values(book.ID, book.ISBN, book.Title, book.Author, book.Publisher, book.YearOfPublication, book.Category, book.ImageURL).
		PlaceholderFormat(sq.Dollar)

	query, args, err := q.ToSql()
	if err != nil {
		return err
	}

	_, err = r.db.ExecContext(ctx, query, args...)

	return err
}
