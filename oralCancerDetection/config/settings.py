"""
=================================================
Module Name: settings.py
=================================================

Description:
General project configuration settings.

=================================================
"""

# ===========================
# Random Seed
# ===========================

SEED = 42

# ===========================
# Dataset Split
# ===========================

TRAIN_SPLIT = 0.70
VALID_SPLIT = 0.15
TEST_SPLIT = 0.15

# ===========================
# Image Settings
# ===========================

IMAGE_SIZE = (224, 224)

# ===========================
# Data Loading
# ===========================

BATCH_SIZE = 32
SHUFFLE_BUFFER_SIZE = 1000
AUTOTUNE = None

# ===========================
# Training
# ===========================

# Stage 1 (Frozen Backbone)
FREEZE_EPOCHS = 15

# Stage 2 (Fine-Tuning)
FINETUNE_EPOCHS = 20

# Total Epochs (for reference)
EPOCHS = FREEZE_EPOCHS + FINETUNE_EPOCHS
VERBOSE = 1
