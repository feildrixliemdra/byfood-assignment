package payload

type (
	Response struct {
		Success bool              `json:"success"`
		Message string            `json:"message"`
		Data    interface{}       `json:"data"`
		Error   interface{}       `json:"error,omitempty"`
		Errors  []ErrorValidation `json:"errors,omitempty"`
	}

	ErrorValidation struct {
		Field   string `json:"field"`
		Message string `json:"message"`
	}

	ErrorResponse struct {
		Error       bool
		FailedField string
		Tag         string
		Value       interface{}
	}

	GlobalErrorHandlerResp struct {
		Success bool   `json:"success"`
		Message string `json:"message"`
	}
)
