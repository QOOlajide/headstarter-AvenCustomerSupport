import os
import requests
import json
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from utils.renderer import render_page


# 🔐 Load environment variables (e.g., EXA_API_KEY)
load_dotenv()

# ✅ Grab API Key from .env
EXA_API_KEY = os.getenv("EXA_API_KEY")

# 🔎 What we’re searching for on Exa
SEARCH_QUERY = (
    "site:aven.com/support OR site:aven.com/contact OR site:aven.com/faq "
    "OR site:aven.com/about OR site:aven.com/reviews OR site:aven.com/education "
    "OR site:aven.com/products OR site:aven.com/blog"
)


# 📦 Headers needed for the Exa API request
HEADERS = {
    "Authorization": f"Bearer {EXA_API_KEY}",
    "Content-Type": "application/json"
}

# 🔍 Search Exa and return top URLs
def search_exa(query):
    payload = {"query": query, "num_results": 10}
    response = requests.post("https://api.exa.ai/search", headers=HEADERS, json=payload)
    response.raise_for_status()
    data = response.json()

    # 🔗 Extract only relevant aven.com URLs
    results = []
    for result in data.get("results", []):
        url = result.get("url")
        if url and "aven.com" in url:
            print("🔗 Exa Result URL:", url)
            results.append(url)
    return results

# 🧽 Scrape readable content from each URL
def scrape_full_text(url):
    try:
        content = render_page(url)

        if content and len(content.strip()) > 100:
            print(f"✅ Scraping full page: {url} — {len(content)} characters")
            return {"url": url, "content": content}
        else:
            print(f"❌ Skipped {url} — empty or too short after rendering")
            return None
    except Exception as e:
        print(f"❌ Error scraping {url}: {e}")
        return None
if __name__ == "__main__":
    print("Payload:", {"query": SEARCH_QUERY, "num_results": 10})
    urls = search_exa(SEARCH_QUERY)

    articles = []
    for url in urls:
        article = scrape_full_text(url)
        if article:
            articles.append(article)

    with open("aven_articles.json", "w") as f:
        json.dump(articles, f, indent=2)

    print(f"✅ Saved {len(articles)} full articles to aven_articles.json")
