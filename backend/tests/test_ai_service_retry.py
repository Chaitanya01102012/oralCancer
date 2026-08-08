import os
import tempfile
from unittest.mock import patch

import httpx

from app.integrations.ai.ai_service import AIService


def test_analyze_image_retries_on_timeout_and_succeeds():
    service = AIService()

    with tempfile.NamedTemporaryFile("wb", suffix=".jpg", delete=False) as tmp:
        tmp.write(b"fake-image-bytes")
        image_path = tmp.name

    try:
        with patch(
            "app.integrations.ai.ai_service.httpx.post",
            side_effect=[
                httpx.TimeoutException("timed out"),
                httpx.TimeoutException("timed out"),
                httpx.Response(200, json={"predicted_class": "Normal", "confidence": 0.95}),
            ],
        ) as mock_post, patch("app.integrations.ai.ai_service.time.sleep", return_value=None):
            result = service.analyze_image(image_path)

        assert result["predicted_class"] == "Normal"
        assert mock_post.call_count == 3
    finally:
        os.unlink(image_path)
