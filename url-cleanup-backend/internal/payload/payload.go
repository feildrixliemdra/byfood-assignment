package payload

type CleanUpUrlRequest struct {
	Url       string `json:"url"`
	Operation string `json:"operation"`
}

type CleanUpUrlResponse struct {
	Url string `json:"url"`
}
