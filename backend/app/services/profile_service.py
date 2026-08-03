from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.profile import ProfileUpdateRequest


class ProfileService:
    def __init__(self, db: Session):
        self.user_repository = UserRepository(db)

    def get_profile(self, user: User) -> dict:
        return {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "age": user.age,
            "gender": user.gender,
            "phone_number": user.phone_number,
            "tobacco_habit": user.tobacco_habit,
            "alcohol_habit": user.alcohol_habit,
            "clinical_notes": user.clinical_notes,
        }

    def update_profile(self, user: User, payload: ProfileUpdateRequest) -> dict:
        if payload.full_name is not None:
            user.full_name = payload.full_name
        if payload.age is not None:
            user.age = payload.age
        if payload.gender is not None:
            user.gender = payload.gender
        if payload.phone_number is not None:
            user.phone_number = payload.phone_number
        if payload.email is not None:
            existing = self.user_repository.get_by_email(str(payload.email))
            if existing and existing.id != user.id:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
            user.email = str(payload.email)
        if payload.tobacco_habit is not None:
            user.tobacco_habit = payload.tobacco_habit
        if payload.alcohol_habit is not None:
            user.alcohol_habit = payload.alcohol_habit
        if payload.clinical_notes is not None:
            user.clinical_notes = payload.clinical_notes

        self.user_repository.update(user)
        return self.get_profile(user)
