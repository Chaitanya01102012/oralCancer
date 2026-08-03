from alembic import op
import sqlalchemy as sa

revision = "b2c3d4e5f6a7"
down_revision = "a1b2c3d4e5f6"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("diagnostics", sa.Column("probabilities", sa.JSON(), nullable=True))
    op.add_column("diagnostics", sa.Column("disease_information", sa.JSON(), nullable=True))


def downgrade() -> None:
    op.drop_column("diagnostics", "disease_information")
    op.drop_column("diagnostics", "probabilities")
