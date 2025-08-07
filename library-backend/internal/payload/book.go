package payload

import (
	"library-backend/internal/model"

	"github.com/google/uuid"
)

type CreateBookRequest struct {
	ISBN              string `json:"isbn" validate:"required"`
	Title             string `json:"title" validate:"required"`
	Author            string `json:"author" validate:"required"`
	Publisher         string `json:"publisher" validate:"required"`
	YearOfPublication int    `json:"year_of_publication" validate:"required"`
	Category          string `json:"category" validate:"required"`
	ImageURL          string `json:"image_url"`
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
