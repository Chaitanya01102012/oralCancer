from pydantic import BaseModel


class DashboardSummaryResponse(BaseModel):
    total_diagnostics: int
    recent_diagnostics: int
    latest_prediction: str | None = None
