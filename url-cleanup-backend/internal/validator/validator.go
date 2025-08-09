package validator

import (
	"errors"
	"reflect"
	"strings"
	"url-cleanup-backend/internal/payload"

	"github.com/go-playground/locales/en"
	ut "github.com/go-playground/universal-translator"
	"github.com/go-playground/validator/v10"
	en_translations "github.com/go-playground/validator/v10/translations/en"
)

var TranslatorInst ut.Translator
var Validate = validator.New()

func init() {
	english := en.New()
	uni := ut.New(english, english)
	TranslatorInst, _ = uni.GetTranslator("en")
	_ = en_translations.RegisterDefaultTranslations(Validate, TranslatorInst)
	// register tag e.Field() use json tag
	Validate.RegisterTagNameFunc(func(fld reflect.StructField) string {
		name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})
}

func TranslateErrorValidator(err error) (res []payload.ErrorValidation) {
	var (
		invalidValidationError *validator.InvalidValidationError
		errs                   validator.ValidationErrors
	)

	// not accepted error by validator
	if errors.As(err, &invalidValidationError) {
		return
	}

	// iterate error message
	ok := errors.As(err, &errs)
	if !ok {
		return
	}

	for _, e := range errs {
		res = append(res, payload.ErrorValidation{
			Field:   e.Field(),
			Message: e.Translate(TranslatorInst),
		})

	}

	return
}
