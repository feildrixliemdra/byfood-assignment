package service

import (
	"context"
	"errors"
	"library-backend/errorcustom"
	"library-backend/internal/model"
	"library-backend/internal/payload"
	"library-backend/internal/repository/mock"
	"reflect"
	"testing"
	"time"

	"github.com/golang/mock/gomock"
	"github.com/google/uuid"
)

func Test_bookService_CreateBook(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := mock.NewMockBookRepository(ctrl)
	service := NewBookService(mockRepo)

	ctx := context.Background()
	request := payload.CreateBookRequest{
		ISBN:              "978-0134685991",
		Title:             "Effective Java",
		Author:            "Joshua Bloch",
		Publisher:         "Addison-Wesley",
		YearOfPublication: 2017,
		Category:          "Programming",
		ImageURL:          "https://example.com/image.jpg",
	}

	tests := []struct {
		name     string
		mockFunc func()
		request  payload.CreateBookRequest
		wantErr  bool
	}{
		{
			name: "success",
			mockFunc: func() {
				mockRepo.EXPECT().CreateBook(ctx, gomock.Any()).Return(nil)
			},
			request: request,
			wantErr: false,
		},
		{
			name: "repository error",
			mockFunc: func() {
				mockRepo.EXPECT().CreateBook(ctx, gomock.Any()).Return(errors.New("db error"))
			},
			request: request,
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.mockFunc()
			gotRes, err := service.CreateBook(ctx, tt.request)
			if (err != nil) != tt.wantErr {
				t.Errorf("bookService.CreateBook() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !tt.wantErr && gotRes.ID == uuid.Nil {
				t.Errorf("bookService.CreateBook() expected valid ID, got nil")
			}
		})
	}
}

