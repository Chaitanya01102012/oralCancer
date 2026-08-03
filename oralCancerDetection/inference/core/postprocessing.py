"""
=================================================
Module Name: postprocessing.py
=================================================

Description:
Postprocessing module for the Inference Engine.

Responsibilities
----------------
• Interpret raw model probabilities
• Determine predicted class
• Format confidence scores
• Attach disease information
• Return PredictionResult

=================================================
"""

from __future__ import annotations

import numpy as np

from inference.schemas import (
    RawPrediction,
    PredictionResult,
)

from inference.config import (
    CLASS_ID_TO_NAME,
    DISEASE_INFORMATION,
    MODEL_VERSION,
    ENGINE_VERSION,
    CONFIDENCE_DECIMALS,
)

# =========================================================
# Extract Probabilities
# =========================================================

def extract_probabilities(
    raw_prediction: RawPrediction,
) -> np.ndarray:
    """
    Return the probability vector.
    """

    return raw_prediction.probabilities[0]

# =========================================================
# Predicted Class
# =========================================================

def get_predicted_class(
    probabilities: np.ndarray,
):
    """
    Return predicted class index,
    class name and confidence.
    """

    predicted_index = int(np.argmax(probabilities))

    predicted_class = CLASS_ID_TO_NAME[predicted_index]
    confidence = float(
        probabilities[predicted_index] * 100
    )

    return (
        predicted_index,
        predicted_class,
        confidence,
    )

# =========================================================
# Probability Dictionary
# =========================================================

def build_probability_dictionary(
    probabilities: np.ndarray,
):
    """
    Convert probability vector into
    class -> probability dictionary.
    """

    probability_dict = {}

    for index, probability in enumerate(probabilities):

        probability_dict[
            CLASS_ID_TO_NAME[index]
        ] = round(
            float(probability * 100),
            CONFIDENCE_DECIMALS,
        )

    return probability_dict

# =========================================================
# Postprocess Prediction
# =========================================================

def postprocess(
    raw_prediction: RawPrediction,
) -> PredictionResult:
    """
    Convert RawPrediction into
    PredictionResult.
    """

    probabilities = extract_probabilities(
        raw_prediction
    )

    (
        predicted_index,
        predicted_class,
        confidence,
    ) = get_predicted_class(
        probabilities
    )

    probability_dict = build_probability_dictionary(
        probabilities
    )

    disease_information = DISEASE_INFORMATION[
        predicted_class
    ]

    return PredictionResult(

        predicted_class=predicted_class,

        confidence=round(
            confidence,
            CONFIDENCE_DECIMALS,
        ),

        probabilities=probability_dict,

        disease_information=disease_information,

        model_version=MODEL_VERSION,

        engine_version=ENGINE_VERSION,

        inference_time=raw_prediction.inference_time,

    )

