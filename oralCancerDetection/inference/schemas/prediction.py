"""
=================================================
Module Name: prediction.py
=================================================

Description:
Prediction schema used throughout the
Inference Engine.

=================================================
"""

from __future__ import annotations

from dataclasses import dataclass, field, asdict
from typing import Dict, Any
import json


# =========================================================
# Prediction Result Schema
# =========================================================

@dataclass(slots=True)
class PredictionResult:
    """
    Standard prediction object returned by
    the inference engine after postprocessing.
    """

    # -----------------------------------------------------
    # Prediction
    # -----------------------------------------------------

    predicted_class: str

    confidence: float

    probabilities: Dict[str, float]

    # -----------------------------------------------------
    # Disease Information
    # -----------------------------------------------------

    disease_information: Dict[str, str]

    # -----------------------------------------------------
    # Model Information
    # -----------------------------------------------------

    model_version: str

    engine_version: str

    # -----------------------------------------------------
    # Performance
    # -----------------------------------------------------

    inference_time: float

    # -----------------------------------------------------
    # Additional Metadata
    # -----------------------------------------------------

    metadata: Dict[str, Any] = field(default_factory=dict)

    # =====================================================
    # Helper Methods
    # =====================================================

    def to_dict(self) -> Dict[str, Any]:
        """
        Convert PredictionResult into a dictionary.
        """

        return asdict(self)

    def to_json(self) -> str:
        """
        Convert PredictionResult into a JSON string.
        """

        return json.dumps(
            self.to_dict(),
            indent=4,
        )

    def __str__(self) -> str:
        """
        Human-readable summary.
        """

        return (
            f"PredictionResult("
            f"class='{self.predicted_class}', "
            f"confidence={self.confidence:.2f}%, "
            f"time={self.inference_time:.3f}s)"
        )