from pydantic import BaseModel


class ReportResponse(BaseModel):
    id: int
    diagnostic_id: int
    report_url: str
    file_name: str
    created_at: str

    class Config:
        from_attributes = True
