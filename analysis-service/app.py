from fastapi import FastAPI
from pydantic import BaseModel
from transformers import pipeline
import spacy
import re

app = FastAPI()

class FeedbackRequest(BaseModel):
    text: str

# Load sentiment pipeline
sentiment_pipeline = pipeline(
    "sentiment-analysis", 
    model="nlptown/bert-base-multilingual-uncased-sentiment"
)
nlp = spacy.load("en_core_web_sm")

def split_into_clauses(sentence: str):
    # Split sentence by common conjunctions and commas
    clauses = re.split(r'\band\b|\bbut\b|,', sentence, flags=re.IGNORECASE)
    return [c.strip() for c in clauses if c.strip()]

def get_sentiment_label(stars: int):
    return (
        "very bad" if stars == 1 else
        "bad" if stars == 2 else
        "okay" if stars == 3 else
        "good" if stars == 4 else
        "very good"
    )

def extract_key_phrases_with_clause_sentiment(text: str):
    doc = nlp(text)
    phrase_sentiments = {}
    stopwords = nlp.Defaults.stop_words

    for sent in doc.sents:
        clauses = split_into_clauses(sent.text)
        for clause in clauses:
            result = sentiment_pipeline(clause)[0]
            stars = int(result["label"].split()[0])
            sentiment = get_sentiment_label(stars)
            
            clause_doc = nlp(clause)
            for chunk in clause_doc.noun_chunks:
                # Take only the root noun for cleaner aspects
                phrase = chunk.root.text.lower().strip()
                if (phrase not in stopwords) and (len(phrase) > 2) and not phrase.isdigit():
                    phrase_sentiments[phrase] = sentiment

    return phrase_sentiments

@app.post("/analyze")
def analyze_feedback(request: FeedbackRequest):
    text = request.text
    overall_result = sentiment_pipeline(text)[0]
    stars = int(overall_result["label"].split()[0])
    # Convert score to percentage
    overall_result_percent = {
        "label": stars,
        "score": round(overall_result["score"] * 100, 2)  # e.g., 0.85 -> 85.0
    }

    aspects = extract_key_phrases_with_clause_sentiment(text)

    return {
        "input_text": text,
        "overall_sentiment": overall_result_percent,
        #"aspects_with_sentiment": aspects
    }

