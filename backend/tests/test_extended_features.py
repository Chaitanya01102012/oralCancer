import uuid

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def register_and_login() -> tuple[str, str]:
    unique_email = f"demo+{uuid.uuid4().hex[:8]}@example.com"
    register_payload = {
        "email": unique_email,
        "password": "StrongPass123!",
        "full_name": "Demo User",
    }
    response = client.post("/auth/register", json=register_payload)
    assert response.status_code == 200

    login_payload = {
        "email": unique_email,
        "password": "StrongPass123!",
    }
    response = client.post("/auth/login", json=login_payload)
    assert response.status_code == 200
    body = response.json()
    return body["data"]["access_token"], body["data"]["refresh_token"]


def test_refresh_and_logout_flow():
    access_token, refresh_token = register_and_login()

    refresh_response = client.post("/auth/refresh", json={"refresh_token": refresh_token})
    assert refresh_response.status_code == 200
    assert "access_token" in refresh_response.json()["data"]

    logout_response = client.post("/auth/logout", json={"refresh_token": refresh_token})
    assert logout_response.status_code == 200

    second_refresh = client.post("/auth/refresh", json={"refresh_token": refresh_token})
    assert second_refresh.status_code == 401


from unittest.mock import patch


@patch("app.services.diagnostic_service.AIService.analyze_image")
def test_dashboard_and_report_endpoints(mock_analyze_image):
    mock_analyze_image.return_value = {
        "predicted_class": "Normal",
        "confidence": 95.0,
        "probabilities": {"Normal": 95.0},
        "disease_information": {
            "title": "Normal Oral Mucosa",
            "description": "No abnormalities",
            "severity": "None",
            "recommendation": "None"
        }
    }
    access_token, _ = register_and_login()
    headers = {"Authorization": f"Bearer {access_token}"}

    diagnostic_response = client.post(
        "/diagnostics",
        headers=headers,
        files={"file": ("sample.jpg", b"fake-image-bytes", "image/jpeg")},
        data={"notes": "Test diagnostic"},
    )
    assert diagnostic_response.status_code == 200
    diagnostic_id = diagnostic_response.json()["id"]

    summary_response = client.get("/dashboard/summary", headers=headers)
    assert summary_response.status_code == 200
    assert summary_response.json()["data"]["total_diagnostics"] >= 1

    report_response = client.get(f"/reports/{diagnostic_id}", headers=headers)
    assert report_response.status_code == 200
    assert report_response.headers["content-type"].startswith("application/pdf")
