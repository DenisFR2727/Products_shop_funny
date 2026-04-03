import { v2 as cloudinary } from "cloudinary";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function ensureConfigured() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key = process.env.CLOUDINARY_API_KEY;
  const api_secret = process.env.CLOUDINARY_API_SECRET;
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }
  cloudinary.config({ cloud_name, api_key, api_secret });
}

export async function uploadAvatarToCloudinary(
  buffer: Buffer,
  mimeType: string,
): Promise<string> {
  ensureConfigured();

  if (!ALLOWED.has(mimeType)) {
    throw new Error("Invalid image type. Use JPEG, PNG, WebP, or GIF.");
  }
  if (buffer.length > MAX_BYTES) {
    throw new Error("Image must be 2 MB or smaller.");
  }

  const folder =
    process.env.CLOUDINARY_AVATAR_FOLDER ?? "products_shop/avatars";
  const dataUri = `data:${mimeType};base64,${buffer.toString("base64")}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
    transformation: [{ width: 512, height: 512, crop: "limit" }],
  });

  if (!result?.secure_url) {
    throw new Error("Upload failed: no URL returned.");
  }

  return result.secure_url;
}
