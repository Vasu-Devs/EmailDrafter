from fastapi import FastAPI
import requests
import os
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class EmailDraftRequest(BaseModel):
    note: str
    tone:str
    recipient: str

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials =True,
    allow_methods=["*"],
    allow_headers=["*"],
)



OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
DEEPSEEK_API_URL = "https://openrouter.ai/api/v1/chat/completions"

@app.get("/")
def read_root():
    return {"message": "🚀 FastAPI is working!"}

@app.post("/email-draft")
def emaildrafter(text: EmailDraftRequest):

   
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json"
    }

    json_prompt = f"""
   you are a helpful assistant who drafts emails in {text.tone} tone , which are being recieved by {text.recipient} out of the given note  . the note is {text.note}. You are only supposed to written the email no greetings no nothing , just plane pure email based on the given parameters
    """

    payload = {
        "model": "deepseek/deepseek-chat-v3.1:free",
        "messages": [{"role": "user", "content": json_prompt}],
        "temperature": 0.7
    }

    response = requests.post(DEEPSEEK_API_URL, json=payload, headers=headers)

    if response.status_code == 200:
        try:
            content = response.json()["choices"][0]["message"]["content"]
            return {"reponse":content}
        except Exception as e:
            return {"error": f"Failed to parse JSON: {str(e)}", "raw": content}
    else:
        return {"error": f"API error {response.status_code}", "raw": response.text}
