from sqlalchemy.orm import Session

from app.models.patient import Patient


class PatientRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, patient: Patient) -> Patient:
        self.db.add(patient)
        self.db.commit()
        self.db.refresh(patient)
        return patient

    def get_for_user(self, patient_id: int, user_id: int) -> Patient | None:
        return self.db.query(Patient).filter(Patient.id == patient_id, Patient.user_id == user_id).first()

    def list_for_user(self, user_id: int) -> list[Patient]:
        return self.db.query(Patient).filter(Patient.user_id == user_id).order_by(Patient.created_at.desc()).all()
