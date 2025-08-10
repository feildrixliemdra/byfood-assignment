import { upload, ImageKitInvalidRequestError } from "@imagekit/next";
import { useState } from "react";

interface UploadOptions {
	file: File;
	fileName?: string;
	folder?: string;
	tags?: string[];
}

interface UploadResult {
	url: string;
	fileId: string;
	name: string;
	size: number;
}

export function useImageKitUpload() {
	const [uploading, setUploading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [error, setError] = useState<string | null>(null);

	const uploadFile = async ({
		file,
		fileName,
		folder = "/book-covers",
		tags = ["book", "cover"],
	}: UploadOptions): Promise<UploadResult> => {
		setUploading(true);
		setUploadProgress(0);
		setError(null);

		try {
			// Get authentication parameters from our API route
			const authResponse = await fetch('/api/imagekit/auth');
			if (!authResponse.ok) {
				throw new Error("Failed to get authentication parameters");
			}

			const { token, signature, expire } = await authResponse.json();

			// Use the official ImageKit upload function
			const result = await upload({
				file,
				fileName: fileName || file.name,
				token,
				signature,
				expire,
				publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || "",
				folder,
				tags: tags.join(","),
				onProgress: (event) => {
					const percentCompleted = Math.round((event.loaded * 100) / event.total);
					setUploadProgress(percentCompleted);
				}
			});

			return {
				url: result.url || "",
				fileId: result.fileId || "",
				name: result.name || "",
				size: result.size || 0,
			};
		} catch (err) {
			let errorMessage = "Upload failed";
			
			if (err instanceof ImageKitInvalidRequestError) {
				errorMessage = `Invalid upload request: ${err.message}`;
			} else if (err instanceof Error) {
				errorMessage = err.message;
			}

			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setUploading(false);
			setUploadProgress(0);
		}
	};

	return { upload: uploadFile, uploading, uploadProgress, error };
}
