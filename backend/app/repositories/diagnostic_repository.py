from sqlalchemy.orm import Session

from app.models.diagnostic import Diagnostic


class DiagnosticRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, diagnostic: Diagnostic) -> Diagnostic:
        self.db.add(diagnostic)
        self.db.commit()
        self.db.refresh(diagnostic)
        return diagnostic

    def list_for_user(self, user_id: int) -> list[Diagnostic]:
        return self.db.query(Diagnostic).filter(Diagnostic.user_id == user_id).order_by(Diagnostic.created_at.desc()).all()

    def get_for_user(self, diagnostic_id: int, user_id: int) -> Diagnostic | None:
        return self.db.query(Diagnostic).filter(Diagnostic.id == diagnostic_id, Diagnostic.user_id == user_id).first()

    def delete(self, diagnostic: Diagnostic) -> None:
        self.db.delete(diagnostic)
        self.db.commit()
