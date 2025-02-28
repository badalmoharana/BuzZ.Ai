from fastapi import FastAPI
from pydantic import BaseModel
import requests
import os
import wikipedia
import wikipediaapi

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = "your_gemini_api_key"
YOUTUBE_API_KEY = "your_youtube_api_key"

class QueryRequest(BaseModel):
    query: str

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCTBs1883JzJ-NOsApuAoVz_uP0I-d_nN8")

async def get_gemini_response(data: QueryRequest):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    payload = {"contents": [{"parts": [{"text": data.query}]}]}
    # Make the API request
    response = requests.post(url, json=payload)
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Error from Gemini API")
    return response.json()

@app.get("/api/wikipedia")
async def get_wikipedia_summary(query: str):
    try:
        summary = wikipedia.summary(query, sentences=2)
        return {"query": query, "summary": summary}
    except wikipedia.exceptions.PageError:
        raise HTTPException(status_code=404, detail="Page not found")
    except wikipedia.exceptions.DisambiguationError as e:
        raise HTTPException(status_code=400, detail=f"Multiple results found: {e.options}")

@app.get("/api/youtube")
async def get_youtube_videos(query: str):
    YOUTUBE_API_KEY = "AIzaSyBZsoY-0wFZAMefZTZTCT8jYc1WEmoYmIQ"

    youtube_url = f"https://www.googleapis.com/youtube/v3/search?part=snippet&q={query}&key={YOUTUBE_API_KEY}&maxResults=6"
    response = requests.get(youtube_url)
    return response.json()["items"]

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000)
