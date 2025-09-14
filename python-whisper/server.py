from fastapi import FastAPI, UploadFile
import uvicorn
import whisper
import os
import torch

app = FastAPI()

device = "cuda" if torch.cuda.is_available() else "cpu"
model = whisper.load_model("medium", device=device)

@app.post("/transcribe")
async def transcribe(file: UploadFile):
    audio_path = f"temp_{file.filename}"
    with open(audio_path, "wb") as f:
        f.write(await file.read())

    # Run both tasks
    transcription = model.transcribe(audio_path, task="transcribe")  # original language
    translation = model.transcribe(audio_path, task="translate")     # english

    os.remove(audio_path)

    return {
        "original": transcription["text"],
        "translated": translation["text"]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

