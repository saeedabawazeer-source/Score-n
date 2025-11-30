import requests
import json

API_KEY = "0anQzO4Pfe3u6L6Xvr2p0tDUgKmAB5W2Pmw7jg6LOCjfVZVdnOIiCmQ5d39ZfrmZTwLniqzdl_5lHXJ5Q3ZV7Liu4-NAwsDktCszjE8GtnHQKVQm6CDKK485DnqQT7ou6Q4haj-Qi90hxf3Q8Vg9PssaVKBlAilP8Ff581of7mswTYWY4YcRu2SllDfx3wQyXlTJf1xMe14TnVnQJaYS2TNUbj4AAVjDmweqPMCrfE6N7E2h3T7SsGrQGf43tTJiT1oQ0PAW-Qwr4OZgrRnblI9zuGa78YSmFWyShKSflIcPTES-sP8b6VCKPHv4olRM"

url = "https://api.pub1.passkit.io/flights/programs" # Trying flights first as it's common, or just /programs
# Actually, let's try the generic v3 programs endpoint which is likely for membership/coupons
url_v3 = "https://api.pub1.passkit.io/v3/programs"

# Minimal payload for a Membership card
payload = {
    "name": "Score'n Player Card",
    "status": ["PROGRAM_STATUS_DRAFT"],
    "templateId": "MEMBERSHIP_CARD", # Guessing or omitting
    # Some APIs require specific design fields
}

# Better payload based on common PassKit schemas
payload_membership = {
    "name": "Score'n Player Card",
    "programStatus": "PROGRAM_STATUS_ACTIVE",
    "defaultLanguage": "en",
    "passTypeIdentifier": "pass.com.scoren.playercard", # Optional, might be assigned
}

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

print(f"Attempting to create program at {url_v3}...")
try:
    response = requests.post(url_v3, json=payload_membership, headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
