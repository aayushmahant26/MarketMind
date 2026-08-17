from agents.graph import run_marketmind

class AnalysisService:

    def analyze(self, query):
        result = run_marketmind(query)
        return result