package service

import (
	"context"
	"net/url"
	"strings"
	"url-cleanup-backend/internal/payload"
)

type UrlCleanupService interface {
	CleanUpUrl(ctx context.Context, request payload.CleanUpUrlRequest) (payload.CleanUpUrlResponse, error)
}

type urlCleanupService struct{}

func NewUrlCleanupService() UrlCleanupService {
	return &urlCleanupService{}
}

func (s *urlCleanupService) CleanUpUrl(ctx context.Context, request payload.CleanUpUrlRequest) (payload.CleanUpUrlResponse, error) {
	parsedUrl, err := url.Parse(request.Url)
	if err != nil {
		return payload.CleanUpUrlResponse{}, err
	}

	var processedUrl string

	switch request.Operation {
	case "canonical":
		processedUrl = s.canonicalCleanup(parsedUrl)
	case "redirection":
		processedUrl = s.redirectionCleanup(parsedUrl)
	case "all":
		processedUrl = s.allCleanup(parsedUrl)
	}

	return payload.CleanUpUrlResponse{
		ProcessedUrl: processedUrl,
	}, nil
}

func (s *urlCleanupService) canonicalCleanup(parsedUrl *url.URL) string {
	// Remove query parameters and fragment
	parsedUrl.RawQuery = ""
	parsedUrl.Fragment = ""

	// Remove trailing slash
	parsedUrl.Path = strings.TrimRight(parsedUrl.Path, "/")

	return parsedUrl.String()
}

func (s *urlCleanupService) redirectionCleanup(parsedUrl *url.URL) string {
	// Convert entire URL to lowercase
	lowerUrl := strings.ToLower(parsedUrl.String())

	// Parse the lowercase URL
	lowercaseParsed, _ := url.Parse(lowerUrl)

	// Ensure domain is www.byfood.com
	lowercaseParsed.Host = "www.byfood.com"

	return lowercaseParsed.String()
}

func (s *urlCleanupService) allCleanup(parsedUrl *url.URL) string {
	// First apply canonical cleanup
	canonical := s.canonicalCleanup(parsedUrl)

	// Parse the canonical URL and apply redirection cleanup
	canonicalParsed, _ := url.Parse(canonical)
	return s.redirectionCleanup(canonicalParsed)
}
