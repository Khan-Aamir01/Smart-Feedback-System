import { useState, useRef } from "react";

function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState("");
  const [audioBlob, setAudioBlob] = useState(null); // store recorded blob
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        chunksRef.current = [];
        setAudioBlob(blob); // store blob
        setAudioURL(URL.createObjectURL(blob)); // preview
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const uploadRecording = async () => {
    if (!audioBlob) return alert("No recording to upload!");

    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    try {
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("Uploaded:", data);
      alert("Audio uploaded successfully!");
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">🎤 Audio Recorder</h2>

        {!isRecording ? (
          <button
            onClick={startRecording}
            className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
          >
            Start Recording
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
          >
            Stop Recording
          </button>
        )}

        {audioURL && (
          <div className="mt-6 bg-gray-50 p-4 rounded-lg shadow-inner">
            <p className="font-semibold text-gray-700 mb-2">Preview Recording:</p>
            <audio controls src={audioURL} className="w-full rounded-lg"></audio>

            {/* Upload Button */}
            <button
              onClick={uploadRecording}
              className="mt-4 w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
            >
              Upload Recording
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AudioRecorder;

