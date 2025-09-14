// FeedbackRecorder.jsx
import React, { useState, useRef } from "react";

export default function FeedbackRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [language, setLanguage] = useState("hi");
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  // 🎙 Start Recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("🎙 Microphone access error:", err);
      alert("Please allow microphone access!");
    }
  };

  // ⏹ Stop Recording
  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  // 🗑 Delete Recording
  const deleteRecording = () => {
    setAudioURL(null);
    chunksRef.current = [];
  };

  // ➕ Upload Feedback
  const uploadFeedback = async () => {
    if (!audioURL) return;

    const blob = new Blob(chunksRef.current, { type: "audio/wav" });
    const formData = new FormData();
    formData.append("audio", blob, "feedback.wav");
    formData.append("language", language);

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("✅ Feedback saved:", data);
      alert("Feedback submitted successfully!");
    } catch (err) {
      console.error("❌ Upload error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center px-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-4">
          🎤 Smart Feedback System
        </h1>
        <p className="text-gray-600 text-center mb-6">
          We take feedback through audio, convert it into text, and do sentiment
          analysis to provide insights for businesses.
        </p>

        {/* Language Selector */}
        <label className="block mb-2 text-gray-700 font-medium">
          Select Language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-2 mb-6 border rounded-lg"
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="mr">Marathi</option>
        </select>

        {/* Recording Controls */}
        <div className="flex flex-col items-center space-y-4">
          {!recording ? (
            <button
              onClick={startRecording}
              className="bg-green-500 text-white px-6 py-3 rounded-full shadow hover:bg-green-600"
            >
              🎙 Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-500 text-white px-6 py-3 rounded-full shadow hover:bg-red-600"
            >
              ⏹ Stop Recording
            </button>
          )}
        </div>

        {/* Preview & Actions */}
        {audioURL && (
          <div className="mt-6 space-y-4 text-center">
            <audio controls src={audioURL} className="w-full"></audio>
            <div className="flex justify-center space-x-4">
              <button
                onClick={deleteRecording}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                🗑 Delete
              </button>
              <button
                onClick={uploadFeedback}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                ➕ Add Feedback
              </button>
            </div>
          </div>
        )}

        {/* Illustration */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/2922/2922506.png"
          alt="Feedback"
          className="mt-8 w-40 mx-auto opacity-90"
        />
      </div>
    </div>
  );
}
