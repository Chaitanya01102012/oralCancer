from datetime import datetime, timezone
from sqlalchemy.orm import Session

from app.models.refresh_token import RefreshToken


class RefreshTokenRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, token: RefreshToken) -> RefreshToken:
        existing = self.get_by_token(token.token)
        if existing:
            existing.user_id = token.user_id
            existing.expires_at = token.expires_at
            existing.revoked = bool(token.revoked if token.revoked is not None else False)
            self.db.commit()
            self.db.refresh(existing)
            return existing

        self.db.add(token)
        self.db.commit()
        self.db.refresh(token)
        return token

    def get_by_token(self, token_value: str) -> RefreshToken | None:
        return self.db.query(RefreshToken).filter(RefreshToken.token == token_value).first()

    def revoke(self, token: RefreshToken) -> None:
        token.revoked = True
        self.db.commit()

    def revoke_all_for_user(self, user_id: int) -> None:
        tokens = self.db.query(RefreshToken).filter(RefreshToken.user_id == user_id).all()
        for item in tokens:
            item.revoked = True
        self.db.commit()

    def is_valid(self, token: RefreshToken) -> bool:
        expires_at = token.expires_at
        if expires_at.tzinfo is None:
            expires_at = expires_at.replace(tzinfo=timezone.utc)
        return not token.revoked and expires_at > datetime.now(timezone.utc)
