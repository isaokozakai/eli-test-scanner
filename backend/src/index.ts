import express from "express";
import dotenv from "dotenv";
import { testStripsRouter } from "./routes/test_strips";
import { UPLOAD_DIR } from "./constants/paths";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// JSON body parsing
app.use(express.json());

// serve static files (thumbnails, uploaded images)
app.use("/uploads", express.static(UPLOAD_DIR));

// API routes
app.use("/api/test-strips", testStripsRouter);

// health check
app.get("/", (_, res) => {
  res.send("Eli backend is running");
});

app.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`);
});
