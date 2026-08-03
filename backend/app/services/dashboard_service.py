from sqlalchemy.orm import Session

from app.repositories.diagnostic_repository import DiagnosticRepository
from app.schemas.dashboard import DashboardSummaryResponse


class DashboardService:
    def __init__(self, db: Session):
        self.diagnostic_repository = DiagnosticRepository(db)

    def get_summary(self, user_id: int) -> dict:
        diagnostics = self.diagnostic_repository.list_for_user(user_id)
        latest = diagnostics[0] if diagnostics else None
        return {
            "success": True,
            "message": "Dashboard summary loaded",
            "data": DashboardSummaryResponse(
                total_diagnostics=len(diagnostics),
                recent_diagnostics=min(len(diagnostics), 5),
                latest_prediction=latest.prediction if latest else None,
            ).model_dump(),
        }
