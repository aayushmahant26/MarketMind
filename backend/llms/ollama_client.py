# This file creates an Ollama client by loading the phi3:latest model using the ollama library.
# It provides a generate() method that sends a prompt to Ollama and returns the generated text response.

# pyrefly: ignore [missing-import]
import ollama

class OllamaClient:

    def __init__(self):
        self.model = "phi3:latest"

    def generate(self, prompt):
        response = ollama.chat(
            model=self.model,
            messages=[
                {"role": "user", "content": prompt}
            ]
        )

        return response["message"]["content"]
    
