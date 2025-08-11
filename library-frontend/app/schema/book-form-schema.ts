import { z } from "zod";
import { BOOK_CATEGORIES } from "@/lib/constants";

export const bookFormSchema = z.object({
	title: z
		.string()
		.min(3, "Title is required, min 3 characters")
		.max(150, "Title is too long, max 150 characters"),
	author: z
		.string()
		.min(3, "Author is required, min 3 characters")
		.max(150, "Author name is too long, max 150 characters"),
	publisher: z
		.string()
		.min(3, "Publisher is required, min 3 characters")
		.max(150, "Publisher name is too long, max 150 characters"),
	isbn: z
		.string()
		.min(10, "ISBN must be at least 10 characters")
		.max(17, "ISBN cannot exceed 17 characters")
		.regex(/^[0-9\-X]+$/, "ISBN can only contain numbers, dashes, and X"),
	year_of_publication: z
		.string()
		.min(4, "Year must be 4 digits")
		.max(4, "Year must be 4 digits")
		.regex(/^\d{4}$/, "Year must be a valid 4-digit number")
		.refine((val) => {
			const year = parseInt(val);
			return year >= 1800 && year <= 2050;
		}, "Year must be between 1800 and 2050"),
	category: z
		.string()
		.min(1, "Category is required")
		.refine((val) => BOOK_CATEGORIES.some((cat) => cat.value === val), {
			message: "Please select a valid category",
		}),
	image_url: z
		.string()
		.url("Please enter a valid URL")
		.optional()
		.or(z.literal("")),
	image_file: z.instanceof(File).optional(),
});

export const editBookSchema = z.object({
	title: z
		.string()
		.min(3, "Title is required, min 3 characters")
		.max(150, "Title is too long, max 150 characters"),
	author: z
		.string()
		.min(3, "Author is required, min 3 characters")
		.max(150, "Author name is too long, max 150 characters"),
	publisher: z
		.string()
		.min(3, "Publisher is required, min 3 characters")
		.max(150, "Publisher name is too long, max 150 characters"),
	isbn: z
		.string()
		.min(10, "ISBN must be at least 10 characters")
		.max(17, "ISBN cannot exceed 17 characters")
		.regex(/^[0-9\-X]+$/, "ISBN can only contain numbers, dashes, and X"),
	year_of_publication: z
		.string()
		.min(4, "Year must be 4 digits")
		.max(4, "Year must be 4 digits")
		.regex(/^\d{4}$/, "Year must be a valid 4-digit number")
		.refine((val) => {
			const year = parseInt(val);
			return year >= 1800 && year <= 2050;
		}, "Year must be between 1800 and 2050"),
	category: z
		.string()
		.min(1, "Category is required")
		.refine((val) => BOOK_CATEGORIES.some((cat) => cat.value === val), {
			message: "Please select a valid category",
		}),
	image_url: z
		.string()
		.url("Please enter a valid URL")
		.optional()
		.or(z.literal("")),
	image_file: z.instanceof(File).optional(),
});
export type BookFormData = z.infer<typeof bookFormSchema>;
export type EditBookFormData = z.infer<typeof editBookSchema>;
