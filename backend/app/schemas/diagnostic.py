from pydantic import BaseModel
from typing import Dict, Any


class PatientInfo(BaseModel):
    full_name: str | None = None
    email: str | None = None
    age: int | None = None
    gender: str | None = None
    phone_number: str | None = None
    tobacco_habit: bool | None = None
    alcohol_habit: bool | None = None
    clinical_notes: str | None = None


class DiagnosticCreateRequest(BaseModel):
    notes: str | None = None
    patient: PatientInfo | None = None

    model_config = {
        "extra": "forbid"
    }


class DiagnosticResponse(BaseModel):
    id: int
    prediction: str
    confidence: float
    image_path: str
    notes: str | None = None
    created_at: str

    # Enriched fields from the inference engine
    probabilities: Dict[str, float] | None = None
    disease_information: Dict[str, Any] | None = None
    model_version: str | None = None
    engine_version: str | None = None
    inference_time: float | None = None
    metadata: Dict[str, Any] | None = None

    # Patient snapshot and reference
    patient_id: int | None = None
    patient: PatientInfo | None = None

    # Linked report metadata
    report_url: str | None = None
    has_report: bool = False
