import express from "express";
import dotenv from "dotenv";
import path from "path";
import { uploadRouter } from "./routes/upload";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// JSON body parsing
app.use(express.json());

// serve static files (thumbnails, uploaded images)
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "..", "uploads"))
);

// API routes
app.use("/api/test-strips", uploadRouter);

// health check
app.get("/", (_, res) => {
  res.send("Eli backend is running");
});

app.listen(port, () => {
  console.log(`🚀 Server listening on http://localhost:${port}`);
});
