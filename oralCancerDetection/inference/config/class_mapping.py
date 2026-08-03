"""
=================================================
Module Name: class_mapping.py
=================================================

Description:
Defines all disease class mappings and
associated medical information used by
the inference engine.

=================================================
"""

from __future__ import annotations

# =========================================================
# Class Information
# =========================================================

TOTAL_CLASSES = 6

CLASS_ID_TO_NAME = {

    0: "Benign",

    1: "Erythroplakia",

    2: "Leukoplakia",

    3: "Normal",

    4: "OSCC",

    5: "OSMF",

}

CLASS_NAME_TO_ID = {

    value: key

    for key, value in CLASS_ID_TO_NAME.items()

}

CLASS_NAMES = list(CLASS_ID_TO_NAME.values())

# =========================================================
# Disease Information
# =========================================================

DISEASE_INFORMATION = {

    "Benign": {

        "title": "Benign Oral Lesion",

        "description":
            "No evidence of malignant oral pathology was detected.",

        "severity": "Low",

        "recommendation":
            "Routine clinical follow-up is recommended.",

    },

    "Erythroplakia": {

        "title": "Erythroplakia",

        "description":
            "Potentially malignant red lesion requiring prompt clinical evaluation.",

        "severity": "High",

        "recommendation":
            "Biopsy and specialist consultation are recommended.",

    },

    "Leukoplakia": {

        "title": "Leukoplakia",

        "description":
            "Potentially malignant white lesion requiring further assessment.",

        "severity": "Moderate",

        "recommendation":
            "Clinical examination and regular follow-up are advised.",

    },

    "Normal": {

        "title": "Normal Oral Mucosa",

        "description":
            "No clinically significant abnormality detected.",

        "severity": "None",

        "recommendation":
            "Maintain good oral hygiene and routine dental check-ups.",

    },

    "OSCC": {

        "title": "Oral Squamous Cell Carcinoma",

        "description":
            "Findings are suggestive of Oral Squamous Cell Carcinoma.",

        "severity": "Critical",

        "recommendation":
            "Immediate referral to an oral oncology specialist is strongly recommended.",

    },

    "OSMF": {

        "title": "Oral Submucous Fibrosis",

        "description":
            "Findings are suggestive of Oral Submucous Fibrosis.",

        "severity": "High",

        "recommendation":
            "Specialist evaluation and long-term clinical monitoring are recommended.",

    },

}

# =========================================================
# Public Exports
# =========================================================

__all__ = [

    "TOTAL_CLASSES",

    "CLASS_ID_TO_NAME",

    "CLASS_NAME_TO_ID",

    "CLASS_NAMES",

    "DISEASE_INFORMATION",

]
