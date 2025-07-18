import { Pool } from "pg";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

type TestStrip = {
  id: string;
  qrCode: string | null;
  originalImagePath: string;
  thumbnailPath: string;
  imageBufferLength: number;
  imageSizeStr: string;
  status: string;
  errorMessage: string | null;
};

export async function saveTestStrip({
  id,
  qrCode,
  originalImagePath,
  thumbnailPath,
  imageBufferLength,
  imageSizeStr,
  status,
  errorMessage,
}: TestStrip) {
  await pool.query(
    `INSERT INTO test_strip_submissions 
      (id, qr_code, original_image_path, thumbnail_path, image_size, image_dimensions, status, error_message)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      id,
      qrCode,
      originalImagePath,
      thumbnailPath,
      imageBufferLength,
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

export async function getTestStrips() {
  const result = await pool.query(
    "SELECT id, qr_code, status, thumbnail_path, created_at FROM test_strip_submissions ORDER BY created_at DESC"
  );

  return result.rows;
}

export async function getTestStrip(id: string) {
  const result = await pool.query(
    "SELECT * FROM test_strip_submissions WHERE id = $1",
    [id]
  );

  return result.rows;
}
