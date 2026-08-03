"""
=================================================
Module Name: preprocessing.py
=================================================

Description:
Image preprocessing pipeline for the
Inference Engine.

Responsibilities
----------------
• Validate image input
• Load image
• Standardize color space
• Resize image
• Convert image to NumPy
• Prepare TensorFlow batch

=================================================
"""

from __future__ import annotations

from pathlib import Path
from typing import Union

import numpy as np

from PIL import Image

from inference.config import (
    IMAGE_SIZE,
    COLOR_MODE,
    SUPPORTED_EXTENSIONS,
)

from inference.utils.exceptions import (
    InvalidImageError,
)

# =========================================================
# Type Alias
# =========================================================

ImageInput = Union[
    str,
    Path,
    Image.Image,
    np.ndarray,
]
# =========================================================
# Validate Extension
# =========================================================

def validate_image_extension(image_path: Path) -> None:
    """
    Validate image extension.
    """

    if image_path.suffix.lower() not in SUPPORTED_EXTENSIONS:

        raise InvalidImageError(
            f"Unsupported image format: {image_path.suffix}"
        )
    
# =========================================================
# Load Image
# =========================================================

def load_image(image: ImageInput) -> Image.Image:
    """
    Load an image from different input types.
    """

    if isinstance(image, Image.Image):

        return image

    if isinstance(image, np.ndarray):

        return Image.fromarray(image)

    image_path = Path(image)

    if not image_path.exists():

        raise FileNotFoundError(
            f"Image not found:\n{image_path}"
        )

    validate_image_extension(image_path)

    return Image.open(image_path)
# =========================================================
# Validate Image
# =========================================================

def validate_image(image: Image.Image) -> None:
    """
    Verify that image is readable.
    """

    try:
        image.load()

    except Exception as exc:
        raise InvalidImageError(
            "Corrupted or unreadable image."
        ) from exc
# =========================================================
# Convert RGB
# =========================================================

def convert_to_rgb(
    image: Image.Image,
) -> Image.Image:
    """
    Convert image to RGB.
    """

    if image.mode != COLOR_MODE:

        image = image.convert(COLOR_MODE)

    return image

# =========================================================
# Resize Image
# =========================================================

def resize_image(
    image: Image.Image,
) -> Image.Image:
    """
    Resize image.
    """

    return image.resize(IMAGE_SIZE)

# =========================================================
# Convert to NumPy
# =========================================================

def image_to_array(
    image: Image.Image,
) -> np.ndarray:
    """
    Convert PIL image to NumPy.
    """

    return np.asarray(
        image,
        dtype=np.float32,
    )

# =========================================================
# Prepare Batch
# =========================================================

def prepare_batch(
    image: np.ndarray,
) -> np.ndarray:
    """
    Add batch dimension.
    """

    return np.expand_dims(
        image,
        axis=0,
    )

# =========================================================
# Preprocess Image
# =========================================================

def preprocess_image(
    image: ImageInput,
) -> np.ndarray:
    """
    Complete preprocessing pipeline.
    """

    image = load_image(image)

    validate_image(image)

    image = convert_to_rgb(image)

    image = resize_image(image)

    image = image_to_array(image)

    image = prepare_batch(image)

    return image