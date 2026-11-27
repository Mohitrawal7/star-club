const MAX_ORIGINAL = 5 * 1024 * 1024;

/** Shrinks a picture in the browser before upload. Redrawing it also drops location data. */
export async function shrinkImage(file: File): Promise<File> {
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error(`${file.name}: use a JPEG, PNG or WebP image.`);
  if (file.size > MAX_ORIGINAL) throw new Error(`${file.name}: choose an image of 5 MB or less.`);
  const bitmap = await createImageBitmap(file).catch(() => { throw new Error(`${file.name}: this image could not be read.`); });
  const scale = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((done) => canvas.toBlob(done, "image/webp", 0.85));
  if (!blob) throw new Error(`${file.name}: this image could not be prepared.`);
  return new File([blob], "upload", { type: blob.type });
}
