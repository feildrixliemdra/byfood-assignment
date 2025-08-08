package payload

import (
	"library-backend/internal/model"
	"time"

	"github.com/google/uuid"
)

type CreateBookRequest struct {
	ISBN              string `json:"isbn" validate:"required,isbn"`
	Title             string `json:"title" validate:"required,min=3,max=150"`
	Author            string `json:"author" validate:"required"`
	Publisher         string `json:"publisher" validate:"required"`
	YearOfPublication int    `json:"year_of_publication" validate:"required,min=1800,max=2050"`
	Category          string `json:"category" validate:"required"`
	ImageURL          string `json:"image_url,omitempty" validate:"omitempty,url"`
}

func (r *CreateBookRequest) ToModel() model.Book {
	return model.Book{
		ID:                uuid.New(),
		ISBN:              r.ISBN,
		Title:             r.Title,
		Author:            r.Author,
		Publisher:         r.Publisher,
		YearOfPublication: r.YearOfPublication,
		Category:          r.Category,
		ImageURL:          r.ImageURL,
	}
}

type CreateBookResponse struct {
	ID uuid.UUID `json:"id"`
}

type GetBooksRequest struct {
	PaginationRequest
}

type GetBooksResponse struct {
	Books      []BookResponse `json:"books"`
	Pagination Pagination     `json:"pagination"`
}

type GetBookByIDRequest struct {
	ID string `params:"id" validate:"required,uuid"`
}

type GetBookByIDResponse struct {
	BookResponse
}

type UpdateBookRequest struct {
	ID                string  `params:"id" validate:"required,uuid"`
	ISBN              *string `json:"isbn,omitempty" validate:"omitempty,isbn"`
	Title             *string `json:"title,omitempty" validate:"omitempty,min=3,max=150"`
	Author            *string `json:"author,omitempty"`
	Publisher         *string `json:"publisher,omitempty"`
	YearOfPublication *int    `json:"year_of_publication,omitempty"`
	Category          *string `json:"category,omitempty"`
	ImageURL          *string `json:"image_url,omitempty" validate:"omitempty,url"`
}

type BookResponse struct {
	ID                uuid.UUID `json:"id"`
	ISBN              string    `json:"isbn"`
	Title             string    `json:"title"`
	Author            string    `json:"author"`
	Publisher         string    `json:"publisher"`
	YearOfPublication int       `json:"year_of_publication"`
	Category          string    `json:"category"`
	ImageURL          string    `json:"image_url"`
	CreatedAt         time.Time `json:"created_at"`
	UpdatedAt         time.Time `json:"updated_at"`
}
