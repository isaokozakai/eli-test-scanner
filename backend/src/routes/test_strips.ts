import { Router } from "express";
import multer from "multer";
import fs from "fs";
import { processTestStripImage } from "../services/image_processor";
import { UPLOAD_DIR } from "../constants/paths";
import { getTestStrip, getTestStrips } from "../database";

const router = Router();

// ensure uploads folder exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// setup multer for file uploads
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
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
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const result = await processTestStripImage(file.path);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// get submissions list endpoint
router.get("/", async (req, res) => {
  try {
    const rows = await getTestStrips();
    res.json(rows);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// get submission detail endpoint
router.get("/:id", async (req, res) => {
  try {
    const rows = await getTestStrip(req.params.id);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }
    res.json(rows[0]);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export { router as testStripsRouter };
