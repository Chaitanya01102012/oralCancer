from pathlib import Path
from fastapi import HTTPException, UploadFile, status

from app.integrations.ai.ai_service import AIService
from app.integrations.storage.storage_service import StorageService
from app.models.diagnostic import Diagnostic
from app.repositories.diagnostic_repository import DiagnosticRepository
from app.repositories.patient_repository import PatientRepository
from app.schemas.diagnostic import DiagnosticCreateRequest, DiagnosticResponse
from app.config.settings import settings
from sqlalchemy.orm import Session


class DiagnosticService:
    def __init__(self, db: Session):
        self.repository = DiagnosticRepository(db)
        self.patient_repository = PatientRepository(db)
        self.db = db
        self.ai_service = AIService()
        self.storage_service = StorageService()
        # import report service lazily to avoid circular imports
        from app.services.report_service import ReportService

        self.report_service = ReportService(db)

    def create_diagnostic(self, user_id: int, image: UploadFile, payload: DiagnosticCreateRequest) -> DiagnosticResponse:
        if not image.filename:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Image filename is required")

        upload_dir = Path(settings.UPLOAD_DIR) / "temp" / "images"
        upload_dir.mkdir(parents=True, exist_ok=True)
        file_path = upload_dir / image.filename

        # Read bytes once and save to disk
        image.file.seek(0)
        image_bytes = image.file.read()
        with file_path.open("wb") as buffer:
            buffer.write(image_bytes)

        # Run inference
        try:
            ai_result = self.ai_service.analyze_image(str(file_path))
        except Exception as exc:
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail=f"AI analysis failed: {exc}") from exc

        predicted_class, confidence, probabilities, disease_information, model_version, engine_version, inference_time, metadata = (
            self._parse_ai_result(ai_result)
        )

        if not predicted_class or confidence is None:
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="AI engine returned an incomplete prediction")

        # create patient record if provided in payload
        patient_id = None
        patient_snapshot = None
        if getattr(payload, "patient", None):
            try:
                from app.services.patient_service import PatientService

                patient_service = PatientService(self.db)
                patient_data = payload.patient.model_dump()
                patient = patient_service.create_patient(user_id, patient_data)
                patient_id = patient.id
                patient_snapshot = patient_data
            except Exception:
                patient_id = None
                patient_snapshot = payload.patient.model_dump() if getattr(payload, "patient", None) else None

        diagnostic = Diagnostic(
            user_id=user_id,
            image_path=str(file_path.resolve()),
            prediction=str(predicted_class),
            confidence=float(confidence),
            notes=payload.notes,
            probabilities=probabilities or None,
            disease_information=disease_information or None,
            patient_id=patient_id,
            patient_snapshot=patient_snapshot,
        )

        saved = self.repository.create(diagnostic)

        report = None
        try:
            report = self.report_service.create_report_for_diagnostic(saved.id, user_id)
        except Exception:
            report = None

        return self._to_response(saved, report_url=report.report_url if report else None, has_report=report is not None)

    def list_diagnostics(self, user_id: int) -> list[DiagnosticResponse]:
        diagnostics = self.repository.list_for_user(user_id)
        results: list[DiagnosticResponse] = []
        for item in diagnostics:
            report = self.report_service.report_repository.get_by_diagnostic(item.id, user_id)
            results.append(self._to_response(item, report_url=report.report_url if report else None, has_report=report is not None))
        return results

    def get_diagnostic(self, diagnostic_id: int, user_id: int) -> DiagnosticResponse:
        diagnostic = self.repository.get_for_user(diagnostic_id, user_id)
        if not diagnostic:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Diagnostic not found")
        report = self.report_service.report_repository.get_by_diagnostic(diagnostic_id, user_id)
        return self._to_response(diagnostic, report_url=report.report_url if report else None, has_report=report is not None)

    def delete_diagnostic(self, diagnostic_id: int, user_id: int) -> None:
        diagnostic = self.repository.get_for_user(diagnostic_id, user_id)
        if not diagnostic:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Diagnostic not found")
        self.report_service.delete_report_for_diagnostic(diagnostic_id, user_id)
        self.repository.delete(diagnostic)

    @staticmethod
    def _parse_ai_result(ai_result):
        if hasattr(ai_result, "predicted_class"):
            return (
                ai_result.predicted_class,
                ai_result.confidence,
                ai_result.probabilities,
                ai_result.disease_information,
                getattr(ai_result, "model_version", None),
                getattr(ai_result, "engine_version", None),
                getattr(ai_result, "inference_time", None),
                getattr(ai_result, "metadata", {}),
            )
        return (
            ai_result.get("predicted_class"),
            ai_result.get("confidence"),
            ai_result.get("probabilities", {}),
            ai_result.get("disease_information", {}),
            ai_result.get("model_version"),
            ai_result.get("engine_version"),
            ai_result.get("inference_time"),
            ai_result.get("metadata", {}),
        )

    @staticmethod
    def _to_response(item, *, report_url=None, has_report=False) -> DiagnosticResponse:
        return DiagnosticResponse(
            id=item.id,
            prediction=item.prediction,
            confidence=item.confidence,
            image_path=item.image_path,
            notes=item.notes,
            created_at=item.created_at.isoformat(),
            probabilities=item.probabilities,
            disease_information=item.disease_information,
            model_version=None,
            engine_version=None,
            inference_time=None,
            metadata=None,
            patient_id=item.patient_id,
            patient=item.patient_snapshot,
            report_url=report_url,
            has_report=has_report,
        )
