from sqlalchemy.orm import Session

from app.models.report import Report


class ReportRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, report: Report) -> Report:
        self.db.add(report)
        self.db.commit()
        self.db.refresh(report)
        return report

    def get_by_diagnostic(self, diagnostic_id: int, user_id: int) -> Report | None:
        return (
            self.db.query(Report)
            .filter(Report.diagnostic_id == diagnostic_id, Report.user_id == user_id)
            .first()
        )

    def get_for_user(self, report_id: int, user_id: int) -> Report | None:
        return self.db.query(Report).filter(Report.id == report_id, Report.user_id == user_id).first()

    def list_for_user(self, user_id: int) -> list[Report]:
        return (
            self.db.query(Report)
            .filter(Report.user_id == user_id)
            .order_by(Report.created_at.desc())
            .all()
        )

    def delete(self, report: Report) -> None:
        self.db.delete(report)
        self.db.commit()
