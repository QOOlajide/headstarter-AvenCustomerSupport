# exa_scraper/utils/renderer.py

from playwright.sync_api import sync_playwright

def render_page(url: str) -> str:
    """Uses Playwright to render a full page and extract inner text."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            page.goto(url, timeout=15000)
            page.wait_for_timeout(3000)  # wait 3s for dynamic content
            content = page.inner_text("body")
        except Exception as e:
            print(f"⚠️ Error rendering {url}: {e}")
            content = ""
        finally:
            browser.close()
    return content
