import "server-only";
import sharp from "sharp";

/** Re-encodes an upload so only a real image is stored. This also removes location and camera data. */
export async function processImage(file: File) {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Use a JPEG, PNG or WebP image.");
  if (file.size > 4 * 1024 * 1024) throw new Error("This image is still too large. Choose a smaller one.");
  const input = Buffer.from(await file.arrayBuffer());
  try {
    const image = sharp(input, { limitInputPixels: 40_000_000 });
    const { format } = await image.metadata();
    if (!["jpeg", "png", "webp"].includes(format ?? "")) throw new Error("format");
    return await image.rotate().resize({ width: 1920, height: 1920, fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
  } catch {
    throw new Error("That file is not a readable JPEG, PNG or WebP image.");
  }
}
