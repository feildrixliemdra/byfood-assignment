package errorcustom

import "errors"

var (
	ErrBookNotFound = errors.New("book not found")
)
