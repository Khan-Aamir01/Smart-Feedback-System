// whisperService.js
import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const WHISPER_API = process.env.WHISPER_API || "http://localhost:8000/transcribe";

export async function transcribeWithWhisper(filePath) {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));

    const res = await axios.post(WHISPER_API, formData, {
      headers: formData.getHeaders(),
      maxBodyLength: Infinity, // handle large files
    });

    // Backend now returns { original: "...", translated: "..." }
    const { original, translated, error } = res.data;

    if (error) {
      throw new Error(error);
    }

    return {
      original: original || null,
      translated: translated || null,
    };
  } catch (err) {
    console.error("Whisper transcription error:", err.message);
    throw new Error("Whisper transcription failed");
  }
}

