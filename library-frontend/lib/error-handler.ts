import { toast } from "sonner";

export interface ValidationError {
	field: string;
	message: string;
}

export interface ApiErrorResponse {
	success: false;
	message: string;
	errors?: ValidationError[];
}

export interface ErrorInfo {
	title: string;
	description: string;
	type: "validation" | "not-found" | "server-error" | "bad-request" | "network";
	validationErrors?: ValidationError[];
}

/**
 * Extract user-friendly message from API error response
 */
function extractUserMessage(
	errorData: ApiErrorResponse | null,
	status: number,
): string {
	// Prioritize the message from the API response
	if (errorData?.message) {
		return errorData.message;
	}

	// Fallback messages based on status code
	switch (status) {
		case 400:
			return "The request contains invalid data. Please check your input and try again.";
		case 404:
			return "The requested resource was not found.";
		case 422:
			return "Please check the form for validation errors.";
		case 500:
			return "An internal server error occurred. Please try again later.";
		default:
			return "Something went wrong. Please try again.";
	}
}

export function parseApiError(error: unknown): ErrorInfo {
	// Network or fetch errors
	if (error instanceof TypeError && error.message.includes("fetch")) {
		return {
			title: "Connection Error",
			description:
				"Unable to connect to the server. Please check your internet connection and try again.",
			type: "network",
		};
	}

	// API error responses
	if (error instanceof Error) {
		let errorData: ApiErrorResponse | null = null;

		// Try to parse error message as JSON (from our http client)
		try {
			// The error message contains status and response body
			// Format: "HTTP 500 Internal Server Error {json}"
			const httpMatch = error.message.match(/HTTP (\d+)/);
			const jsonMatch = error.message.match(/(\{.*\})/);

			if (httpMatch && jsonMatch) {
				const status = parseInt(httpMatch[1]);
				const jsonBody = jsonMatch[1];

				// Parse the JSON error response
				try {
					errorData = JSON.parse(jsonBody) as ApiErrorResponse;
				} catch {
					// Silently fail JSON parsing
				}

				switch (status) {
					case 422: // Validation errors
						return {
							title: "Validation Error",
							description: extractUserMessage(errorData, status),
							type: "validation",
							validationErrors: errorData?.errors || [],
						};

					case 400: // Bad request
						return {
							title: "Invalid Input",
							description: extractUserMessage(errorData, status),
							type: "bad-request",
						};

					case 404: // Not found
						return {
							title: "Not Found",
							description: extractUserMessage(errorData, status),
							type: "not-found",
						};

					case 500: // Internal server error
						return {
							title: "Server Error",
							description:
								"Something went wrong on our end. Please try again later.",
							type: "server-error",
						};

					default:
						return {
							title: "Request Failed",
							description: extractUserMessage(errorData, status),
							type: "bad-request",
						};
				}
			}
		} catch {
			// Silently fail error parsing
		}

		// Generic error handling for unparseable errors
		// Don't show raw error messages to users - they might contain technical details
		return {
			title: "Something went wrong",
			description: "An unexpected error occurred. Please try again.",
			type: "server-error",
		};
	}

	// Unknown error type
	return {
		title: "Unexpected Error",
		description: "An unexpected error occurred. Please try again.",
		type: "server-error",
	};
}

export function showErrorToast(error: unknown, action?: string): ErrorInfo {
	const errorInfo = parseApiError(error);

	let title = errorInfo.title;
	if (action) {
		title = `Failed to ${action}`;
	}

	if (errorInfo.type === "validation" && errorInfo.validationErrors?.length) {
		// Format validation errors in a user-friendly way with better readability
		const fieldErrors = errorInfo.validationErrors
			.map((err) => {
				// Capitalize field name and format it nicely
				const fieldName = err.field
					.split("_")
					.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
					.join(" ");
				return `${fieldName}: ${err.message}`;
			})
			.join("\n\n"); // Double line break for better spacing

		toast.error(title, {
			description: fieldErrors,
			duration: 8000, // Show validation errors longer for readability
			style: {
				whiteSpace: "pre-line", // Preserve line breaks
				lineHeight: "1.5", // Better line spacing
			},
			descriptionClassName:
				"!text-red-800 dark:!text-red-200 !font-medium !important",
		});
	} else {
		toast.error(title, {
			description: errorInfo.description,
			duration: 5000,
		});
	}

	return errorInfo;
}

export function showWarningToast(message: string, description?: string): void {
	toast.warning(message, {
		description: description,
		duration: 4000,
	});
}

export function getFieldError(
	validationErrors: ValidationError[],
	fieldName: string,
): string | null {
	const error = validationErrors.find((err) => err.field === fieldName);
	return error?.message || null;
}
