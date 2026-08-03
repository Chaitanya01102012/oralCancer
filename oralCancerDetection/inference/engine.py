"""
=================================================
Module Name: engine.py
=================================================

Description:
Main Inference Engine for the Oral Cancer
Classification System.

This module serves as the public entry point
to the AI engine.

Responsibilities
----------------
• Verify engine readiness
• Execute the complete inference pipeline
• Return structured prediction results

=================================================
"""

from __future__ import annotations

from pathlib import Path
from typing import Union

from PIL import Image

from inference.core import (
    preprocess_image,
    predict,
    postprocess,
    is_model_loaded,
    load_model,
)

from inference.schemas import PredictionResult


# =========================================================
# Type Alias
# =========================================================

ImageInput = Union[
    str,
    Path,
    Image.Image,
]


# =========================================================
# Engine Status
# =========================================================

def is_engine_ready() -> bool:
    try:
        if not is_model_loaded():
            print("Loading model...")
            load_model()
            print("Model loaded successfully.")

        return True

    except Exception as e:
        import traceback

        print("\n========== MODEL LOAD ERROR ==========")
        traceback.print_exc()
        print("======================================\n")

        return False

# =========================================================
# Analyze Image
# =========================================================

def analyze_image(
    image: ImageInput,
) -> PredictionResult:
    """
    Execute the complete inference pipeline.

    Parameters
    ----------
    image
        Input image.

    Returns
    -------
    PredictionResult
    """

    if not is_engine_ready():

        raise RuntimeError(
            "Inference Engine is not ready."
        )

    # -------------------------------------------------
    # Preprocessing
    # -------------------------------------------------

    processed_image = preprocess_image(
        image
    )

    # -------------------------------------------------
    # Prediction
    # -------------------------------------------------

    raw_prediction = predict(
        processed_image
    )

    # -------------------------------------------------
    # Postprocessing
    # -------------------------------------------------

    prediction = postprocess(
        raw_prediction
    )

    return prediction