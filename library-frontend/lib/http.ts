const baseUrl = process.env.NEXT_PUBLIC_LIBRARY_API_HOST;

if (!baseUrl) {
	throw new Error("Missing environment variable: LIBRARY_API_HOST");
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
	const url = `${baseUrl}${path}`;

	const response = await fetch(url, {
		headers: {
			"Content-Type": "application/json",
			...(init?.headers ?? {}),
		},
		...init,
	});

	const isJson = response.headers
		.get("content-type")
		?.includes("application/json");
	if (!response.ok) {
		let errorMessage = `HTTP ${response.status} ${response.statusText}`;
		try {
			if (isJson) {
				const body = (await response.json()) as unknown as { message?: string };
				if (
					body &&
					typeof body === "object" &&
					"message" in body &&
					body.message
				) {
					errorMessage = body.message as string;
				}
			} else {
				const text = await response.text();
				if (text) errorMessage = text;
			}
		} catch {
			// ignore parse errors and fall back to default message
		}
		throw new Error(errorMessage);
	}

	// Some endpoints may return empty body (e.g., 200 with no JSON)
	if (!isJson) {
		// @ts-expect-error allow void
		return undefined;
	}

	return (await response.json()) as T;
}

export const http = {
	get: <T>(path: string) => requestJson<T>(path, { method: "GET" }),
	post: <T>(path: string, body?: unknown) =>
		requestJson<T>(path, {
			method: "POST",
			body: body ? JSON.stringify(body) : undefined,
		}),
	put: <T>(path: string, body?: unknown) =>
		requestJson<T>(path, {
			method: "PUT",
			body: body ? JSON.stringify(body) : undefined,
		}),
	delete: <T>(path: string) => requestJson<T>(path, { method: "DELETE" }),
};

export type ApiResponse<TData = unknown> = {
	success: boolean;
	message: string;
	data?: TData;
	error?: unknown;
	errors?: Array<{ field: string; message: string }>;
};
