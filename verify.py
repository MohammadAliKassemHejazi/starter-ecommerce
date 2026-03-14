from playwright.sync_api import sync_playwright

def verify_permissions_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto("http://localhost:3000/permissions")
        page.wait_for_timeout(5000)
        page.screenshot(path="permissions.png")
        browser.close()

if __name__ == "__main__":
    verify_permissions_page()
