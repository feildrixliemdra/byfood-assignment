package repository

import (
	"context"
	"database/sql"
	"errors"
	"library-backend/internal/model"
	"time"

	sq "github.com/Masterminds/squirrel"
	"github.com/jmoiron/sqlx"
)

type BookRepository interface {
	CreateBook(ctx context.Context, book model.Book) error
	GetBooks(ctx context.Context, limit, offset int) ([]model.Book, error)
	GetBooksCount(ctx context.Context) (int, error)
	GetBookByID(ctx context.Context, id string) (*model.Book, error)
	UpdateBook(ctx context.Context, id string, updates map[string]any) error
}

type bookRepository struct {
	db *sqlx.DB
}

func NewBookRepository(db *sqlx.DB) BookRepository {
	return &bookRepository{db: db}
}

func (r *bookRepository) CreateBook(ctx context.Context, book model.Book) error {
	q := sq.Insert("books").
		Columns("id",
			"isbn",
			"title",
			"author",
			"publisher",
			"year_of_publication",
			"category",
			"image_url",
		).
		Values(book.ID, book.ISBN, book.Title, book.Author, book.Publisher, book.YearOfPublication, book.Category, book.ImageURL).
		PlaceholderFormat(sq.Dollar)

	query, args, err := q.ToSql()
	if err != nil {
		return err
	}

	_, err = r.db.ExecContext(ctx, query, args...)

	return err
}

func (r *bookRepository) GetBooks(ctx context.Context, limit, offset int) ([]model.Book, error) {
	q := sq.Select("id",
		"isbn",
		"title",
		"author",
		"publisher",
		"year_of_publication",
		"category",
		"image_url",
		"created_at",
		"updated_at",
	).
		From("books").
		Where(sq.Eq{"deleted_at": nil}).
		OrderBy("created_at DESC").
		Limit(uint64(limit)).
		Offset(uint64(offset)).
		PlaceholderFormat(sq.Dollar)

	query, args, err := q.ToSql()
	if err != nil {
		return nil, err
	}

	var books []model.Book
	err = r.db.SelectContext(ctx, &books, query, args...)

	return books, err
}

func (r *bookRepository) GetBooksCount(ctx context.Context) (int, error) {
	q := sq.Select("COUNT(id)").
		From("books").
		Where(sq.Eq{"deleted_at": nil}).
		PlaceholderFormat(sq.Dollar)

	query, args, err := q.ToSql()
	if err != nil {
		return 0, err
	}

	var count int
	err = r.db.GetContext(ctx, &count, query, args...)

	return count, err
}

func (r *bookRepository) GetBookByID(ctx context.Context, id string) (*model.Book, error) {
	var book model.Book

	q := sq.Select("id",
		"isbn",
		"title",
		"author",
		"publisher",
		"year_of_publication",
		"category",
		"image_url",
		"created_at",
		"updated_at",
	).
		From("books").
		Where(sq.Eq{"id": id, "deleted_at": nil}).
		PlaceholderFormat(sq.Dollar)

	query, args, err := q.ToSql()
	if err != nil {
		return nil, err
	}

	err = r.db.GetContext(ctx, &book, query, args...)
	if err != nil && errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}

	return &book, err
}

func (r *bookRepository) UpdateBook(ctx context.Context, id string, updates map[string]any) error {
	if len(updates) == 0 {
		return errors.New("no fields to update")
	}

	q := sq.Update("books").
		Where(sq.Eq{"id": id, "deleted_at": nil}).
		PlaceholderFormat(sq.Dollar)

	for field, value := range updates {
		q = q.Set(field, value)
	}
	
	q = q.Set("updated_at", time.Now())

	query, args, err := q.ToSql()
	if err != nil {
		return err
	}

	result, err := r.db.ExecContext(ctx, query, args...)
	if err != nil {
		return err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return err
	}

	if rowsAffected == 0 {
		return sql.ErrNoRows
	}

	return nil
}
