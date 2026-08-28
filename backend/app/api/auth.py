from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.dependencies.security import get_current_user
from app.models.user import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    LoginRequest,
    MessageResponse,
    RefreshTokenRequest,
    RegisterRequest,
    ResetPasswordRequest,
    VerifyOtpRequest,
)
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=MessageResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> MessageResponse:
    service = AuthService(db)
    service.register(payload)
    return MessageResponse(success=True, message="Registration successful", data={})


@router.post("/login", response_model=MessageResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> MessageResponse:
    service = AuthService(db)
    tokens = service.login(payload)
    return MessageResponse(success=True, message="Login successful", data=tokens.model_dump())


@router.post("/refresh", response_model=MessageResponse)
def refresh(payload: RefreshTokenRequest, db: Session = Depends(get_db)) -> MessageResponse:
    service = AuthService(db)
    tokens = service.refresh(payload.refresh_token)
    return MessageResponse(success=True, message="Token refreshed", data=tokens.model_dump())


@router.post("/logout", response_model=MessageResponse)
def logout(payload: RefreshTokenRequest, db: Session = Depends(get_db)) -> MessageResponse:
    service = AuthService(db)
    service.logout(payload.refresh_token)
    return MessageResponse(success=True, message="Logged out", data={})


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)) -> MessageResponse:
    service = AuthService(db)
    service.request_password_reset(str(payload.email))
    return MessageResponse(success=True, message="If an account exists with this email, a reset code has been sent.", data={})


@router.post("/verify-otp", response_model=MessageResponse)
def verify_otp(payload: VerifyOtpRequest, db: Session = Depends(get_db)) -> MessageResponse:
    service = AuthService(db)
    service.verify_otp(str(payload.email), payload.otp_code)
    return MessageResponse(success=True, message="OTP verified successfully", data={})


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)) -> MessageResponse:
    service = AuthService(db)
    service.reset_password(str(payload.email), payload.otp_code, payload.new_password)
    return MessageResponse(success=True, message="Password reset successful. You can now login with your new password.", data={})


@router.get("/me", response_model=MessageResponse)
def current_user(current_user: User = Depends(get_current_user)) -> MessageResponse:
    return MessageResponse(success=True, message="User profile loaded", data={"id": current_user.id, "email": current_user.email, "full_name": current_user.full_name})
