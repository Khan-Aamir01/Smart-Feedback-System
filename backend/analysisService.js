// server.js
import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// URL of your FastAPI analyze endpoint
const FASTAPI_ANALYZE_URL = "http://127.0.0.1:8000/analyze";

// Node.js endpoint to forward text to FastAPI
app.post("/send-to-analyze", async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Text is required" });
  }

  try {
    // Forward the text to FastAPI
    const response = await axios.post(FASTAPI_ANALYZE_URL, { text });

    // Send back the FastAPI response to the client
    return res.json(response.data);
  } catch (error) {
    console.error("Error calling FastAPI:", error.message);
    return res.status(500).json({ message: "Analysis failed", error: error.message });
  }
});

// Start the Node.js server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Node.js Analysis API running on http://localhost:${PORT}`);
});

