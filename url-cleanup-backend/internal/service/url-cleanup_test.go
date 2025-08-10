package service

import (
	"context"
	"net/url"
	"reflect"
	"testing"
	"url-cleanup-backend/internal/payload"
)

func Test_urlCleanupService_CleanUpUrl(t *testing.T) {
	type args struct {
		ctx     context.Context
		request payload.CleanUpUrlRequest
	}
	tests := []struct {
		name    string
		s       *urlCleanupService
		args    args
		want    payload.CleanUpUrlResponse
		wantErr bool
	}{
		{
			name: "canonical operation removes query and fragment",
			s:    &urlCleanupService{},
			args: args{
				ctx: context.Background(),
				request: payload.CleanUpUrlRequest{
					Url:       "https://example.com/path?query=1#fragment",
					Operation: "canonical",
				},
			},
			want: payload.CleanUpUrlResponse{
				ProcessedUrl: "https://example.com/path",
			},
			wantErr: false,
		},
		{
			name: "canonical operation removes trailing slash",
			s:    &urlCleanupService{},
			args: args{
				ctx: context.Background(),
				request: payload.CleanUpUrlRequest{
					Url:       "https://example.com/path/",
					Operation: "canonical",
				},
			},
			want: payload.CleanUpUrlResponse{
				ProcessedUrl: "https://example.com/path",
			},
			wantErr: false,
		},
		{
			name: "redirection operation converts to lowercase and changes host",
			s:    &urlCleanupService{},
			args: args{
				ctx: context.Background(),
				request: payload.CleanUpUrlRequest{
					Url:       "HTTPS://EXAMPLE.COM/PATH",
					Operation: "redirection",
				},
			},
			want: payload.CleanUpUrlResponse{
				ProcessedUrl: "https://www.byfood.com/path",
			},
			wantErr: false,
		},
		{
			name: "all operation applies both canonical and redirection",
			s:    &urlCleanupService{},
			args: args{
				ctx: context.Background(),
				request: payload.CleanUpUrlRequest{
					Url:       "HTTPS://EXAMPLE.COM/PATH/?query=1#fragment",
					Operation: "all",
				},
			},
			want: payload.CleanUpUrlResponse{
				ProcessedUrl: "https://www.byfood.com/path",
			},
			wantErr: false,
		},
		{
			name: "malformed URL returns error",
			s:    &urlCleanupService{},
			args: args{
				ctx: context.Background(),
				request: payload.CleanUpUrlRequest{
					Url:       "://invalid-url",
					Operation: "canonical",
				},
			},
			want:    payload.CleanUpUrlResponse{},
			wantErr: true,
		},
		{
			name: "empty operation defaults to empty string",
			s:    &urlCleanupService{},
			args: args{
				ctx: context.Background(),
				request: payload.CleanUpUrlRequest{
					Url:       "https://example.com",
					Operation: "unknown",
				},
			},
			want: payload.CleanUpUrlResponse{
				ProcessedUrl: "",
			},
			wantErr: false,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &urlCleanupService{}
			got, err := s.CleanUpUrl(tt.args.ctx, tt.args.request)
			if (err != nil) != tt.wantErr {
				t.Errorf("urlCleanupService.CleanUpUrl() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("urlCleanupService.CleanUpUrl() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_urlCleanupService_canonicalCleanup(t *testing.T) {
	type args struct {
		parsedUrl *url.URL
	}
	tests := []struct {
		name string
		s    *urlCleanupService
		args args
		want string
	}{
		{
			name: "removes query parameters and fragment",
			s:    &urlCleanupService{},
			args: args{
				parsedUrl: mustParseURL("https://example.com/path?query=1&param=2#fragment"),
			},
			want: "https://example.com/path",
		},
		{
			name: "removes trailing slash",
			s:    &urlCleanupService{},
			args: args{
				parsedUrl: mustParseURL("https://example.com/path/"),
			},
			want: "https://example.com/path",
		},
		{
			name: "handles root path with trailing slash",
			s:    &urlCleanupService{},
			args: args{
				parsedUrl: mustParseURL("https://example.com/"),
			},
			want: "https://example.com",
		},
		{
			name: "preserves multiple path segments",
			s:    &urlCleanupService{},
			args: args{
				parsedUrl: mustParseURL("https://example.com/path/to/resource?query=1"),
			},
			want: "https://example.com/path/to/resource",
		},
		{
			name: "handles URL with port",
			s:    &urlCleanupService{},
			args: args{
				parsedUrl: mustParseURL("https://example.com:8080/path?query=1#frag"),
			},
			want: "https://example.com:8080/path",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &urlCleanupService{}
			if got := s.canonicalCleanup(tt.args.parsedUrl); got != tt.want {
				t.Errorf("urlCleanupService.canonicalCleanup() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_urlCleanupService_redirectionCleanup(t *testing.T) {
	type args struct {
		parsedUrl *url.URL
	}
	tests := []struct {
		name string
		s    *urlCleanupService
		args args
		want string
	}{
		{
			name: "converts to lowercase and changes host to www.byfood.com",
			s:    &urlCleanupService{},
			args: args{
				parsedUrl: mustParseURL("HTTPS://EXAMPLE.COM/PATH"),
			},
			want: "https://www.byfood.com/path",
		},
		{
			name: "preserves query parameters in lowercase",
			s:    &urlCleanupService{},
			args: args{
				parsedUrl: mustParseURL("HTTPS://EXAMPLE.COM/PATH?QUERY=VALUE"),
			},
			want: "https://www.byfood.com/path?query=value",
		},
		{
			name: "handles already lowercase URL",
			s:    &urlCleanupService{},
			args: args{
				parsedUrl: mustParseURL("https://example.com/path"),
			},
			want: "https://www.byfood.com/path",
		},
		{
			name: "changes different host to byfood",
			s:    &urlCleanupService{},
			args: args{
				parsedUrl: mustParseURL("http://different-host.com/path"),
			},
			want: "http://www.byfood.com/path",
		},
		{
			name: "preserves fragment in lowercase",
			s:    &urlCleanupService{},
			args: args{
				parsedUrl: mustParseURL("HTTPS://EXAMPLE.COM/PATH#FRAGMENT"),
			},
			want: "https://www.byfood.com/path#fragment",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &urlCleanupService{}
			if got := s.redirectionCleanup(tt.args.parsedUrl); got != tt.want {
				t.Errorf("urlCleanupService.redirectionCleanup() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_urlCleanupService_allCleanup(t *testing.T) {
	type args struct {
		parsedUrl *url.URL
	}
	tests := []struct {
		name string
		s    *urlCleanupService
		args args
		want string
	}{
		{
			name: "applies both canonical and redirection cleanup",
			s:    &urlCleanupService{},
			args: args{
				parsedUrl: mustParseURL("HTTPS://EXAMPLE.COM/PATH/?query=1#fragment"),
			},
			want: "https://www.byfood.com/path",
		},
		{
			name: "removes trailing slash and converts to byfood host",
			s:    &urlCleanupService{},
			args: args{
				parsedUrl: mustParseURL("HTTP://DIFFERENT.COM/SOME/PATH/"),
			},
			want: "http://www.byfood.com/some/path",
		},
		{
			name: "handles complex URL with all elements",
			s:    &urlCleanupService{},
			args: args{
				parsedUrl: mustParseURL("HTTPS://SUBDOMAIN.EXAMPLE.COM:8080/PATH/TO/RESOURCE/?param1=VALUE1&param2=VALUE2#section"),
			},
			want: "https://www.byfood.com/path/to/resource",
		},
		{
			name: "handles root path",
			s:    &urlCleanupService{},
			args: args{
				parsedUrl: mustParseURL("HTTP://EXAMPLE.COM/"),
			},
			want: "http://www.byfood.com",
		},
		{
			name: "handles simple domain",
			s:    &urlCleanupService{},
			args: args{
				parsedUrl: mustParseURL("HTTPS://EXAMPLE.COM"),
			},
			want: "https://www.byfood.com",
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s := &urlCleanupService{}
			if got := s.allCleanup(tt.args.parsedUrl); got != tt.want {
				t.Errorf("urlCleanupService.allCleanup() = %v, want %v", got, tt.want)
			}
		})
	}
}

// Helper function to parse URL for testing
func mustParseURL(rawURL string) *url.URL {
	parsedURL, err := url.Parse(rawURL)
	if err != nil {
		panic(err)
	}
	return parsedURL
}
