from app.models.patient import Patient
from app.repositories.patient_repository import PatientRepository


class PatientService:
    def __init__(self, db):
        self.repository = PatientRepository(db)

    def create_patient(self, user_id: int, patient_data: dict) -> Patient:
        patient = Patient(
            user_id=user_id,
            full_name=patient_data.get("full_name"),
            email=patient_data.get("email"),
            age=patient_data.get("age"),
            gender=patient_data.get("gender"),
            phone_number=patient_data.get("phone_number"),
            tobacco_habit=patient_data.get("tobacco_habit"),
            alcohol_habit=patient_data.get("alcohol_habit"),
            clinical_notes=patient_data.get("clinical_notes"),
        )
        return self.repository.create(patient)
