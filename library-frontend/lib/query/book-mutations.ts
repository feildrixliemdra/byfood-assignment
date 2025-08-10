"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	createBookAction,
	deleteBookAction,
	updateBookAction,
} from "@/app/books/actions";
import type { ApiResponse } from "@/lib/http";
import { showErrorToast } from "@/lib/error-handler";
import type {
	BookResponse,
	CreateBookRequest,
	CreateBookResponse,
	GetBooksResponse,
	UpdateBookRequest,
} from "@/lib/repos/books.types";

export function useCreateBook() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (payload: CreateBookRequest) => {
			return (await createBookAction(
				payload,
			)) as ApiResponse<CreateBookResponse>;
		},
		onSuccess: async () => {
			await qc.invalidateQueries({
				queryKey: ["books"],
				refetchType: "active",
			});
		},
		onError: (error) => {
			showErrorToast(error, "create book");
		},
	});
}

export function useUpdateBook() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (args: {
			id: string;
			payload: Omit<UpdateBookRequest, "id">;
		}) => {
			return (await updateBookAction(
				args.id,
				args.payload,
			)) as ApiResponse<unknown>;
		},
		onSuccess: async (_res, variables) => {
			// Optimistic update: move updated book to top (API orders by updated_at DESC)
			qc.setQueriesData(
				{ queryKey: ["books"] },
				(old: ApiResponse<GetBooksResponse> | undefined) => {
					if (!old?.data) return old;

					// Find the book being updated
					const updatedBookIndex = old.data.books.findIndex(
						(b) => b.id === variables.id,
					);
					if (updatedBookIndex === -1) return old;

					// Create updated book with new data and current timestamp
					const updatedBook = {
						...old.data.books[updatedBookIndex],
						...variables.payload,
						updated_at: new Date().toISOString(),
					} as BookResponse;

					// Remove book from current position and add to top (most recent)
					const booksWithoutUpdated = old.data.books.filter(
						(b) => b.id !== variables.id,
					);

					return {
						...old,
						data: {
							...old.data,
							books: [updatedBook, ...booksWithoutUpdated],
						},
					};
				},
			);
			await qc.invalidateQueries({
				queryKey: ["books"],
				refetchType: "active",
			});
		},
		onError: (error) => {
			showErrorToast(error, "update book");
		},
	});
}

export function useDeleteBook() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async (id: string) => {
			return (await deleteBookAction(id)) as ApiResponse<unknown>;
		},
		onSuccess: async (_res, id) => {
			// Remove from cached pages
			qc.setQueriesData(
				{ queryKey: ["books"] },
				(old: ApiResponse<GetBooksResponse> | undefined) => {
					if (!old?.data) return old;
					const filtered = old.data.books.filter((b) => b.id !== id);
					const next: ApiResponse<GetBooksResponse> = {
						...old,
						data: {
							...old.data,
							books: filtered,
							pagination: {
								...old.data.pagination,
								total_item: Math.max(0, old.data.pagination.total_item - 1),
							},
						},
					};
					return next;
				},
			);
			await qc.invalidateQueries({
				queryKey: ["books"],
				refetchType: "active",
			});
		},
		onError: (error) => {
			showErrorToast(error, "delete book");
		},
	});
}
