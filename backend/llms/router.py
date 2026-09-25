# This file acts as an LLM Router, deciding which AI model to use for generating responses.
# It uses a resilient multi-tier fallback strategy:
# 1. Primary: Groq API (High speed inference)
# 2. Secondary: Google Gemini (High token quota cloud fallback)
# 3. Tertiary: Local Ollama (Offline fallback)

from llms.groq_client import GroqClient
from llms.gemini_client import GeminiClient
from llms.ollama_client import OllamaClient
from services.logger_service import logger


class LLMRouter:
    def __init__(self):
        self.groq = GroqClient()
        self.gemini = GeminiClient()
        self.ollama = OllamaClient()

    def generate(self, prompt):
        # 1. Primary: Try Groq
        try:
            logger.info("Trying Groq")
            response = self.groq.generate(prompt)
            logger.info("Groq response generated successfully")
            return {
                "model": "groq",
                "response": response
            }
        except Exception as groq_error:
            logger.warning(f"Groq failed: {groq_error}")

        # 2. Secondary: Try Gemini (bypasses Groq rate limits)
        try:
            logger.info("Switching to Gemini fallback")
            response = self.gemini.generate(prompt)
            logger.info("Gemini response generated successfully")
            return {
                "model": "gemini",
                "response": response
            }
        except Exception as gemini_error:
            logger.warning(f"Gemini failed: {gemini_error}")

        # 3. Tertiary: Try Local Ollama
        try:
            logger.info("Switching to Ollama fallback")
            response = self.ollama.generate(prompt)
            logger.info("Ollama response generated successfully")
            return {
                "model": "ollama",
                "response": response
            }
        except Exception as ollama_error:
            logger.error(f"Ollama failed: {ollama_error}")

        raise Exception(
            f"All LLMs failed | "
            f"Groq: {groq_error} | "
            f"Gemini: {gemini_error} | "
            f"Ollama: {ollama_error}"
        )