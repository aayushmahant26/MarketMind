# This file creates a Gemini AI client by configuring the Gemini API using the API key and loading the gemini-2.5-flash model.
# It provides a generate() method that sends a prompt to Gemini and returns the generated text response.

import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

class GeminiClient:

    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        genai.configure(api_key=api_key)

        self.model = genai.GenerativeModel("gemini-2.5-flash")

    def generate(self, prompt):
        response = self.model.generate_content(prompt)
        return response.text
    
