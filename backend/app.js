// app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { supabase } from "./supabaseClient.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Make sure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

app.post("/upload", upload.single("audio"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No audio received" });

  console.log("📥 Audio received:", req.file.originalname, req.file.size, "bytes");
  console.log("📥 Saved at:", req.file.path);

  try {
    // Save metadata to Supabase
    const { data, error } = await supabase
      .from("audio-metadata")
      .insert([
        {
          filename: req.file.originalname,
          size: req.file.size,
        },
      ]);

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ message: "Failed to save metadata", error });
    }

    res.json({ message: "Audio uploaded and metadata saved", file: req.file, metadata: data });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));


