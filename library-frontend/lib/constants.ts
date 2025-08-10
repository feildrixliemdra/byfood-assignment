// Book category constants
export const BOOK_CATEGORIES = [
	{ label: "Romance", value: "romance" },
	{ label: "Horror", value: "horror" },
	{ label: "Programming", value: "programming" },
	{ label: "Mystery", value: "mystery" },
	{ label: "Novel", value: "novel" },
	{ label: "Fantasy", value: "fantasy" },
	{ label: "Science Fiction", value: "science-fiction" },
	{ label: "Other", value: "other" },
] as const;

export type BookCategory = (typeof BOOK_CATEGORIES)[number]["value"];
