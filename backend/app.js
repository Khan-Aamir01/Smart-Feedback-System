// server.js (your backend)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import fs from "fs";
import axios from "axios";
import { fileURLToPath } from "url";
import { supabase } from "./supabaseClient.js";

// Import both services
import { transcribeWithGoogle } from "./googleService.js";
import { transcribeWithWhisper } from "./whisperService.js";

import {analyseSentiment} from "./analysisService.js";

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
  const { language } = req.body;

  try {
    // 1️⃣ Call the selected AI service
    let transcription;
    if (AI_PROVIDER === "google") {
      transcription = await transcribeWithGoogle(req.file.path, language);
    } else {
      transcription = await transcribeWithWhisper(req.file.path);
    }
    //console.log('Translated Text : '+ transcription.translated);

    // 2️⃣ Save metadata in Supabase
    const { data: metaData, error: metaError } = await supabase
      .from("audio-metadata")
      .insert([
        {
          audio_path: req.file.filename,
          duration: transcription.duration,
          language: language,
          original_text: transcription.original || "Failed",
          translated_text: transcription.translated || "Failed",
          model: AI_PROVIDER,
        },
      ])
      .select();

    if (metaError) {
      console.error("Supabase insert error:", metaError);
      return res.status(500).json({ message: "Failed to save metadata", error: metaError });
    }

    const audioId = metaData[0].id;
    const textToAnalyze = transcription.translated;
    //console.log("The Text that is going for analysis :" + textToAnalyze);

    // 3️⃣ Send translated text to Analysis API
    const analysisResult = await analyseSentiment({ text: textToAnalyze });
    const rating = analysisResult?.overall_sentiment?.label;
    const confidence = analysisResult?.overall_sentiment?.score;
    // 4️⃣ Save analysis result in feedback-data table
    const { data: feedbackData, error: feedbackError } = await supabase
      .from("feedback-data")
      .insert([
        {
          audio_id: audioId,
          rating : rating,
          confidence : confidence,
        },
      ])
      .select();

    if (feedbackError) {
      console.error("Failed to save feedback-data:", feedbackError);
    }

    res.json({
      message: "Audio uploaded, transcribed, analyzed, and saved ✅",
      transcription,
      metadata: metaData,
      analysis: analysisResult,
      feedbackData: feedbackData || null,
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
