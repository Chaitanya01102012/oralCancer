from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session

from app.models.password_reset_otp import PasswordResetOtp


class PasswordResetRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, otp: PasswordResetOtp) -> PasswordResetOtp:
        self.db.add(otp)
        self.db.commit()
        self.db.refresh(otp)
        return otp

    def get_latest_by_email(self, email: str) -> PasswordResetOtp | None:
        return (
            self.db.query(PasswordResetOtp)
            .filter(PasswordResetOtp.email == email, PasswordResetOtp.used == False)
            .order_by(PasswordResetOtp.created_at.desc())
            .first()
        )

    def mark_used(self, otp: PasswordResetOtp) -> None:
        otp.used = True
        self.db.commit()

    def increment_attempts(self, otp: PasswordResetOtp) -> None:
        otp.attempts += 1
        self.db.commit()

    def count_recent_by_email(self, email: str, minutes: int) -> int:
        cutoff = datetime.now(timezone.utc) - timedelta(minutes=minutes)
        return (
            self.db.query(PasswordResetOtp)
            .filter(PasswordResetOtp.email == email, PasswordResetOtp.created_at >= cutoff)
            .count()
        )
