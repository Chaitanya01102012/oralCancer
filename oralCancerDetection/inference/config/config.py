"""
=================================================
Module Name: config.py
=================================================

Description:
Central configuration for the Inference Engine.

This module defines how the inference engine
behaves during prediction.

It contains:

• Image configuration
• Prediction configuration
• File handling
• Performance settings
• Logging configuration

=================================================
"""

from __future__ import annotations


# =========================================================
# Image Configuration
# =========================================================

# Expected model input size
IMAGE_SIZE = (224, 224)

# Number of image channels
IMAGE_CHANNELS = 3

# Expected image color format
COLOR_MODE = "RGB"

# Maximum upload size (MB)
MAX_IMAGE_SIZE_MB = 10

# Supported image extensions
SUPPORTED_EXTENSIONS = (
    ".jpg",
    ".jpeg",
    ".png",
    ".bmp",
    ".webp",
)


# =========================================================
# Prediction Configuration
# =========================================================

# Number of predictions to return
TOP_K_PREDICTIONS = 3

# Confidence precision
CONFIDENCE_DECIMALS = 2

# Convert confidence to percentage
PERCENTAGE_MULTIPLIER = 100

# Return class probabilities
RETURN_PROBABILITIES = True

# Return confidence score
RETURN_CONFIDENCE = True

# Return inference time
RETURN_INFERENCE_TIME = True

# Return model version
RETURN_MODEL_VERSION = True


# =========================================================
# File Configuration
# =========================================================

# Temporary upload folder
TEMP_FOLDER_NAME = "temp"

# Output folder
OUTPUT_FOLDER_NAME = "outputs"

# Heatmap folder
HEATMAP_FOLDER_NAME = "heatmaps"


# =========================================================
# Performance Configuration
# =========================================================

# Enable TensorFlow GPU
ENABLE_GPU = True

# Enable XLA compilation (future optimization)
ENABLE_XLA = False

# Number of inference threads
NUM_THREADS = 1


# =========================================================
# Feature Flags
# =========================================================

ENABLE_GRADCAM = False

ENABLE_BATCH_INFERENCE = False

ENABLE_MODEL_CACHE = True


# =========================================================
# Logging Configuration
# =========================================================

ENABLE_LOGGING = True

LOG_PREDICTIONS = True

LOG_ERRORS = True