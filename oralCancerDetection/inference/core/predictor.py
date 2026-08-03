"""
=================================================
Module Name: predictor.py
=================================================

Description:
TensorFlow prediction module for the
Inference Engine.

Responsibilities
----------------
• Retrieve the cached model
• Run TensorFlow inference
• Measure inference time
• Return RawPrediction

=================================================
"""

from __future__ import annotations

import time
import numpy as np

from inference.core.loader import get_model
from inference.schemas import RawPrediction


# =========================================================
# Predict
# =========================================================

def predict(
    image: np.ndarray,
) -> RawPrediction:
    """
    Perform TensorFlow inference on a preprocessed image.

    Parameters
    ----------
    image : np.ndarray
        Preprocessed image of shape
        (1, H, W, C).

    Returns
    -------
    RawPrediction
    """

    # -----------------------------------------------------
    # Input Validation
    # -----------------------------------------------------

    if not isinstance(image, np.ndarray):
        raise TypeError(
            "Expected input type 'numpy.ndarray'."
        )

    if image.dtype != np.float32:
        raise TypeError(
            "Expected image dtype 'float32'."
        )

    if image.ndim != 4:
        raise ValueError(
            "Expected image shape (batch, height, width, channels)."
        )

    # -----------------------------------------------------
    # Load Cached Model
    # -----------------------------------------------------

    model = get_model()

    # -----------------------------------------------------
    # Run Inference
    # -----------------------------------------------------

    start_time = time.perf_counter()

    probabilities = model.predict(
        image,
        verbose=0,
    )

    end_time = time.perf_counter()

    inference_time = end_time - start_time

    # -----------------------------------------------------
    # Return Raw Prediction
    # -----------------------------------------------------

    return RawPrediction(
        probabilities=probabilities,
        inference_time=inference_time,
    )