"""
=================================================
Module Name: classes.py
=================================================

Description:
Defines the disease classes used by the
classification model.

=================================================
"""

# ===========================
# Disease Classes
# ===========================

CLASS_NAMES = [
    'Benign',
    'Normal',
    'Leukoplakia',
    'Erythroplakia',
    'OSMF',
    'OSCC'
]

NUM_CLASSES = len(CLASS_NAMES)
