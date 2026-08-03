from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.refresh_token import RefreshToken
from app.models.user import User
from app.repositories.refresh_token_repository import RefreshTokenRepository
from app.repositories.user_repository import UserRepository
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.security.jwt import create_access_token, create_refresh_token, decode_token
from app.security.password import hash_password, verify_password


class AuthService:
    def __init__(self, db: Session):
        self.user_repository = UserRepository(db)
        self.refresh_token_repository = RefreshTokenRepository(db)
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

    def _issue_tokens(self, user_id: int) -> TokenResponse:
        access_token = create_access_token(str(user_id))
        refresh_token_value = create_refresh_token(str(user_id))
        expires_at = datetime.now(timezone.utc) + timedelta(days=7)
        refresh_token = RefreshToken(token=refresh_token_value, user_id=user_id, expires_at=expires_at, revoked=False)
        self.refresh_token_repository.create(refresh_token)
        return TokenResponse(access_token=access_token, refresh_token=refresh_token_value)
