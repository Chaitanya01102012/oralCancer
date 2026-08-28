import random
from datetime import datetime, timedelta, timezone

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.config.settings import settings
from app.models.password_reset_otp import PasswordResetOtp
from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.repositories.password_reset_repository import PasswordResetRepository
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.security.jwt import create_access_token, create_refresh_token, decode_token
from app.security.password import hash_password, verify_password
from app.utils.email import send_otp_email


class AuthService:
    def __init__(self, db: Session):
        self.user_repository = UserRepository(db)
        self.refresh_token_repository = RefreshTokenRepository(db)
        self.password_reset_repository = PasswordResetRepository(db)
        self.db = db

    def register(self, payload: RegisterRequest) -> TokenResponse:
        if self.user_repository.get_by_email(payload.email):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

        user = User(
            email=str(payload.email),
            password_hash=hash_password(payload.password),
            full_name=payload.full_name,
        )
        self.user_repository.create(user)
        return self._issue_tokens(user.id)

    def login(self, payload: LoginRequest) -> TokenResponse:
        user = self.user_repository.get_by_email(str(payload.email))
        if not user or not verify_password(payload.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        return self._issue_tokens(user.id)

    def refresh(self, refresh_token_value: str) -> TokenResponse:
        token_record = self.refresh_token_repository.get_by_token(refresh_token_value)
        if not token_record or not self.refresh_token_repository.is_valid(token_record):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

        payload = decode_token(refresh_token_value)
        user_id = int(payload.get("sub"))
        self.refresh_token_repository.revoke(token_record)
        return self._issue_tokens(user_id)

    def logout(self, refresh_token_value: str) -> None:
        token_record = self.refresh_token_repository.get_by_token(refresh_token_value)
        if token_record:
            self.refresh_token_repository.revoke(token_record)

    def request_password_reset(self, email: str) -> None:
        user = self.user_repository.get_by_email(email)
        if not user:
            return

        recent_count = self.password_reset_repository.count_recent_by_email(email, 15)
        if recent_count >= 3:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many reset requests. Try again later.")

        otp_code = str(random.randint(100000, 999999))
        otp = PasswordResetOtp(
            email=email,
            otp_code=otp_code,
            expires_at=datetime.now(timezone.utc) + timedelta(minutes=settings.OTP_EXPIRY_MINUTES),
        )
        self.password_reset_repository.create(otp)
        try:
            send_otp_email(email, otp_code)
        except Exception as exc:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Unable to send reset email. Please try again later.",
            ) from exc

    def verify_otp(self, email: str, otp_code: str) -> None:
        otp = self.password_reset_repository.get_latest_by_email(email)
        if not otp:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No OTP found for this email")

        expires_at = otp.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        if expires_at < datetime.now(timezone.utc):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="OTP has expired")

        if otp.attempts >= 5:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Too many failed attempts. Request a new code.")

        if otp.otp_code != otp_code:
            self.password_reset_repository.increment_attempts(otp)
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid OTP")

    def reset_password(self, email: str, otp_code: str, new_password: str) -> None:
        self.verify_otp(email, otp_code)

        otp = self.password_reset_repository.get_latest_by_email(email)
        self.password_reset_repository.mark_used(otp)

        user = self.user_repository.get_by_email(email)
        if not user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="User not found")

        user.password_hash = hash_password(new_password)
        self.db.commit()
        self.refresh_token_repository.revoke_all_for_user(user.id)

    def _issue_tokens(self, user_id: int) -> TokenResponse:
        access_token = create_access_token(str(user_id))
        refresh_token_value = create_refresh_token(str(user_id))
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        refresh_token = RefreshToken(token=refresh_token_value, user_id=user_id, expires_at=expires_at, revoked=False)
        self.refresh_token_repository.create(refresh_token)
        return TokenResponse(access_token=access_token, refresh_token=refresh_token_value)
