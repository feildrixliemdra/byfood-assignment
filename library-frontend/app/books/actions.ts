"use server";

import { revalidateTag } from "next/cache";
import {
	bookRepo,
	type CreateBookRequest,
	type UpdateBookRequest,
} from "@/lib/repos/books";

export async function createBookAction(input: CreateBookRequest) {
	const res = await bookRepo.create(input);
	// bookRepo.create already revalidates tag, but keep explicit for clarity
	revalidateTag("books");
	return res;
}

export async function updateBookAction(
	id: string,
	input: Omit<UpdateBookRequest, "id">,
) {
	const res = await bookRepo.update(id, input);
	revalidateTag("books");
	return res;
}

export async function deleteBookAction(id: string) {
	const res = await bookRepo.remove(id);
	revalidateTag("books");
	return res;
}
