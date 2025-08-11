package errorcustom

import "errors"

var (
	ErrBookNotFound      = errors.New("book not found")
	ErrBookAlreadyExists = errors.New("book with this ISBN already exists")
)
