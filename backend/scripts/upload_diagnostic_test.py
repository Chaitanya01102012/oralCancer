#!/usr/bin/env python3
"""
Simple endpoint test script for /diagnostics.

Usage:
    python scripts/upload_diagnostic_test.py --image PATH/TO/IMAGE.jpg

The script will:
- Register a temporary user (unique email)
- Login to obtain access token
- Upload the given image to POST /diagnostics with the token
- Print the server response

Requires: `requests` (install in backend venv: `pip install requests`)
"""
from __future__ import annotations

import argparse
import uuid
import requests
import json
import os
import sys


def make_user_credentials():
    uid = uuid.uuid4().hex[:8]
    email = f"test+{uid}@example.com"
    password = "TestPass123!"
    full_name = f"Test User {uid}"
    return email, password, full_name


def register(base_url: str, email: str, password: str, full_name: str) -> bool:
    url = f"{base_url}/auth/register"
    payload = {"email": email, "password": password, "full_name": full_name}
    r = requests.post(url, json=payload)
    r.raise_for_status()
    return True


def login(base_url: str, email: str, password: str) -> str:
    url = f"{base_url}/auth/login"
    payload = {"email": email, "password": password}
    r = requests.post(url, json=payload)
    r.raise_for_status()
    data = r.json()
    # MessageResponse: { success, message, data: { access_token, refresh_token, token_type }}
    access_token = data.get("data", {}).get("access_token")
    if not access_token:
        raise RuntimeError(f"Login did not return access_token: {data}")
    return access_token


def upload_diagnostic(base_url: str, token: str, image_path: str, notes: str | None = None) -> dict:
    url = f"{base_url}/diagnostics"
    headers = {"Authorization": f"Bearer {token}"}
    files = {"file": open(image_path, "rb")}
    data = {}
    if notes:
        data["notes"] = notes
    r = requests.post(url, headers=headers, files=files, data=data)
    files["file"].close()
    # allow non-2xx to show response
    try:
        r.raise_for_status()
    except Exception:
        print("Request failed, status:", r.status_code)
        try:
            print(r.text)
        except Exception:
            pass
        raise
    return r.json()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--image", "-i", required=True, help="Path to image to upload")
    parser.add_argument("--base-url", "-b", default=os.getenv("API_BASE_URL", "http://127.0.0.1:8000"), help="Base URL of the running API")
    parser.add_argument("--reuse-user", "-r", action="store_true", help="Do not register a new user; expects env vars TEST_EMAIL and TEST_PASSWORD to be set")
    parser.add_argument("--notes", help="Optional notes to send with the diagnostic")
    args = parser.parse_args()

    image_path = args.image
    if not os.path.exists(image_path):
        print("Image not found:", image_path)
        sys.exit(1)

    base_url = args.base_url.rstrip("/")

    if args.reuse_user:
        email = os.getenv("TEST_EMAIL")
        password = os.getenv("TEST_PASSWORD")
        if not email or not password:
            print("When using --reuse-user you must set TEST_EMAIL and TEST_PASSWORD environment variables")
            sys.exit(1)
        full_name = "Test User"
    else:
        email, password, full_name = make_user_credentials()
        print(f"Registering user: {email}")
        register(base_url, email, password, full_name)

    print("Logging in...")
    token = login(base_url, email, password)
    print("Access token obtained; uploading image...")

    resp = upload_diagnostic(base_url, token, image_path, notes=args.notes)

    print(json.dumps(resp, indent=4))


if __name__ == "__main__":
    main()
