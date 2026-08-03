from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
def health_check():
    return {"success": True, "message": "Server is healthy", "data": {"status": "ok"}}
