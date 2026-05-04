from fastapi import FastAPI
import joblib

app = FastAPI()

model = joblib.load("phishing_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

def normalize(url):
    url = url.lower()
    if not url.endswith("/"):
        url += "/"
    return url

@app.post("/predict")
def predict(url: str):
    url = normalize(url)
    X = vectorizer.transform([url])
    prob = model.predict_proba(X)[0][1]

    return {
        "probability": float(prob),
        "is_phishing":bool(prob > 0.7) 
    }