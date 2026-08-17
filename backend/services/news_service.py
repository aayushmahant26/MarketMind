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

        headlines = []

        for entry in feed.entries[:15]:
            headlines.append({
                "title": entry.title,
                "link": entry.link,
                "published": entry.get("published", "") # used to get published date and time
            })

        return headlines