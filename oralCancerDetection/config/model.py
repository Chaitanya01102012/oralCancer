"""
=================================================
Module Name: model.py
=================================================

Description:
EfficientNet model configuration.

=================================================
"""

from dataclasses import dataclass


@dataclass(frozen=True)
class ModelConfig:
    """
    EfficientNet model configuration.
    """

    # ---------------------------------------------------------
    # Model
    # ---------------------------------------------------------
    name: str = "EfficientNetB0"
    input_shape: tuple[int, int, int] = (224, 224, 3)
    pretrained_weights: str = "imagenet"

    # ---------------------------------------------------------
    # Classification Head
    # ---------------------------------------------------------
    dropout_rate: float = 0.30

    # ---------------------------------------------------------
    # Stage 1 (Feature Extraction)
    # ---------------------------------------------------------
    learning_rate: float = 1e-3
    fine_tune: bool = False
    fine_tune_at: int | None = None

    # ---------------------------------------------------------
    # Stage 2 (Fine-Tuning)
    # ---------------------------------------------------------

    # Fine-tuning learning rate
    fine_tune_learning_rate: float = 1e-5

    # Maximum number of fine-tuning epochs
    fine_tune_epochs: int = 20

    # E002:
    # Unfreeze the backbone starting from layer 150.
    # E001 used layer 200.
    # This allows a larger portion of EfficientNetB0 to adapt
    # to oral lesion features while keeping the experiment controlled.
    fine_tune_from_layer: int = 150
    # ---------------------------------------------------------
    # Regularization
    # ---------------------------------------------------------
    weight_decay: float = 1e-4

    # ---------------------------------------------------------
    # Saving
    # ---------------------------------------------------------
    save_best_only: bool = True


MODEL_CONFIG = ModelConfig()
