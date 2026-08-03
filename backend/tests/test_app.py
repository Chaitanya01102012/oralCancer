import uuid

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True


def test_register_login_flow():
    unique_email = f"demo+{uuid.uuid4().hex[:8]}@example.com"
    register_payload = {
        "email": unique_email,
        "password": "StrongPass123!",
        "full_name": "Demo User",
    }
    response = client.post("/auth/register", json=register_payload)
    assert response.status_code == 200
    assert response.json()["success"] is True

    login_payload = {
        "email": unique_email,
        "password": "StrongPass123!",
    }
    response = client.post("/auth/login", json=login_payload)
    assert response.status_code == 200
    body = response.json()
    assert body["success"] is True
    assert "access_token" in body["data"]
