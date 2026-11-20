"""
Capture real screenshots of the running AI-Based Smart Agriculture Assistant web application
using Headless Google Chrome.
"""

import os
import time
import subprocess
import threading
from app import app

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
SCREENSHOTS_DIR = os.path.join(BASE_DIR, 'docs', 'screenshots')
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
if not os.path.exists(CHROME_PATH):
    CHROME_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

def run_flask():
    app.run(host='127.0.0.1', port=5005, debug=False, use_reloader=False)

def capture_page(url, output_path):
    cmd = [
        CHROME_PATH,
        "--headless",
        "--disable-gpu",
        "--hide-scrollbars",
        "--window-size=1280,820",
        f"--screenshot={output_path}",
        url
    ]
    subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=15)
    if os.path.exists(output_path):
        print(f"[Screenshot Captured] {os.path.basename(output_path)} ({os.path.getsize(output_path)} bytes)")
    else:
        print(f"[Screenshot Failed] {os.path.basename(output_path)}")

def main():
    print(f"[Starting Server] Launching Flask test server on port 5005...")
    server_thread = threading.Thread(target=run_flask, daemon=True)
    server_thread.start()
    time.sleep(2.5) # Wait for server startup
    
    pages = [
        ("http://127.0.0.1:5005/", os.path.join(SCREENSHOTS_DIR, "dashboard.png")),
        ("http://127.0.0.1:5005/crop", os.path.join(SCREENSHOTS_DIR, "crop_recommendation.png")),
        ("http://127.0.0.1:5005/disease", os.path.join(SCREENSHOTS_DIR, "disease_detection.png")),
        ("http://127.0.0.1:5005/fertilizer", os.path.join(SCREENSHOTS_DIR, "fertilizer_recommendation.png")),
        ("http://127.0.0.1:5005/weather?region=hyderabad", os.path.join(SCREENSHOTS_DIR, "weather_advisory.png")),
        ("http://127.0.0.1:5005/irrigation", os.path.join(SCREENSHOTS_DIR, "smart_irrigation.png")),
        ("http://127.0.0.1:5005/chatbot", os.path.join(SCREENSHOTS_DIR, "agriculture_chatbot.png"))
    ]
    
    for url, out_path in pages:
        capture_page(url, out_path)
        
    print("[Done] All application screenshots captured successfully!")

if __name__ == '__main__':
    main()
