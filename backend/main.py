from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# Allow requests from frontend (adjust if needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend URL on prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/xtools/{username}")
def get_xtools_data(username: str):
    url = f"https://xtools.wmflabs.org/api/user/en.wikipedia/{username}"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        return {"error": "Failed to fetch data from XTools", "details": str(e)}
