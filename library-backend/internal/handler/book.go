package handler

import (
	"errors"
	"library-backend/errorcustom"
	"library-backend/internal/payload"
	"library-backend/internal/service"
	"library-backend/internal/util"
	"library-backend/internal/validator"

	"github.com/gofiber/fiber/v2"
)

type BookHandler interface {
	CreateBook(c *fiber.Ctx) error
	GetBooks(c *fiber.Ctx) error
	GetBookByID(c *fiber.Ctx) error
}

type bookHandler struct {
	bookService service.BookService
}

func NewBookHandler(bookService service.BookService) BookHandler {
	return &bookHandler{bookService: bookService}
}

// CreateBook Creating Book
//
//	@Summary        Create a new book
//	@Description    Create a new book with the provided details
//	@Tags           Books
//	@Accept         json
//	@Produce        json
//	@Param          book  body      payload.CreateBookRequest  true  "Book data"
//	@Success        200   {object}  payload.Response{data=payload.CreateBookResponse}
//	@Failure        400   {object}  payload.GlobalErrorHandlerResp
//	@Failure        500   {object}  payload.GlobalErrorHandlerResp
//	@Router         /v1/books [post]
func (h *bookHandler) CreateBook(c *fiber.Ctx) error {
	var request payload.CreateBookRequest

	if err := c.BodyParser(&request); err != nil {
		return util.ErrBindResponse(c, err)
	}

	err := validator.Validate.Struct(request)
	if err != nil {
		return util.ErrBindResponse(c, err)
	}

	res, err := h.bookService.CreateBook(c.Context(), request)
	if err != nil {
		return util.ErrInternalResponse(c)
	}

	return util.SuccessResponse(c, res)
}

// GetBooks Getting Books
//
//	@Summary        Get Books with pagination
//	@Description    Get a list of books with pagination support
//	@Tags           Books
//	@Accept         json
//	@Produce        json
//	@Param          page     query    int  false  "Page number (default: 1)"
//	@Param          limit    query    int  false  "Items per page (default: 10)"
//	@Success        200      {object} payload.Response{data=payload.GetBooksResponse}
//	@Failure        400      {object} payload.GlobalErrorHandlerResp
//	@Failure        500      {object} payload.GlobalErrorHandlerResp
//	@Router         /v1/books [get]
func (h *bookHandler) GetBooks(c *fiber.Ctx) error {
	var request payload.GetBooksRequest

	if err := c.QueryParser(&request); err != nil {
		return util.ErrBindResponse(c, err)
	}

	if request.Page == 0 {
		request.Page = 1
	}

	if request.Limit == 0 {
		request.Limit = 10 // set default limit is 10
	}

	res, err := h.bookService.GetBooks(c.Context(), request)
	if err != nil {
		return util.ErrInternalResponse(c)
	}

	return util.SuccessResponse(c, res)
}

// GetBookByID Getting Book by ID
//
//	@Summary        Get Book by ID
//	@Description    Get a specific book by its ID
//	@Tags           Books
//	@Accept         json
//	@Produce        json
//	@Param          id   path     string  true  "Book ID"
//	@Success        200  {object} payload.Response{data=payload.GetBookByIDResponse}
//	@Failure        400  {object} payload.GlobalErrorHandlerResp
//	@Failure        404  {object} payload.GlobalErrorHandlerResp
//	@Failure        500  {object} payload.GlobalErrorHandlerResp
//	@Router         /v1/books/{id} [get]
func (h *bookHandler) GetBookByID(c *fiber.Ctx) error {
	var request payload.GetBookByIDRequest

	id := c.Params("id")
	request.ID = id

	err := validator.Validate.Struct(request)
	if err != nil {
		return util.ErrBindResponse(c, err)
	}

	res, err := h.bookService.GetBookByID(c.Context(), request.ID)
	if err != nil {
		if errors.Is(err, errorcustom.ErrBookNotFound) {
			return util.ErrNotFoundResponse(c)
		}
		return util.ErrInternalResponse(c)
	}
	return util.SuccessResponse(c, res)
}
