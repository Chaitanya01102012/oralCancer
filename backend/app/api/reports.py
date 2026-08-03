from fastapi import APIRouter, Depends
from fastapi.responses import Response
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.security import get_current_user
from app.models.user import User
from app.services.report_service import ReportService

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/{diagnostic_id}")
def get_report(diagnostic_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> Response:
    service = ReportService(db)
    return service.generate_report(diagnostic_id, current_user.id)
