"""
=================================================
Inference Core Package
=================================================

Public API for the Inference Engine.

This package contains the core functionality
required to perform AI inference.

=================================================
"""

# =========================================================
# Model Loader
# =========================================================

from .loader import (
    find_model,
    load_model,
    get_model,
    unload_model,
    is_model_loaded,
    get_model_info,
)

# =========================================================
# Image Preprocessing
# =========================================================

from .preprocessing import (
    preprocess_image,
)

# =========================================================
# Prediction
# =========================================================

from .predictor import (
    predict,
)

# =========================================================
# Postprocessing
# =========================================================

from .postprocessing import (
    postprocess,
)

# =========================================================
# Public Exports
# =========================================================

__all__ = [

    # -------------------------
    # Loader
    # -------------------------

    "find_model",
    "load_model",
    "get_model",
    "unload_model",
    "is_model_loaded",
    "get_model_info",

    # -------------------------
    # Preprocessing
    # -------------------------

    "preprocess_image",

    # -------------------------
    # Prediction
    # -------------------------

    "predict",

    # -------------------------
    # Postprocessing
    # -------------------------

    "postprocess",

]