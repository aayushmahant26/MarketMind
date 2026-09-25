# This file creates a Gemini AI client by configuring the Gemini API using the API key and loading the gemini-2.5-flash model.
# It provides a generate() method that sends a prompt to Gemini and returns the generated text response.

from pathlib import Path
import os
import google.generativeai as genai
from dotenv import load_dotenv

env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path, override=True)

class GeminiClient:

    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set.")
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel("gemini-2.5-flash")

    def generate(self, prompt):
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set.")
        response = self.model.generate_content(prompt)
        if not response or not response.text:
            raise Exception("Gemini returned an empty response.")
        return response.text
