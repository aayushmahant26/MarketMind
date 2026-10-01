# pyrefly: ignore [missing-import]
import feedparser # Used to read RSS feeds.
from urllib.parse import quote # Used to encode the query.


class NewsService:

    def fetch_market_news(self, query="Indian stock market"):
        encoded_query = quote(query)

        url = (
            f"https://news.google.com/rss/search?q={encoded_query}"
            "&hl=en-IN&gl=IN&ceid=IN:en"
        )

        feed = feedparser.parse(url)

        # Sort feed entries by published date/time (most recent first)
        entries = sorted(
            feed.entries,
            key=lambda x: x.get("published_parsed") or (0, 0, 0, 0, 0, 0, 0, 0, 0),
            reverse=True
        )

        headlines = []

        for entry in entries[:15]:
            headlines.append({
                "title": entry.title,
                "link": entry.link,
                "published": entry.get("published", "") # used to get published date and time
            })

        return headlines

    def summarize_news(self, title, symbol="NIFTY", link=None):
        import json
        import re
        from llms.router import LLMRouter

        router = LLMRouter()

        prompt = f"""You are an elite financial news analyst for the Indian stock market.
Analyze the following financial news item for {symbol}:

Headline: {title}

Provide a concise, high-impact breakdown formatted strictly as JSON with the following keys:
- "headline_essence": 1 clear sentence summarizing what occurred.
- "market_impact": 1-2 sentences on how this impacts the stock price, company earnings, or broader market sentiment.
- "sentiment": Exactly one word: "Bullish", "Bearish", or "Neutral".
- "key_takeaway": 1 actionable bullet point for traders/investors.

Return ONLY the raw JSON object, without any markdown code fences, backticks, or extra commentary.
"""

        result = router.generate(prompt)
        raw_text = result.get("response", "").strip()

        # Clean any markdown code blocks if the LLM wrapped it
        clean_text = re.sub(r"^```(?:json)?", "", raw_text, flags=re.MULTILINE)
        clean_text = re.sub(r"```$", "", clean_text, flags=re.MULTILINE).strip()

        try:
            parsed = json.loads(clean_text)
            return {
                "headline_essence": parsed.get("headline_essence", title),
                "market_impact": parsed.get("market_impact", "No direct impact details available."),
                "sentiment": parsed.get("sentiment", "Neutral"),
                "key_takeaway": parsed.get("key_takeaway", "Monitor price action for subsequent reactions."),
                "model": result.get("model", "ai")
            }
        except Exception:
            return {
                "headline_essence": title,
                "market_impact": clean_text,
                "sentiment": "Neutral",
                "key_takeaway": "Review full article for detailed financial metrics.",
                "model": result.get("model", "ai")
            }