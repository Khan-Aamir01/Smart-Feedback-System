from fastapi import FastAPI, UploadFile
import uvicorn
import whisper
import os
import torch

app = FastAPI()

device = "cuda" if torch.cuda.is_available() else "cpu"
# Load model (use "tiny", "base", "small", "medium", or "large")
model = whisper.load_model("medium")

@app.post("/transcribe")
async def transcribe(file: UploadFile):
    audio_path = f"temp_{file.filename}"
    with open(audio_path, "wb") as f:
        f.write(await file.read())

    result = model.transcribe(audio_path, task="translate")  # "translate","transcribe" → English 
    os.remove(audio_path)

    return {"text": result["text"]}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
