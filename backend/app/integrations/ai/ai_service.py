import time
from pathlib import Path

import httpx

from app.config.settings import settings


class AIService:
    """
    Adapter that calls the AI Engine's HTTP API.

    The backend never imports TensorFlow — inference
    happens in the separate AI Engine service.
    """

    def __init__(self):
        self.base_url = settings.AI_ENGINE_URL.rstrip("/")
        self.timeout = httpx.Timeout(180.0, connect=20.0)
        self.max_retries = 2
        self.backoff_seconds = 2.0

    def analyze_image(self, image_path: str) -> dict:
        path = Path(image_path)
        last_error: Exception | None = None

        for attempt in range(self.max_retries + 1):
            try:
                with open(path, "rb") as f:
                    files = {"image": (path.name, f, "image/jpeg")}
                    response = httpx.post(
                        f"{self.base_url}/predict",
                        files=files,
                        timeout=self.timeout,
                    )
            except (httpx.RequestError, httpx.TimeoutException) as exc:
                last_error = exc
                if attempt < self.max_retries:
                    time.sleep(self.backoff_seconds * (attempt + 1))
                    continue
                raise RuntimeError(
                    "AI Engine request timed out or was unavailable after retries. "
                    "The model may still be cold-starting or the service may be under load."
                ) from exc

            if response.status_code == 200:
                return response.json()

            if response.status_code >= 500 and attempt < self.max_retries:
                last_error = RuntimeError(f"AI Engine returned {response.status_code}: {response.text}")
                time.sleep(self.backoff_seconds * (attempt + 1))
                continue

            detail = response.text
            raise RuntimeError(f"AI Engine returned {response.status_code}: {detail}") from last_error

        if last_error is not None:
            raise RuntimeError(
                "AI Engine request failed after retries. The service may still be warming up."
            ) from last_error

        raise RuntimeError("AI Engine request failed without a response")
