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
        self.timeout = httpx.Timeout(120.0, connect=10.0)

    def analyze_image(self, image_path: str) -> dict:
        path = Path(image_path)

        try:
            with open(path, "rb") as f:
                files = {"image": (path.name, f, "image/jpeg")}
                response = httpx.post(
                    f"{self.base_url}/predict",
                    files=files,
                    timeout=self.timeout,
                )
        except httpx.ConnectError:
            raise RuntimeError(
                f"Could not connect to AI Engine at {self.base_url}. "
                "Make sure the AI Engine server is running: "
                "cd oralCancerDetection && python api.py"
            )
        except httpx.TimeoutException:
            raise RuntimeError(
                "AI Engine request timed out. The model may still be loading."
            )

        if response.status_code != 200:
            detail = response.text
            raise RuntimeError(
                f"AI Engine returned {response.status_code}: {detail}"
            )

        return response.json()
