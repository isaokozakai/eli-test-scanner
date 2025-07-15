import fs from "fs/promises";
import sharp from "sharp";
import sizeOf from "image-size";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { Pool } from "pg";
import jsQR from "jsqr";
import { UPLOAD_DIR } from "../constants/paths";

// setup DB connection (make sure DATABASE_URL is set in env)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function processTestStripImage(filePath: string) {
  const id = uuidv4();
  const originalImagePath = filePath;
  const thumbnailPath = path.join(
    UPLOAD_DIR,
    `thumb-${path.basename(filePath)}`
  );

  // read image buffer
  const imageBuffer = await fs.readFile(filePath);

  // create thumbnail (200x200)
  await sharp(imageBuffer).resize(200, 200).toFile(thumbnailPath);

  // get image dimensions using image-size
  const dimensions = sizeOf(imageBuffer);
  const imageSizeStr = `${dimensions.width}x${dimensions.height}`;

  // convert to raw pixels with alpha channel for QR detection
  const sharpImg = sharp(imageBuffer);
  const raw = await sharpImg
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  let qrCode: string | null = null;
  let status = "invalid";
  let errorMessage: string | null = null;

  try {
    const qr = jsQR(
      new Uint8ClampedArray(raw.data),
      raw.info.width,
      raw.info.height
    );
    if (qr?.data) {
      qrCode = qr.data;

      if (qrCode === "ELI-2024-999") {
        status = "expired";
        errorMessage = "Test strip expired";
      } else if (qrCode.startsWith("ELI-2025")) {
        status = "valid";
      } else {
        status = "invalid";
        errorMessage = "Unknown QR code format";
      }
    } else {
      errorMessage = "QR code not found";
    }
  } catch (err: any) {
    errorMessage = "QR code processing error: " + err.message;
  }

  // save to DB
  await pool.query(
    `INSERT INTO test_strip_submissions 
      (id, qr_code, original_image_path, thumbnail_path, image_size, image_dimensions, status, error_message)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      id,
      qrCode,
      originalImagePath,
      thumbnailPath,
      imageBuffer.length,
      imageSizeStr,
      status,
      errorMessage,
    ]
  );

  return {
    id,
    status,
    qrCode,
    quality: "n/a",
    processedAt: new Date().toISOString(),
  };
}
