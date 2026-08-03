"""
=================================================
Module Name: raw_prediction.py
=================================================

Description:
Raw prediction schema returned directly
from the TensorFlow model.

=================================================
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Dict

import numpy as np


# =========================================================
# Raw Prediction Schema
# =========================================================

@dataclass(slots=True)
class RawPrediction:
    """
    Raw prediction returned directly from
    TensorFlow before any postprocessing.
    """

    probabilities: np.ndarray

    inference_time: float

    metadata: Dict[str, Any] = field(default_factory=dict)