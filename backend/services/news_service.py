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