package model

import (
	"time"

	"github.com/google/uuid"
)

type Book struct {
	ID                uuid.UUID `json:"id" db:"id"`
	ISBN              string    `json:"isbn" db:"isbn"`
	Title             string    `json:"title" db:"title"`
	Author            string    `json:"author" db:"author"`
	Publisher         string    `json:"publisher" db:"publisher"`
	YearOfPublication int       `json:"year_of_publication" db:"year_of_publication"`
	Category          string    `json:"category" db:"category"`
	ImageURL          string    `json:"image_url" db:"image_url"`
	CreatedAt         time.Time `json:"created_at" db:"created_at"`
	UpdatedAt         time.Time `json:"updated_at" db:"updated_at"`
	DeletedAt         time.Time `json:"deleted_at" db:"deleted_at"`
}