func Test_bookService_GetBooks(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := mock.NewMockBookRepository(ctrl)
	service := NewBookService(mockRepo)

	ctx := context.Background()
	now := time.Now()
	
	sampleBooks := []model.Book{
		{
			ID:                uuid.New(),
			ISBN:              "978-0134685991",
			Title:             "Effective Java",
			Author:            "Joshua Bloch",
			Publisher:         "Addison-Wesley",
			YearOfPublication: 2017,
			Category:          "Programming",
			ImageURL:          "https://example.com/image.jpg",
			CreatedAt:         now,
			UpdatedAt:         now,
		},
	}

	tests := []struct {
		name     string
		mockFunc func()
		request  payload.GetBooksRequest
		wantErr  bool
	}{
		{
			name: "success",
			mockFunc: func() {
				expectedReq := payload.GetBooksRequest{
					PaginationRequest: payload.PaginationRequest{Page: 1, Limit: 10},
					Offset: 0,
				}
				mockRepo.EXPECT().GetBooks(ctx, expectedReq).Return(sampleBooks, nil)
				mockRepo.EXPECT().GetBooksCount(ctx).Return(1, nil)
			},
			request: payload.GetBooksRequest{
				PaginationRequest: payload.PaginationRequest{Page: 1, Limit: 10},
			},
			wantErr: false,
		},
		{
			name: "get books error",
			mockFunc: func() {
				expectedReq := payload.GetBooksRequest{
					PaginationRequest: payload.PaginationRequest{Page: 1, Limit: 10},
					Offset: 0,
				}
				mockRepo.EXPECT().GetBooks(ctx, expectedReq).Return(nil, errors.New("db error"))
			},
			request: payload.GetBooksRequest{
				PaginationRequest: payload.PaginationRequest{Page: 1, Limit: 10},
			},
			wantErr: true,
		},
		{
			name: "get books count error",
			mockFunc: func() {
				expectedReq := payload.GetBooksRequest{
					PaginationRequest: payload.PaginationRequest{Page: 1, Limit: 10},
					Offset: 0,
				}
				mockRepo.EXPECT().GetBooks(ctx, expectedReq).Return(sampleBooks, nil)
				mockRepo.EXPECT().GetBooksCount(ctx).Return(0, errors.New("db error"))
			},
			request: payload.GetBooksRequest{
				PaginationRequest: payload.PaginationRequest{Page: 1, Limit: 10},
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.mockFunc()
			gotRes, err := service.GetBooks(ctx, tt.request)
			if (err != nil) != tt.wantErr {
				t.Errorf("bookService.GetBooks() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if !tt.wantErr && len(gotRes.Books) != len(sampleBooks) {
				t.Errorf("bookService.GetBooks() expected %d books, got %d", len(sampleBooks), len(gotRes.Books))
			}
		})
	}
}

func Test_bookService_GetBookByID(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := mock.NewMockBookRepository(ctrl)
	service := NewBookService(mockRepo)

	ctx := context.Background()
	bookID := uuid.New().String()
	now := time.Now()
	
	sampleBook := &model.Book{
		ID:                uuid.MustParse(bookID),
		ISBN:              "978-0134685991",
		Title:             "Effective Java",
		Author:            "Joshua Bloch",
		Publisher:         "Addison-Wesley",
		YearOfPublication: 2017,
		Category:          "Programming",
		ImageURL:          "https://example.com/image.jpg",
		CreatedAt:         now,
		UpdatedAt:         now,
	}

	tests := []struct {
		name     string
		mockFunc func()
		id       string
		wantErr  bool
		errorMsg string
	}{
		{
			name: "success",
			mockFunc: func() {
				mockRepo.EXPECT().GetBookByID(ctx, bookID).Return(sampleBook, nil)
			},
			id:      bookID,
			wantErr: false,
		},
		{
			name: "book not found",
			mockFunc: func() {
				mockRepo.EXPECT().GetBookByID(ctx, bookID).Return(nil, nil)
			},
			id:       bookID,
			wantErr:  true,
			errorMsg: errorcustom.ErrBookNotFound.Error(),
		},
		{
			name: "repository error",
			mockFunc: func() {
				mockRepo.EXPECT().GetBookByID(ctx, bookID).Return(nil, errors.New("db error"))
			},
			id:      bookID,
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.mockFunc()
			gotRes, err := service.GetBookByID(ctx, tt.id)
			if (err != nil) != tt.wantErr {
				t.Errorf("bookService.GetBookByID() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if tt.errorMsg != "" && err != nil && err.Error() != tt.errorMsg {
				t.Errorf("bookService.GetBookByID() error = %v, want %v", err.Error(), tt.errorMsg)
			}
			if !tt.wantErr && gotRes.ID != sampleBook.ID {
				t.Errorf("bookService.GetBookByID() expected ID %v, got %v", sampleBook.ID, gotRes.ID)
			}
		})
	}
}

func Test_bookService_buildUpdateMap(t *testing.T) {
	service := &bookService{}

	title := "Updated Title"
	author := "Updated Author"
	year := 2023
	
	tests := []struct {
		name    string
		request payload.UpdateBookRequest
		want    map[string]any
	}{
		{
			name: "all fields provided",
			request: payload.UpdateBookRequest{
				ID:                uuid.New().String(),
				Title:             &title,
				Author:            &author,
				YearOfPublication: &year,
			},
			want: map[string]any{
				"title":               "Updated Title",
				"author":              "Updated Author",
				"year_of_publication": 2023,
			},
		},
		{
			name: "partial fields provided",
			request: payload.UpdateBookRequest{
				ID:     uuid.New().String(),
				Title:  &title,
				Author: &author,
			},
			want: map[string]any{
				"title":  "Updated Title",
				"author": "Updated Author",
			},
		},
		{
			name: "no fields provided",
			request: payload.UpdateBookRequest{
				ID: uuid.New().String(),
			},
			want: map[string]any{},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := service.buildUpdateMap(tt.request); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("bookService.buildUpdateMap() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_bookService_UpdateBook(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := mock.NewMockBookRepository(ctrl)
	service := NewBookService(mockRepo)

	ctx := context.Background()
	bookID := uuid.New().String()
	now := time.Now()
	
	sampleBook := &model.Book{
		ID:                uuid.MustParse(bookID),
		ISBN:              "978-0134685991",
		Title:             "Effective Java",
		Author:            "Joshua Bloch",
		Publisher:         "Addison-Wesley",
		YearOfPublication: 2017,
		Category:          "Programming",
		ImageURL:          "https://example.com/image.jpg",
		CreatedAt:         now,
		UpdatedAt:         now,
	}

	title := "Updated Title"

	tests := []struct {
		name     string
		mockFunc func()
		request  payload.UpdateBookRequest
		wantErr  bool
		errorMsg string
	}{
		{
			name: "success",
			mockFunc: func() {
				mockRepo.EXPECT().GetBookByID(ctx, bookID).Return(sampleBook, nil)
				mockRepo.EXPECT().UpdateBook(ctx, bookID, map[string]any{"title": "Updated Title"}).Return(nil)
			},
			request: payload.UpdateBookRequest{
				ID:    bookID,
				Title: &title,
			},
			wantErr: false,
		},
		{
			name: "book not found",
			mockFunc: func() {
				mockRepo.EXPECT().GetBookByID(ctx, bookID).Return(nil, nil)
			},
			request: payload.UpdateBookRequest{
				ID:    bookID,
				Title: &title,
			},
			wantErr:  true,
			errorMsg: errorcustom.ErrBookNotFound.Error(),
		},
		{
			name: "no fields to update",
			mockFunc: func() {
				mockRepo.EXPECT().GetBookByID(ctx, bookID).Return(sampleBook, nil)
			},
			request: payload.UpdateBookRequest{
				ID: bookID,
			},
			wantErr:  true,
			errorMsg: "no fields to update",
		},
		{
			name: "repository get error",
			mockFunc: func() {
				mockRepo.EXPECT().GetBookByID(ctx, bookID).Return(nil, errors.New("db error"))
			},
			request: payload.UpdateBookRequest{
				ID:    bookID,
				Title: &title,
			},
			wantErr: true,
		},
		{
			name: "repository update error",
			mockFunc: func() {
				mockRepo.EXPECT().GetBookByID(ctx, bookID).Return(sampleBook, nil)
				mockRepo.EXPECT().UpdateBook(ctx, bookID, map[string]any{"title": "Updated Title"}).Return(errors.New("update error"))
			},
			request: payload.UpdateBookRequest{
				ID:    bookID,
				Title: &title,
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.mockFunc()
			err := service.UpdateBook(ctx, tt.request)
			if (err != nil) != tt.wantErr {
				t.Errorf("bookService.UpdateBook() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if tt.errorMsg != "" && err != nil && err.Error() != tt.errorMsg {
				t.Errorf("bookService.UpdateBook() error = %v, want %v", err.Error(), tt.errorMsg)
			}
		})
	}
}

func Test_bookService_DeleteBook(t *testing.T) {
	ctrl := gomock.NewController(t)
	defer ctrl.Finish()

	mockRepo := mock.NewMockBookRepository(ctrl)
	service := NewBookService(mockRepo)

	ctx := context.Background()
	bookID := uuid.New().String()
	now := time.Now()
	
	sampleBook := &model.Book{
		ID:                uuid.MustParse(bookID),
		ISBN:              "978-0134685991",
		Title:             "Effective Java",
		Author:            "Joshua Bloch",
		Publisher:         "Addison-Wesley",
		YearOfPublication: 2017,
		Category:          "Programming",
		ImageURL:          "https://example.com/image.jpg",
		CreatedAt:         now,
		UpdatedAt:         now,
	}

	tests := []struct {
		name     string
		mockFunc func()
		request  payload.DeleteBookRequest
		wantErr  bool
		errorMsg string
	}{
		{
			name: "success",
			mockFunc: func() {
				mockRepo.EXPECT().GetBookByID(ctx, bookID).Return(sampleBook, nil)
				mockRepo.EXPECT().DeleteBook(ctx, bookID).Return(nil)
			},
			request: payload.DeleteBookRequest{
				ID: bookID,
			},
			wantErr: false,
		},
		{
			name: "book not found",
			mockFunc: func() {
				mockRepo.EXPECT().GetBookByID(ctx, bookID).Return(nil, nil)
			},
			request: payload.DeleteBookRequest{
				ID: bookID,
			},
			wantErr:  true,
			errorMsg: errorcustom.ErrBookNotFound.Error(),
		},
		{
			name: "repository get error",
			mockFunc: func() {
				mockRepo.EXPECT().GetBookByID(ctx, bookID).Return(nil, errors.New("db error"))
			},
			request: payload.DeleteBookRequest{
				ID: bookID,
			},
			wantErr: true,
		},
		{
			name: "repository delete error",
			mockFunc: func() {
				mockRepo.EXPECT().GetBookByID(ctx, bookID).Return(sampleBook, nil)
				mockRepo.EXPECT().DeleteBook(ctx, bookID).Return(errors.New("delete error"))
			},
			request: payload.DeleteBookRequest{
				ID: bookID,
			},
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			tt.mockFunc()
			err := service.DeleteBook(ctx, tt.request)
			if (err != nil) != tt.wantErr {
				t.Errorf("bookService.DeleteBook() error = %v, wantErr %v", err, tt.wantErr)
				return
			}
			if tt.errorMsg != "" && err != nil && err.Error() != tt.errorMsg {
				t.Errorf("bookService.DeleteBook() error = %v, want %v", err.Error(), tt.errorMsg)
			}
		})
	}
}
