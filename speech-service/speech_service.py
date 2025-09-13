import speech_recognition as sr
from googletrans import Translator
from indic_transliteration import sanscript
from indic_transliteration.sanscript import transliterate

translator = Translator()
r = sr.Recognizer()


def process_audio(audio_file, language: str):
    """
    Convert audio to text based on selected language.
    language can be: 'en', 'hi', 'mr'
    """
    with sr.AudioFile(audio_file) as source:
        r.adjust_for_ambient_noise(source)
        audio = r.record(source)

    try:
        # Speech recognition
        if language == "en":
            statement = r.recognize_google(audio, language="en-IN")
            return {"original": statement, "translated": statement}

        elif language == "hi":
            statement = r.recognize_google(audio, language="hi-IN")
            hindi_eng = transliterate(statement, sanscript.DEVANAGARI, sanscript.ITRANS)
            translated = translator.translate(statement, src="hi", dest="en").text
            return {"original": statement, "transliterated": hindi_eng, "translated": translated}

        elif language == "mr":
            statement = r.recognize_google(audio, language="mr-IN")
            marathi_eng = transliterate(statement, sanscript.DEVANAGARI, sanscript.ITRANS)
            translated = translator.translate(statement, src="mr", dest="en").text
            return {"original": statement, "transliterated": marathi_eng, "translated": translated}

        else:
            return {"error": "Unsupported language!"}

    except sr.UnknownValueError:
        return {"error": "Could not understand audio"}
    except sr.RequestError:
        return {"error": "Google Speech Recognition API error"}
