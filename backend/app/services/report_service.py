import math
from io import BytesIO
from pathlib import Path

import httpx
from fastapi import HTTPException, status
from fastapi.responses import Response
from reportlab.lib.colors import Color, HexColor
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

from app.config.settings import settings
from app.integrations.storage.storage_service import StorageService
from app.models.report import Report
from app.repositories.diagnostic_repository import DiagnosticRepository
from app.repositories.report_repository import ReportRepository

ASSETS_DIR = Path(__file__).resolve().parent.parent / "assets"
LOGO_PATH = ASSETS_DIR / "logo.jpg"

BRAND_DARK = HexColor("#1a3c7d")
BRAND_PRIMARY = HexColor("#1d4ed8")
BRAND_LIGHT = HexColor("#6d9eff")
BRAND_PALE = HexColor("#dbeafe")
LINE_GRAY = HexColor("#e2e8f0")
TEXT_DARK = HexColor("#1e293b")
TEXT_MED = HexColor("#475569")
TEXT_LIGHT = HexColor("#94a3b8")


class ReportService:
    def __init__(self, db):
        self.diagnostic_repository = DiagnosticRepository(db)
        self.report_repository = ReportRepository(db)
        self.storage_service = StorageService()

    def create_report_for_diagnostic(self, diagnostic_id: int, user_id: int) -> Report:
        existing = self.report_repository.get_by_diagnostic(diagnostic_id, user_id)
        if existing:
            return existing

        diagnostic = self.diagnostic_repository.get_for_user(diagnostic_id, user_id)
        if not diagnostic:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Diagnostic not found")

        file_name = f"report_{diagnostic.id}.pdf"
        reports_dir = Path(settings.UPLOAD_DIR) / "reports"
        reports_dir.mkdir(parents=True, exist_ok=True)
        local_path = reports_dir / file_name

        self._write_pdf(local_path, diagnostic)
        report_url = self.storage_service.upload_report(str(local_path), file_name)

        report = Report(
            user_id=user_id,
            diagnostic_id=diagnostic.id,
            report_url=report_url,
            file_name=file_name,
        )
        return self.report_repository.create(report)

    def generate_report(self, diagnostic_id: int, user_id: int) -> Response:
        report = self.report_repository.get_by_diagnostic(diagnostic_id, user_id)
        if not report:
            report = self.create_report_for_diagnostic(diagnostic_id, user_id)

        content = self._load_report_bytes(report.report_url, report.file_name)
        return Response(
            content=content,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={report.file_name}"},
        )

    def delete_report_for_diagnostic(self, diagnostic_id: int, user_id: int) -> None:
        report = self.report_repository.get_by_diagnostic(diagnostic_id, user_id)
        if not report:
            return
        self.storage_service.delete_report(report.report_url)
        self.report_repository.delete(report)

    # ── PDF helpers ──────────────────────────────────────────────

    @staticmethod
    def _draw_background(pdf, w, h):
        """Draw decorative radial fan lines and bottom-right wave."""
        pdf.saveState()

        # Radial fan – top-left
        cx, cy = -40, h + 40
        pdf.setStrokeColor(Color(0.78, 0.89, 0.97, 0.35))
        pdf.setLineWidth(0.4)
        for angle_deg in range(200, 310, 4):
            rad = math.radians(angle_deg)
            pdf.line(cx, cy, cx + math.cos(rad) * 420, cy + math.sin(rad) * 420)

        # Radial fan – bottom-left (lighter, shorter)
        cx2, cy2 = 60, 80
        pdf.setStrokeColor(Color(0.78, 0.89, 0.97, 0.22))
        for angle_deg in range(240, 340, 5):
            rad = math.radians(angle_deg)
            pdf.line(cx2, cy2, cx2 + math.cos(rad) * 320, cy2 + math.sin(rad) * 320)

        # Full-width bottom wave
        pdf.setLineWidth(0)
        wave_layers = [
            (Color(0.42, 0.68, 1.0, 0.35), 95),
            (Color(0.22, 0.50, 0.95, 0.55), 65),
            (Color(0.11, 0.31, 0.85, 0.85), 35),
        ]
        for clr, base in wave_layers:
            p = pdf.beginPath()
            p.moveTo(0, 0)
            p.lineTo(0, base + 10)
            p.curveTo(w * 0.15, base + 40, w * 0.30, base - 10, w * 0.45, base + 15)
            p.curveTo(w * 0.60, base + 40, w * 0.75, base - 5, w * 0.90, base + 25)
            p.curveTo(w * 0.95, base + 35, w, base + 50, w, base + 60)
            p.lineTo(w, 0)
            p.close()
            pdf.setFillColor(clr)
            pdf.drawPath(p, fill=1, stroke=0)

        pdf.restoreState()

    @staticmethod
    def _draw_header(pdf, w, h):
        """Draw the logo image and title."""
        if LOGO_PATH.exists():
            pdf.drawImage(
                str(LOGO_PATH),
                x=50, y=h - 90,
                width=160, height=55,
                preserveAspectRatio=True,
                mask="auto",
            )

        pdf.setFillColor(BRAND_PRIMARY)
        pdf.setFont("Helvetica-Bold", 16)
        pdf.drawRightString(w - 50, h - 55, "Oral Cancer")
        pdf.setFont("Helvetica", 13)
        pdf.setFillColor(BRAND_LIGHT)
        pdf.drawRightString(w - 50, h - 73, "Diagnostic Report")

        # Separator line
        pdf.setStrokeColor(LINE_GRAY)
        pdf.setLineWidth(0.8)
        pdf.line(50, h - 100, w - 50, h - 100)

    def _draw_patient_info(self, pdf, w, h, diagnostic):
        """Render patient details and the diagnostic image side by side."""
        left = 65
        y_start = h - 140
        y = y_start

        patient = getattr(diagnostic, "patient", None)
        patient_snapshot = getattr(diagnostic, "patient_snapshot", None)
        if patient:
            name = patient.full_name or "N/A"
            # email = patient.email or ""
            age = str(patient.age) if patient.age is not None else "N/A"
            gender = patient.gender or "N/A"
        elif patient_snapshot:
            name = patient_snapshot.get("full_name") or "N/A"
            # email = patient_snapshot.get("email") or ""
            age = str(patient_snapshot.get("age")) if patient_snapshot.get("age") is not None else "N/A"
            gender = patient_snapshot.get("gender") or "N/A"
        else:
            name = age = gender = None

        # confidence = float(diagnostic.confidence)
        # confidence_pct = confidence * 100 if confidence <= 1 else confidence

        created = diagnostic.created_at.strftime("%B %d, %Y  %I:%M %p") if diagnostic.created_at else "N/A"

        rows: list[tuple[str, str]] = []
        if name:
            rows.append(("Name", name))
            # if email:
            #     rows.append(("Email", email))
            rows.append(("Age", age))
            rows.append(("Gender", gender))
        rows.append(("Diagnostic", diagnostic.prediction))
        # rows.append(("Confidence", f"{confidence_pct:.2f}%"))
        # rows.append(("Notes", diagnostic.notes or "N/A"))
        rows.append(("Date", created))

        # Draw the diagnostic image on the right side
        image_path = getattr(diagnostic, "image_path", None)
        img_file = Path(image_path) if image_path else None
        has_image = img_file and img_file.exists()

        img_w = 180
        img_h = 180
        if has_image:
            img_x = w - 50 - img_w
            img_y = y_start - img_h + 12

            pdf.setStrokeColor(LINE_GRAY)
            pdf.setLineWidth(0.6)
            pdf.roundRect(img_x - 4, img_y - 4, img_w + 8, img_h + 8, 6, stroke=1, fill=0)

            pdf.drawImage(
                str(img_file),
                x=img_x, y=img_y,
                width=img_w, height=img_h,
                preserveAspectRatio=True,
                mask="auto",
            )

        label_x = left
        value_x = left + 130

        for label, value in rows:
            pdf.setFont("Helvetica-Bold", 11)
            pdf.setFillColor(TEXT_LIGHT)
            pdf.drawString(label_x, y, label)

            pdf.setFont("Helvetica", 11)
            pdf.setFillColor(TEXT_DARK)
            pdf.drawString(value_x, y, str(value))

            pdf.setStrokeColor(Color(0.85, 0.87, 0.90, 0.6))
            pdf.setLineWidth(0.3)
            pdf.setDash(1, 3)
            leader_start = label_x + pdf.stringWidth(label, "Helvetica-Bold", 11) + 6
            leader_end = value_x - 8
            if leader_end > leader_start:
                pdf.line(leader_start, y + 3, leader_end, y + 3)
            pdf.setDash()

            y -= 28

        if has_image:
            y = min(y, img_y - 10)

        return y

    @staticmethod
    def _draw_footer(pdf, w):
        """Disclaimer footer above the wave."""
        pdf.setFont("Helvetica", 8)
        pdf.setFillColor(TEXT_LIGHT)
        pdf.drawString(50, 145, "Disclaimer: This report is for screening assistance only. Consult a")
        pdf.drawString(50, 134, "qualified healthcare professional for confirmation.")

    def _write_pdf(self, path: Path, diagnostic) -> None:
        buffer = BytesIO()
        w, h = letter
        pdf = canvas.Canvas(buffer, pagesize=letter)
        pdf.setTitle("Oral Cancer Diagnostic Report")

        self._draw_background(pdf, w, h)
        self._draw_header(pdf, w, h)
        self._draw_patient_info(pdf, w, h, diagnostic)
        self._draw_footer(pdf, w)

        pdf.save()
        buffer.seek(0)
        path.write_bytes(buffer.getvalue())

    def _load_report_bytes(self, report_url: str, file_name: str | None = None) -> bytes:
        if report_url.startswith("http://") or report_url.startswith("https://"):
            download_url = report_url
            if settings.CLOUDINARY_CLOUD_NAME and settings.CLOUDINARY_API_KEY and settings.CLOUDINARY_API_SECRET:
                try:
                    import cloudinary
                    import cloudinary.utils
                    cloudinary.config(
                        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
                        api_key=settings.CLOUDINARY_API_KEY,
                        api_secret=settings.CLOUDINARY_API_SECRET,
                        secure=settings.CLOUDINARY_SECURE,
                    )
                    public_id = file_name or report_url.split("/")[-1]
                    fmt = public_id.split(".")[-1] if "." in public_id else "pdf"
                    download_url = cloudinary.utils.private_download_url(
                        public_id,
                        fmt,
                        type="upload",
                        resource_type="raw",
                    )
                except Exception:
                    pass

            response = httpx.get(download_url, timeout=30.0)
            if response.status_code != 200:
                raise HTTPException(
                    status_code=status.HTTP_502_BAD_GATEWAY,
                    detail="Failed to download report from storage",
                )
            return response.content

        path = Path(report_url)
        if not path.exists():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Report file not found")
        return path.read_bytes()
