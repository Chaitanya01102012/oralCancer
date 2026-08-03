"""Ensure diagnostics table has patient_id and patient_snapshot columns.

Run with the backend venv python:
  .venv\Scripts\python.exe scripts\ensure_diagnostic_columns.py
"""
import os
import sys
from sqlalchemy import create_engine, text

# ensure the backend package is importable when running as a script
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
from app.config.settings import settings


def main():
    engine = create_engine(settings.DATABASE_URL)
    dialect = engine.dialect.name
    with engine.connect() as conn:
        if dialect == "postgresql":
            conn.execute(text(
                """
                DO $$
                BEGIN
                    IF NOT EXISTS (
                        SELECT 1 FROM information_schema.columns
                        WHERE table_name='diagnostics' AND column_name='patient_id'
                    ) THEN
                        ALTER TABLE diagnostics ADD COLUMN patient_id INTEGER;
                    END IF;
                    IF NOT EXISTS (
                        SELECT 1 FROM information_schema.columns
                        WHERE table_name='diagnostics' AND column_name='patient_snapshot'
                    ) THEN
                        ALTER TABLE diagnostics ADD COLUMN patient_snapshot JSON;
                    END IF;
                    IF NOT EXISTS (
                        SELECT 1 FROM pg_constraint WHERE conname='fk_diagnostics_patient_id'
                    ) THEN
                        ALTER TABLE diagnostics ADD CONSTRAINT fk_diagnostics_patient_id FOREIGN KEY (patient_id) REFERENCES patients (id);
                    END IF;
                END$$;
                """
            ))
            print("Postgres: ensured columns and FK")
        else:
            # sqlite and others: try add columns, ignore errors
            try:
                conn.execute(text("ALTER TABLE diagnostics ADD COLUMN patient_id INTEGER"))
            except Exception:
                pass
            try:
                conn.execute(text("ALTER TABLE diagnostics ADD COLUMN patient_snapshot JSON"))
            except Exception:
                try:
                    conn.execute(text("ALTER TABLE diagnostics ADD COLUMN patient_snapshot TEXT"))
                except Exception:
                    pass
            print(f"{dialect}: attempted to ensure columns")


if __name__ == "__main__":
    main()
