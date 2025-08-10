"use server";

import { revalidateTag } from "next/cache";
import {
	bookRepo,
	type CreateBookRequest,
	type UpdateBookRequest,
} from "@/lib/repos/books";

export async function createBookAction(input: CreateBookRequest) {
	try {
		const res = await bookRepo.create(input);
		// bookRepo.create already revalidates tag, but keep explicit for clarity
		revalidateTag("books");
		return res;
	} catch (error) {
		// Re-throw the error so it can be handled by the mutation
		// Re-throw to be handled by mutation
		throw error;
	}
}

export async function updateBookAction(
	id: string,
	input: Omit<UpdateBookRequest, "id">,
) {
	try {
		const res = await bookRepo.update(id, input);
		revalidateTag("books");
		return res;
	} catch (error) {
		// Re-throw to be handled by mutation
		throw error;
	}
}

export async function deleteBookAction(id: string) {
	try {
		const res = await bookRepo.remove(id);
		revalidateTag("books");
		return res;
	} catch (error) {
		// Re-throw to be handled by mutation
		throw error;
	}
}
