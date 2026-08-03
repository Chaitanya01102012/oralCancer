from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.security import get_current_user
from app.models.user import User
from app.schemas.auth import MessageResponse
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/summary", response_model=MessageResponse)
def dashboard_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> MessageResponse:
    service = DashboardService(db)
    payload = service.get_summary(current_user.id)
    return MessageResponse(**payload)
