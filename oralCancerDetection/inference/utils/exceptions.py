"""
=================================================
Module Name: exceptions.py
=================================================

Description:
Custom exception classes used throughout the
Inference Engine.

Using custom exceptions provides:

• Clear error messages
• Easier debugging
• Better FastAPI integration
• Cleaner code

=================================================
"""

from __future__ import annotations


# =========================================================
# Base Exception
# =========================================================

class InferenceError(Exception):
    """
    Base class for all inference-related exceptions.
    """

    pass


# =========================================================
# Model Exceptions
# =========================================================

class ModelNotLoadedError(InferenceError):
    """
    Raised when the AI model has not been loaded.
    """

    pass


# =========================================================
# Image Exceptions
# =========================================================

class InvalidImageError(InferenceError):
    """
    Raised when the uploaded image is invalid or corrupted.
    """

    pass


class UnsupportedImageFormatError(InferenceError):
    """
    Raised when the uploaded image format is not supported.
    """

    pass


class ImageReadError(InferenceError):
    """
    Raised when an image cannot be read from disk.
    """

    pass


# =========================================================
# Processing Exceptions
# =========================================================

class PreprocessingError(InferenceError):
    """
    Raised when preprocessing fails.
    """

    pass


class PredictionError(InferenceError):
    """
    Raised when model prediction fails.
    """

    pass


class PostprocessingError(InferenceError):
    """
    Raised when prediction postprocessing fails.
    """

    pass