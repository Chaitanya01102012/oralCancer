"""
=================================================
Module Name: loader.py
=================================================

Description:
Production Model Loader for the Inference Engine.

Responsibilities
----------------
• Discover the production model
• Load the model into memory
• Cache the loaded model
• Provide access to the cached model
• Return model metadata

Notes
-----
This module uses lazy loading.

The first call to get_model() automatically loads
the model. Subsequent calls reuse the cached model.

=================================================
"""

from __future__ import annotations

from pathlib import Path
from typing import Optional

import tensorflow as tf

from inference.config import (
    MODEL_VERSION,
    MODEL_CATEGORY,
    ENGINE_VERSION,
)

# =========================================================
# Model Directory
# =========================================================

MODEL_DIRECTORY = (
    Path(__file__).resolve().parent.parent
    / "model"
)

# =========================================================
# Cached Objects
# =========================================================

_MODEL: Optional[tf.keras.Model] = None

_MODEL_PATH: Optional[Path] = None


# =========================================================
# Find Model
# =========================================================

def find_model() -> Path:
    """
    Locate the production model.

    Returns
    -------
    Path
        Path to the production model.

    Raises
    ------
    FileNotFoundError
        If no .keras model exists.

    RuntimeError
        If multiple .keras models exist.
    """

    model_files = sorted(
        MODEL_DIRECTORY.glob("*.keras")
    )

    if not model_files:

        raise FileNotFoundError(
            f"No .keras model found in:\n{MODEL_DIRECTORY}"
        )

    if len(model_files) > 1:

        raise RuntimeError(
            "Multiple .keras models detected.\n"
            "Keep only one production model "
            "inside the model directory."
        )

    return model_files[0]


# =========================================================
# Load Model
# =========================================================

def load_model() -> tf.keras.Model:
    """
    Load the production model into memory.

    Returns
    -------
    tf.keras.Model
        Loaded TensorFlow model.
    """

    global _MODEL
    global _MODEL_PATH

    if _MODEL is None:

        _MODEL_PATH = find_model()

        _MODEL = tf.keras.models.load_model(
            _MODEL_PATH,
            compile=False,
        )

    return _MODEL


# =========================================================
# Get Model
# =========================================================

def get_model() -> tf.keras.Model:
    """
    Return the cached model.

    If the model has not been loaded yet,
    it is automatically loaded.

    Returns
    -------
    tf.keras.Model
        Loaded TensorFlow model.
    """

    if _MODEL is None:

        return load_model()

    return _MODEL


# =========================================================
# Model Status
# =========================================================

def is_model_loaded() -> bool:
    """
    Check whether the model is loaded.

    Returns
    -------
    bool
    """

    return _MODEL is not None


# =========================================================
# Unload Model
# =========================================================

def unload_model() -> None:
    """
    Remove the cached model from memory.
    """

    global _MODEL
    global _MODEL_PATH

    _MODEL = None
    _MODEL_PATH = None


# =========================================================
# Model Path
# =========================================================

def get_model_path() -> Optional[Path]:
    """
    Return the path of the loaded model.
    """

    return _MODEL_PATH


# =========================================================
# Model Information
# =========================================================

def get_model_info() -> dict:
    """
    Return model metadata.
    """

    return {

        "inference_ready": is_model_loaded(),

        "model_loaded": is_model_loaded(),

        "model_version": MODEL_VERSION,

        "model_category": MODEL_CATEGORY,

        "engine_version": ENGINE_VERSION,

        "model_path": (
            str(_MODEL_PATH)
            if _MODEL_PATH
            else None
        ),
    }