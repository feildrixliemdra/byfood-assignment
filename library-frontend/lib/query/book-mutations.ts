"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	createBookAction,
	deleteBookAction,
	updateBookAction,
} from "@/app/books/actions";
import type { ApiResponse } from "@/lib/http";
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
			// Only invalidate active queries to reduce network calls
			await qc.invalidateQueries({ queryKey: ["books"], refetchType: "active" });
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
			// Update cached pages optimistically
			qc.setQueriesData(
				{ queryKey: ["books"] },
				(old: ApiResponse<GetBooksResponse> | undefined) => {
					if (!old?.data) return old;
					const next: ApiResponse<GetBooksResponse> = {
						...old,
						data: {
							...old.data,
							books: old.data.books.map((b) =>
								b.id === variables.id
									? ({ ...b, ...variables.payload } as BookResponse)
									: b,
							),
						},
					};
					return next;
				},
			);
			await qc.invalidateQueries({ queryKey: ["books"], refetchType: "active" });
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
			await qc.invalidateQueries({ queryKey: ["books"], refetchType: "active" });
		},
	});
}
