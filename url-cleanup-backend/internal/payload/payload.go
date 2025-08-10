package payload

type CleanUpUrlRequest struct {
	Url       string `json:"url" validate:"required,url"`
	Operation string `json:"operation" validate:"required,oneof=redirection canonical all"`
}

type CleanUpUrlResponse struct {
	ProcessedUrl string `json:"processed_url"`
}
