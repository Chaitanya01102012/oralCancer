"""
=================================================
Inference Engine Package
=================================================
"""

from .engine import (
    analyze_image,
    is_engine_ready,
)

__all__ = [
    "analyze_image",
    "is_engine_ready",
]