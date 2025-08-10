export interface Pagination {
	page: number;
	limit: number;
	total_page: number;
	total_item: number;
};

export interface BookResponse {
	id: string;
	isbn: string;
	title: string;
	author: string;
	publisher: string;
	year_of_publication: number;
	category: string;
	image_url?: string;
	created_at?: string;
	updated_at?: string;
};

export interface GetBooksResponse {
	books: BookResponse[];
	pagination: Pagination;
};

export interface CreateBookRequest {
	isbn: string;
	title: string;
	author: string;
	publisher: string;
	year_of_publication: number;
	category: string;
	image_url?: string;
};

export interface CreateBookResponse {
	id: string;
};

export interface UpdateBookRequest extends Partial<CreateBookRequest> {
	id: string;
};
