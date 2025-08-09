package bootstrap

import (
	"url-cleanup-backend/internal/payload"

	"github.com/go-playground/validator/v10"
)

var validate *validator.Validate

func init() {
	validate = validator.New()
}

type XValidator struct {
	validator *validator.Validate
}

func NewXValidator() *XValidator {
	return &XValidator{
		validator: validate,
	}
}

func (v XValidator) Validate(data interface{}) []payload.ErrorResponse {
	validationErrors := []payload.ErrorResponse{}

	errs := validate.Struct(data)
	if errs != nil {
		for _, err := range errs.(validator.ValidationErrors) {
			// In this case data object is actually holding the User struct
			var elem payload.ErrorResponse

			elem.FailedField = err.Field() // Export struct field name
			elem.Tag = err.Tag()           // Export struct tag
			elem.Value = err.Value()       // Export field value
			elem.Error = true

			validationErrors = append(validationErrors, elem)
		}
	}

	return validationErrors
}
