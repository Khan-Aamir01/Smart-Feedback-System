// server.js
import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// URL of your FastAPI analyze endpoint
const FASTAPI_ANALYZE_URL = "http://127.0.0.1:8000/analyze";

// Node.js endpoint to forward text to FastAPI
export async function analyseSentiment({ text }) {
  try{
    // Forward the text to FastAPI
    const response = await axios.post(FASTAPI_ANALYZE_URL, { text });
    console.log(response.data);
    return response.data;
  }catch (err) {
    console.error("Speech service error:", err.message);
    throw new Error("Speech service transcription failed");
  }
}



