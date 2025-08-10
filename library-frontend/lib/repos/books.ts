import "server-only";
import { revalidateTag } from "next/cache";
import { type ApiResponse, http } from "@/lib/http";

// Swagger-driven types
export type Pagination = {
	page: number;
	limit: number;
	total_page: number;
	total_item: number;
};

export type BookResponse = {
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

export type GetBooksResponse = {
	books: BookResponse[];
	pagination: Pagination;
};

export type CreateBookRequest = {
	isbn: string;
	title: string;
	author: string;
	publisher: string;
	year_of_publication: number;
	category: string;
	image_url?: string;
};

export type CreateBookResponse = {
	id: string;
};

export type UpdateBookRequest = Partial<CreateBookRequest> & {
	id: string;
};

export interface BookRepository {
	list(params?: {
		page?: number;
		limit?: number;
	}): Promise<ApiResponse<GetBooksResponse>>;
	getById(id: string): Promise<ApiResponse<BookResponse>>;
	create(payload: CreateBookRequest): Promise<ApiResponse<CreateBookResponse>>;
	update(
		id: string,
		payload: Omit<UpdateBookRequest, "id">,
	): Promise<ApiResponse<unknown>>;
	remove(id: string): Promise<ApiResponse<unknown>>;
}

const TAG = "books";

class HttpBookRepository implements BookRepository {
	async list(params?: {
		page?: number;
		limit?: number;
	}): Promise<ApiResponse<GetBooksResponse>> {
		const search = new URLSearchParams();
		if (params?.page != null) search.set("page", String(params.page));
		if (params?.limit != null) search.set("limit", String(params.limit));
		const qs = search.toString();
		return http.get<ApiResponse<GetBooksResponse>>(
			`/v1/books${qs ? `?${qs}` : ""}` as const,
			{
				revalidate: 60,
				tags: [TAG],
			},
		);
	}

	async getById(id: string): Promise<ApiResponse<BookResponse>> {
		return http.get<ApiResponse<BookResponse>>(`/v1/books/${id}` as const, {
			revalidate: 300,
			tags: [TAG],
		});
	}

	async create(
		payload: CreateBookRequest,
	): Promise<ApiResponse<CreateBookResponse>> {
		const res = await http.post<ApiResponse<CreateBookResponse>>(
			`/v1/books` as const,
			payload,
		);
		revalidateTag(TAG);
		return res;
	}

	async update(
		id: string,
		payload: Omit<UpdateBookRequest, "id">,
	): Promise<ApiResponse<unknown>> {
		const res = await http.put<ApiResponse<unknown>>(
			`/v1/books/${id}` as const,
			payload,
		);
		revalidateTag(TAG);
		return res;
	}

	async remove(id: string): Promise<ApiResponse<unknown>> {
		const res = await http.delete<ApiResponse<unknown>>(
			`/v1/books/${id}` as const,
		);
		revalidateTag(TAG);
		return res;
	}
}

export const bookRepo: BookRepository = new HttpBookRepository();
