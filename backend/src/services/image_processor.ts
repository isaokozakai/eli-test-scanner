import fs from "fs/promises";
import sharp from "sharp";
import sizeOf from "image-size";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { UPLOAD_DIR } from "../constants/paths";
import { extractQrCodeFromImageBuffer } from "../utils/qr";
import { saveTestStrip } from "../database";

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

  const { qrCode, status, errorMessage } = extractQrCodeFromImageBuffer(
    raw.data,
    raw.info.width,
    raw.info.height
  );

  return saveTestStrip({
    id,
    qrCode,
    originalImagePath,
    thumbnailPath,
    imageBufferLength: imageBuffer.length,
    imageSizeStr,
    status,
    errorMessage,
  });
}
