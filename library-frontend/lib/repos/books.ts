import { type ApiResponse, http } from "@/lib/http";
import type {
	BookResponse,
	CreateBookRequest,
	CreateBookResponse,
	GetBooksResponse,
	UpdateBookRequest,
} from "./books.types";

export interface BookRepository {
	list(params?: {
		page?: number;
		limit?: number;
		title?: string;
	}): Promise<ApiResponse<GetBooksResponse>>;
	getById(id: string): Promise<ApiResponse<BookResponse>>;
	create(payload: CreateBookRequest): Promise<ApiResponse<CreateBookResponse>>;
	update(
		id: string,
		payload: Omit<UpdateBookRequest, "id">,
	): Promise<ApiResponse<unknown>>;
	remove(id: string): Promise<ApiResponse<unknown>>;
}

class HttpBookRepository implements BookRepository {
	async list(params?: {
		page?: number;
		limit?: number;
		title?: string;
	}): Promise<ApiResponse<GetBooksResponse>> {
		const search = new URLSearchParams();
		if (params?.page != null) search.set("page", String(params.page));
		if (params?.limit != null) search.set("limit", String(params.limit));
		if (params?.title) search.set("title", params.title);
		const qs = search.toString();
		return http.get<ApiResponse<GetBooksResponse>>(
			`/v1/books${qs ? `?${qs}` : ""}` as const,
		);
	}

	async getById(id: string): Promise<ApiResponse<BookResponse>> {
		return http.get<ApiResponse<BookResponse>>(`/v1/books/${id}` as const);
	}

	async create(
		payload: CreateBookRequest,
	): Promise<ApiResponse<CreateBookResponse>> {
		const res = await http.post<ApiResponse<CreateBookResponse>>(
			`/v1/books` as const,
			payload,
		);
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
		return res;
	}

	async remove(id: string): Promise<ApiResponse<unknown>> {
		const res = await http.delete<ApiResponse<unknown>>(
			`/v1/books/${id}` as const,
		);
		return res;
	}
}

export const bookRepo: BookRepository = new HttpBookRepository();

export type {
	BookResponse,
	CreateBookRequest,
	CreateBookResponse,
	GetBooksResponse,
	UpdateBookRequest,
} from "./books.types";

// React Query keys
export const booksQueryKey = (page: number, limit: number, title?: string) =>
	["books", { page, limit, title: title ?? "" }] as const;
export const bookDetailQueryKey = (id: string) => ["books", id] as const;
