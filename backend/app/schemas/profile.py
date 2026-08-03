from pydantic import BaseModel, EmailStr


class ProfileBase(BaseModel):
    full_name: str | None = None
    age: int | None = None
    gender: str | None = None
    phone_number: str | None = None
    email: EmailStr | None = None
    tobacco_habit: bool | None = None
    alcohol_habit: bool | None = None
    clinical_notes: str | None = None


class ProfileResponse(ProfileBase):
    id: int


class ProfileUpdateRequest(ProfileBase):
    pass
