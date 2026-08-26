# This file creates a Groq AI client by calling Groq's OpenAI-compatible HTTP completions endpoint.
# It uses the standard requests library to avoid external SDK dependencies.

from pathlib import Path
import os
import requests
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path, override=True)

class GroqClient:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY")
        self.model = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")
        self.api_url = "https://api.groq.com/openai/v1/chat/completions"

    def generate(self, prompt):
        if not self.api_key:
            raise ValueError("GROQ_API_KEY environment variable is not set.")

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

        payload = {
            "model": self.model,
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.2
        }

        response = requests.post(self.api_url, headers=headers, json=payload)

        if response.status_code != 200:
            raise Exception(f"Groq API Error | Status Code {response.status_code} | Details: {response.text}")

        result = response.json()
        
        try:
            return result["choices"][0]["message"]["content"]
        except (KeyError, IndexError):
            raise Exception(f"Failed to parse response from Groq API. Response: {result}")
