from alembic import op
import sqlalchemy as sa

revision = "d4e5f6a7b8c9"
down_revision = "c3d4e5f6a7b8"
branch_labels = None
depends_on = None


def upgrade() -> None:
    conn = op.get_bind()
    dialect = conn.dialect.name
    if dialect == "postgresql":
        # add columns if they do not exist
        op.execute("""
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
        """)
    else:
        # Generic fallback: try adding columns (may error if already present)
        try:
            op.add_column("diagnostics", sa.Column("patient_id", sa.Integer(), nullable=True))
        except Exception:
            pass
        try:
            op.add_column("diagnostics", sa.Column("patient_snapshot", sa.JSON(), nullable=True))
        except Exception:
            pass


def downgrade() -> None:
    # No-op downgrade to avoid accidental data loss; keep columns if present.
    pass
