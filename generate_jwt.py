import hmac
import hashlib
import base64
import json
import time

KEY = "3EJfPRMGNbXRUplVvjSvlj"
SECRET = "Ij56Agc+z2vatzhbZO21OAYIIThklgagXtbtwjGe"

def base64url_encode(data):
    return base64.urlsafe_b64encode(data).replace(b'=', b'').decode('utf-8')

def generate_token():
    header = {
        "alg": "HS256",
        "typ": "JWT"
    }
    
    # Payload guess: usually requires 'key' or 'uid' and expiry
    payload = {
        "uid": KEY,
        "exp": int(time.time()) + 3600, # 1 hour
        "iat": int(time.time())
    }
    
    encoded_header = base64url_encode(json.dumps(header).encode('utf-8'))
    encoded_payload = base64url_encode(json.dumps(payload).encode('utf-8'))
    
    signature_input = f"{encoded_header}.{encoded_payload}"
    # Decode the secret if it's base64 encoded
    try:
        secret_bytes = base64.b64decode(SECRET)
    except:
        secret_bytes = SECRET.encode('utf-8')
        
    signature = hmac.new(secret_bytes, signature_input.encode('utf-8'), hashlib.sha256).digest()
    encoded_signature = base64url_encode(signature)
    
    return f"{signature_input}.{encoded_signature}"

token = generate_token()
print(f"Token: {token}")

# Also print a curl command to test it
print("\nTest Command:")
print(f"curl -s -H 'Authorization: Bearer {token}' https://api.pub1.passkit.io/members/programs")
