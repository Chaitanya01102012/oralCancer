"""
=================================================
Module Name: metadata.py
=================================================

Description:
Metadata for the Oral Cancer Diagnostic AI
Inference Engine.

This module contains application information,
engine information, project information,
and model metadata.

=================================================
"""

from __future__ import annotations

# =========================================================
# Application Information
# =========================================================

APPLICATION_NAME = "Oral Cancer Diagnostic AI"

APPLICATION_VERSION = "1.0.0"

APPLICATION_DESCRIPTION = (
    "AI-powered web application for oral lesion "
    "classification and diagnosis."
)

# =========================================================
# Inference Engine Information
# =========================================================

ENGINE_NAME = "Inference Engine"

ENGINE_VERSION = "1.0.0"

ENGINE_DESCRIPTION = (
    "Production inference engine responsible for "
    "loading the AI model, preprocessing images, "
    "performing predictions and returning standardized results."
)

# =========================================================
# Model Information
# =========================================================

MODEL_VERSION = "E002V2"

MODEL_CATEGORY = "Image Classification"

MODEL_STATUS = "Production"

# =========================================================
# Project Information
# =========================================================

PROJECT_NAME = "Oral Cancer Detection"


COPYRIGHT = "© 2026 Oral Cancer Detection Project"

LICENSE = "Academic Research"

# =========================================================
# Public Exports
# =========================================================

__all__ = [

    "APPLICATION_NAME",
    "APPLICATION_VERSION",
    "APPLICATION_DESCRIPTION",

    "ENGINE_NAME",
    "ENGINE_VERSION",
    "ENGINE_DESCRIPTION",

    "MODEL_VERSION",
    "MODEL_CATEGORY",
    "MODEL_STATUS",

    "PROJECT_NAME",
    "COPYRIGHT",
    "LICENSE",
]