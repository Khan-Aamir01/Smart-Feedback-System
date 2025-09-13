from fastapi import FastAPI, File, UploadFile, Form
import uvicorn
from speech_service import process_audio
import tempfile
from pydub import AudioSegment
import os

app = FastAPI()


SUPPORTED_FORMATS = [".wav", ".flac"]  # Formats that your backend can process


@app.post("/speech-to-text/")
async def speech_to_text(file: UploadFile = File(...), language: str = Form(...)):
    """
    API to convert speech to text.
    Params:
        file: audio file (.wav, .flac, .mp3, etc.)
        language: 'en', 'hi', or 'mr'
    """
    try:
        ext = os.path.splitext(file.filename)[1].lower()
        print(ext)

        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # If format not supported, convert to WAV
        if ext not in SUPPORTED_FORMATS:
            wav_tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")
            wav_tmp_path = wav_tmp.name
            wav_tmp.close()

            # Let pydub detect format automatically
            audio = AudioSegment.from_file(tmp_path)
            audio.export(wav_tmp_path, format="wav")

            os.remove(tmp_path)  # Remove original file
            tmp_path = wav_tmp_path

        # Process audio
        result = process_audio(tmp_path, language)

        # Clean up temp file
        os.remove(tmp_path)

        return result

    except Exception as e:
        return {"error": str(e)}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

