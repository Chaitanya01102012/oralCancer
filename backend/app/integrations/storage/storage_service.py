from pathlib import Path

import cloudinary
import cloudinary.uploader

from app.config.settings import settings


class StorageService:
    def __init__(self) -> None:
        if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
            cloudinary.config(
                cloud_name=settings.CLOUDINARY_CLOUD_NAME,
                api_key=settings.CLOUDINARY_API_KEY,
                api_secret=settings.CLOUDINARY_API_SECRET,
                secure=settings.CLOUDINARY_SECURE,
            )

    def upload_report(self, report_path: str, report_name: str) -> str:
        if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
            upload_result = cloudinary.uploader.upload(report_path, public_id=report_name, resource_type="raw")
            return upload_result.get("secure_url") or upload_result.get("url") or report_path

        destination = Path(settings.UPLOAD_DIR) / "reports" / report_name
        destination.parent.mkdir(parents=True, exist_ok=True)
        source = Path(report_path)
        destination.write_bytes(source.read_bytes())
        return str(destination)

    def delete_report(self, report_path: str) -> None:
        if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
            try:
                cloudinary.uploader.destroy(report_path, resource_type="raw")
            except Exception:
                pass
            return

        Path(report_path).unlink(missing_ok=True)
