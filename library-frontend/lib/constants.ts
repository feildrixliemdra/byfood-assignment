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

// Create a mapping for quick lookups from category key to display name
const CATEGORY_MAP = new Map(
	BOOK_CATEGORIES.map(category => [category.value, category.label])
);

/**
 * Maps a category key from the API to its user-friendly display name
 * @param categoryKey - The category key from the API (e.g., "programming")
 * @returns The formatted display name (e.g., "Programming")
 */
export function formatCategoryName(categoryKey: string): string {
	return CATEGORY_MAP.get(categoryKey) || categoryKey
		.split('-')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}
