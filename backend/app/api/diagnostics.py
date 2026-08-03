from fastapi import APIRouter, Depends, File, Form, UploadFile
import json
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.security import get_current_user
from app.models.user import User
from app.schemas.diagnostic import DiagnosticCreateRequest, DiagnosticResponse
from app.services.diagnostic_service import DiagnosticService

router = APIRouter(prefix="/diagnostics", tags=["diagnostics"])


@router.post("", response_model=DiagnosticResponse)
def create_diagnostic(
    notes: str | None = Form(None),
    patient: str | None = Form(None),
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> DiagnosticResponse:
    service = DiagnosticService(db)
    payload = DiagnosticCreateRequest(notes=notes, patient=json.loads(patient) if patient else None)
    return service.create_diagnostic(current_user.id, file, payload)


@router.get("", response_model=list[DiagnosticResponse])
def list_diagnostics(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> list[DiagnosticResponse]:
    service = DiagnosticService(db)
    return service.list_diagnostics(current_user.id)


@router.get("/{diagnostic_id}", response_model=DiagnosticResponse)
def get_diagnostic(diagnostic_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> DiagnosticResponse:
    service = DiagnosticService(db)
    return service.get_diagnostic(diagnostic_id, current_user.id)


@router.delete("/{diagnostic_id}")
def delete_diagnostic(diagnostic_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> dict:
    service = DiagnosticService(db)
    service.delete_diagnostic(diagnostic_id, current_user.id)
    return {"success": True, "message": "Diagnostic deleted", "data": {}}
