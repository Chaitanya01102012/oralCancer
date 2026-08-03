"""
=================================================
Module Name: paths.py
=================================================

Description:
Defines all filesystem paths used throughout
the project.

=================================================
"""

from pathlib import Path

# ===========================
# Project Root
# ===========================

PROJECT_ROOT = Path(__file__).resolve().parents[1]

# ===========================
# Data
# ===========================

DATA_DIR = PROJECT_ROOT / 'data'
DATASET_DIR = PROJECT_ROOT / 'dataset'

TRAIN_DIR = DATASET_DIR / 'train'
VALID_DIR = DATASET_DIR / 'valid'
TEST_DIR = DATASET_DIR / 'test'

# ===========================
# Archive
# ===========================

ARCHIVE_DIR = PROJECT_ROOT / 'archive'

# ===========================
# Temporary Images
# ===========================

TEMP_IMAGES_DIR = ARCHIVE_DIR / "temp_images"

# ===========================
# Models
# ===========================

MODELS_DIR = PROJECT_ROOT / 'models'

CHECKPOINT_DIR = MODELS_DIR / 'checkpoints'

BEST_MODEL_DIR = MODELS_DIR / 'best_model'
FINAL_MODEL_DIR = MODELS_DIR / 'final_model'

# Model Files
BEST_MODEL_PATH = BEST_MODEL_DIR / 'best_model.keras'
FINAL_MODEL_PATH = FINAL_MODEL_DIR / 'final_model.keras'
# ===========================
# Logs
# ===========================

LOGS_DIR = PROJECT_ROOT / 'logs'

# ===========================
# Outputs
# ===========================

OUTPUT_DIR = PROJECT_ROOT / 'outputs'
CONFUSION_MATRIX_DIR = OUTPUT_DIR / 'confusion_matrix'
CLASSIFICATION_REPORT_DIR = OUTPUT_DIR / 'classification_reports'
TRAINING_CURVES_DIR = OUTPUT_DIR / 'training_curves'
GRADCAM_DIR = OUTPUT_DIR / 'gradcam'
SAMPLE_PREDICTIONS_DIR = OUTPUT_DIR / 'sample_predictions'
MISCLASSIFIED_IMAGES_DIR = OUTPUT_DIR / 'misclassified_images'
