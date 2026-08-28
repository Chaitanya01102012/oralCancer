import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "oral-cancer-backend")
    APP_ENV: str = os.getenv("APP_ENV", "development")

    AI_ENGINE_URL: str = os.getenv("AI_ENGINE_URL", "http://localhost:8001")

    SECRET_KEY: str = os.getenv("SECRET_KEY", "dev-secret")
    ACCESS_TOKEN_TTL_MINUTES: int = int(os.getenv("ACCESS_TOKEN_TTL_MINUTES", "30"))
    REFRESH_TOKEN_TTL_DAYS: int = int(os.getenv("REFRESH_TOKEN_TTL_DAYS", "7"))
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./oral_cancer.db")
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", str(BASE_DIR / "uploads"))

    SMTP_HOST: str = os.getenv("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT: int = int(os.getenv("SMTP_PORT", "587"))
    SMTP_EMAIL: str = os.getenv("SMTP_EMAIL", "")
    SMTP_APP_PASSWORD: str = os.getenv("SMTP_APP_PASSWORD", "")
    OTP_EXPIRY_MINUTES: int = int(os.getenv("OTP_EXPIRY_MINUTES", "10"))

    CLOUDINARY_CLOUD_NAME: str | None = os.getenv("CLOUDINARY_CLOUD_NAME")
    CLOUDINARY_API_KEY: str | None = os.getenv("CLOUDINARY_API_KEY")
    CLOUDINARY_API_SECRET: str | None = os.getenv("CLOUDINARY_API_SECRET")
    CLOUDINARY_SECURE: bool = (
        os.getenv("CLOUDINARY_SECURE", "true").lower() == "true"
    )


settings = Settings()
