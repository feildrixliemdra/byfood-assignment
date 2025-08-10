import { getUploadAuthParams } from "@imagekit/next/server";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
	try {
		const { token, expire, signature } = getUploadAuthParams({
			privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
			publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY as string,
		});

		return NextResponse.json({
			token,
			expire,
			signature,
		});
	} catch (error) {
		console.error("ImageKit auth error:", error);
		return NextResponse.json(
			{ error: "Failed to generate authentication parameters" },
			{ status: 500 },
		);
	}
}
