import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();

// root-level uploads path
const uploadDir = path.join(__dirname, "..", "..", "uploads");

// ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// setup multer for file uploads
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image uploads are allowed"));
    }
  },
});

// upload endpoint
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image provided." });
  }

  res.json({
    id: Date.now().toString(),
    fileName: req.file.filename,
    filePath: `/uploads/${req.file.filename}`,
    status: "pending",
  });
});

export { router as uploadRouter };
