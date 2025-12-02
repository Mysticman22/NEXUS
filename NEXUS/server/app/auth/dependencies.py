import firebase_admin
from firebase_admin import auth, credentials
from fastapi import Header, HTTPException
import os

# Initialize Firebase
if not firebase_admin._apps:
    try:
        cred_path = "firebase_credentials.json"
        if os.path.exists(cred_path):
            cred = credentials.Certificate(cred_path)
            firebase_admin.initialize_app(cred)
            print("✅ NEXUS Security: Firebase Initialized")
        else:
            print(f"⚠️ Security Warning: '{cred_path}' not found. Auth will fail.")
    except Exception as e:
        print(f"⚠️ Security Warning: Could not init Firebase. {e}")

async def verify_firebase_token(authorization: str = Header(...)):
    try:
        if not authorization.startswith("Bearer "):
             raise HTTPException(status_code=401, detail="Invalid Header Format")
             
        token = authorization.split(" ")[1]
        decoded_token = auth.verify_id_token(token)
        return decoded_token
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or Expired Token")