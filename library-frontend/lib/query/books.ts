"use client";

import {
	keepPreviousData,
	queryOptions,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query";
import type { ApiResponse } from "@/lib/http";
import {
	bookRepo,
	booksQueryKey,
	type GetBooksResponse,
} from "@/lib/repos/books";

export function useBooksList(page: number, limit: number, title?: string) {
	const options = queryOptions<ApiResponse<GetBooksResponse>>({
		queryKey: booksQueryKey(page, limit, title),
		queryFn: () => bookRepo.list({ page, limit, title }),
		placeholderData: keepPreviousData,
		staleTime: 30_000,
		gcTime: 5 * 60_000,
		retry: 1,
	});
	return useQuery(options);
}

export function usePrefetchAdjacentBooks(
	page: number,
	limit: number,
	title?: string,
) {
	const qc = useQueryClient();
	return () => {
		void qc.prefetchQuery(
			queryOptions<ApiResponse<GetBooksResponse>>({
				queryKey: booksQueryKey(page + 1, limit, title),
				queryFn: () => bookRepo.list({ page: page + 1, limit, title }),
				staleTime: 30_000,
			}),
		);
		if (page > 1) {
			void qc.prefetchQuery(
				queryOptions<ApiResponse<GetBooksResponse>>({
					queryKey: booksQueryKey(page - 1, limit, title),
					queryFn: () => bookRepo.list({ page: page - 1, limit, title }),
					staleTime: 30_000,
				}),
			);
		}
	};
}
