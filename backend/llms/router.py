# This file acts as an LLM Router, deciding which AI model to use for generating responses. It first tries Gemini, and if it fails, automatically falls back to Ollama, ensuring the application continues to work even if one model is unavailable.

from llms.gemini_client import GeminiClient
from llms.ollama_client import OllamaClient
from services.logger_service import logger


class LLMRouter:
    def __init__(self):
        self.gemini = GeminiClient()
        self.ollama = OllamaClient()

    def generate(self, prompt):
        try:
            logger.info("Trying Gemini")

            response = self.gemini.generate(prompt)

            logger.info("Gemini response generated")

            return {
                "model": "gemini",
                "response": response
            }

        except Exception as gemini_error:
            logger.warning(f"Gemini failed: {gemini_error}")

            try:
                logger.info("Switching to Ollama")

                response = self.ollama.generate(prompt)

                logger.info("Ollama response generated")

                return {
                    "model": "ollama",
                    "response": response
                }

            except Exception as ollama_error:
                logger.error(f"Ollama failed: {ollama_error}")

                raise Exception(
                    f"Both LLMs failed | "
                    f"Gemini: {gemini_error} | "
                    f"Ollama: {ollama_error}"
                )