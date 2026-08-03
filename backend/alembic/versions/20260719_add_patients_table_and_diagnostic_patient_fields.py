from alembic import op
import sqlalchemy as sa

revision = "c3d4e5f6a7b8"
down_revision = "b2c3d4e5f6a7"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "patients",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("user_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False, index=True),
        sa.Column("full_name", sa.String(length=255), nullable=True),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("age", sa.Integer(), nullable=True),
        sa.Column("gender", sa.String(length=50), nullable=True),
        sa.Column("phone_number", sa.String(length=50), nullable=True),
        sa.Column("tobacco_habit", sa.Boolean(), nullable=True),
        sa.Column("alcohol_habit", sa.Boolean(), nullable=True),
        sa.Column("clinical_notes", sa.String(length=2000), nullable=True),
        sa.Column("created_at", sa.DateTime(), nullable=True),
    )

    op.add_column("diagnostics", sa.Column("patient_id", sa.Integer(), nullable=True))
    op.create_foreign_key(
        "fk_diagnostics_patient_id",
        "diagnostics",
        "patients",
        ["patient_id"],
        ["id"],
    )
    op.add_column("diagnostics", sa.Column("patient_snapshot", sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column("diagnostics", "patient_snapshot")
    op.drop_constraint("fk_diagnostics_patient_id", "diagnostics", type_="foreignkey")
    op.drop_column("diagnostics", "patient_id")
    op.drop_table("patients")
