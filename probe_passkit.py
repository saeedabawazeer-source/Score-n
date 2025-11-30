import requests
import os

# Key from .env.local
API_KEY = "0anQzO4Pfe3u6L6Xvr2p0tDUgKmAB5W2Pmw7jg6LOCjfVZVdnOIiCmQ5d39ZfrmZTwLniqzdl_5lHXJ5Q3ZV7Liu4-NAwsDktCszjE8GtnHQKVQm6CDKK485DnqQT7ou6Q4haj-Qi90hxf3Q8Vg9PssaVKBlAilP8Ff581of7mswTYWY4YcRu2SllDfx3wQyXlTJf1xMe14TnVnQJaYS2TNUbj4AAVjDmweqPMCrfE6N7E2h3T7SsGrQGf43tTJiT1oQ0PAW-Qwr4OZgrRnblI9zuGa78YSmFWyShKSflIcPTES-sP8b6VCKPHv4olRM"

# Try different endpoints and auth methods
endpoints = [
    "https://api.pub1.passkit.io/programs",
    "https://api.pub1.passkit.io/campaigns",
    "https://api.pub1.passkit.io/v3/programs"
]

def try_request(url, headers):
    try:
        print(f"Trying {url} with headers keys: {list(headers.keys())}")
        resp = requests.get(url, headers=headers, timeout=5)
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            print("Response:", resp.json())
            return True
        else:
            print("Response:", resp.text[:200])
    except Exception as e:
        print(f"Error: {e}")
    return False

# 1. Try as Bearer Token
headers_bearer = {"Authorization": f"Bearer {API_KEY}"}
# 2. Try as API-Key header
headers_apikey = {"API-Key": API_KEY}

for url in endpoints:
    if try_request(url, headers_bearer): break
    if try_request(url, headers_apikey): break
