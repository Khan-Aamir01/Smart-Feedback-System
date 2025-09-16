import React, { useState, useRef } from "react";
import { useTheme } from "../context/ThemeContext"; // adjust the path

export default function FeedbackRecorder() {
  const { dark } = useTheme();
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [language, setLanguage] = useState("hi");
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

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

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const deleteRecording = () => {
    setAudioURL(null);
    chunksRef.current = [];
  };

  const uploadFeedback = async () => {
    if (!audioURL) return;

    const blob = new Blob(chunksRef.current, { type: "audio/wav" });
    const formData = new FormData();
    formData.append("audio", blob, "feedback.wav");
    formData.append("language", language);

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("✅ Feedback saved:", data);
      alert("Feedback submitted successfully!");

      setAudioURL(null);
      chunksRef.current = [];
    } catch (err) {
      console.error("❌ Upload error:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 ${
        dark
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200"
          : "bg-gradient-to-br from-indigo-50 via-white to-blue-100 text-gray-900"
      }`}
    >
      <div
        className={`shadow-2xl rounded-3xl p-8 w-full max-w-md transition-all ${
          dark ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
        }`}
      >
        <h1
          className={`text-3xl font-extrabold text-center mb-3 ${
            dark ? "text-blue-400" : "text-blue-700"
          }`}
        >
          🎤 Smart Feedback
        </h1>
        <p className={`text-center mb-6 text-sm ${dark ? "text-gray-300" : "text-gray-600"}`}>
          Record audio feedback, auto-translate, and analyze sentiment.
        </p>

        <label className={`block mb-2 font-medium ${dark ? "text-gray-200" : "text-gray-700"}`}>
          Select Language
        </label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className={`w-full p-2 mb-6 border rounded-lg focus:ring-2 focus:ring-blue-400 transition ${
            dark
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white text-gray-900 border-gray-300"
          }`}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="mr">Marathi</option>
        </select>

        <div className="flex flex-col items-center space-y-4">
          {!recording ? (
            <button
              onClick={startRecording}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full shadow-md transform hover:scale-105 transition-all"
            >
              🎙 Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full shadow-md transform hover:scale-105 transition-all"
            >
              ⏹ Stop Recording
            </button>
          )}
        </div>

        {audioURL && (
          <div className="mt-6 space-y-4 text-center">
            <audio controls src={audioURL} className="w-full rounded-lg shadow"></audio>
            <div className="flex justify-center space-x-3">
              <button
                onClick={deleteRecording}
                className={`px-4 py-2 rounded-lg text-white transition ${
                  dark ? "bg-gray-600 hover:bg-gray-500" : "bg-gray-400 hover:bg-gray-500"
                }`}
              >
                🗑 Delete
              </button>

              <button
                onClick={uploadFeedback}
                disabled={loading}
                className={`px-4 py-2 rounded-lg flex items-center justify-center space-x-2 shadow-md transform hover:scale-105 transition-all text-white ${
                  loading
                    ? "bg-blue-400 cursor-not-allowed"
                    : dark
                    ? "bg-blue-700 hover:bg-blue-600"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                      ></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>➕ Add Feedback</span>
                )}
              </button>
            </div>
          </div>
        )}

        <img
          src="https://cdn-icons-png.flaticon.com/512/2922/2922506.png"
          alt="Feedback"
          className="mt-8 w-32 mx-auto opacity-80 hover:opacity-100 transition-all"
        />
      </div>
    </div>
  );
}

