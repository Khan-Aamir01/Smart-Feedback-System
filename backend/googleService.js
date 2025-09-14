// speechService.js
import axios from "axios";
import fs from "fs";
import FormData from "form-data";

const SPEECH_API = process.env.SPEECH_API || "http://localhost:8000/speech-to-text/";

export async function transcribeWithGoogle(filePath, language) {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(filePath));
    formData.append("language", language); // 'en', 'hi', 'mr'

    const response = await axios.post(SPEECH_API, formData, {
      headers: formData.getHeaders(),
      maxBodyLength: Infinity,
    });

    return response.data; // { original, transliterated?, translated }
  } catch (err) {
    console.error("Speech service error:", err.message);
    throw new Error("Speech service transcription failed");
  }
}
