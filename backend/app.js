// server.js (your backend)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { supabase } from "./supabaseClient.js";

// Import both services
import { transcribeWithGoogle } from "./googleService.js";
import { transcribeWithWhisper } from "./whisperService.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const AI_PROVIDER = process.env.AI_PROVIDER || "google"; // choose service

app.use(cors());
app.use(express.json());

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

app.post("/upload", upload.single("audio"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No audio received" });
  const {language} = req.body;

  //console.log("📥 Audio received:", req.file.originalname, req.file.size, "bytes");
  //console.log("📥 Saved at:", req.file.path);

  try {
    // 1️⃣ Call the selected AI service
    let transcription;
    if (AI_PROVIDER === "google") {
      transcription = await transcribeWithGoogle(req.file.path,language);
      console.log(transcription);
    } else {
      transcription = await transcribeWithWhisper(req.file.path);
    }

    // 2️⃣ Save everything in Supabase
    const { data, error } = await supabase
      .from("audio-metadata")
      .insert([
        {
          //filename: req.file.originalname,
          audio_path: req.file.filename,
          //size: req.file.size,
          duration: transcription.duration,
          language: language,
          original_text: transcription.original || "Failed",
          translated_text: transcription.translated || "Failed",
          model: AI_PROVIDER,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ message: "Failed to save metadata", error });
    }

    res.json({
      message: "Audio uploaded, transcribed, and metadata saved ✅",
      transcription,
      metadata: data,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
