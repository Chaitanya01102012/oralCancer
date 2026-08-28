from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api import auth, dashboard, diagnostics, health, profile, reports
from app.config.settings import settings
from app.database.base import Base
from app.database.session import engine
from app.models import diagnostic, password_reset_otp, refresh_token, report, user  # noqa: F401

app = FastAPI(title="Oral Cancer Classification System")

Base.metadata.create_all(bind=engine)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000",
#         "http://127.0.0.1:3000",
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://oralcancer-frontend.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

upload_dir = Path(settings.UPLOAD_DIR)
upload_dir.mkdir(parents=True, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=str(upload_dir)), name="uploads")

app.include_router(health.router)
app.include_router(auth.router)
app.include_router(profile.router)
app.include_router(diagnostics.router)
app.include_router(dashboard.router)
app.include_router(reports.router)
