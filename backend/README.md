# Oral Cancer Classification System

> Backend Engineering Specification

---

# 1. Project Overview

## Objective

Develop a production-ready backend for the Oral Cancer Classification System.

The backend SHALL:

- Authenticate users.
- Manage user profiles.
- Manage diagnostic history.
- Integrate with the AI Inference Engine.
- Generate diagnostic reports.
- Store diagnostic reports.
- Provide dashboard analytics.
- Expose REST APIs for the frontend.

---

# 2. Technology Stack

## Frontend

- Next.js
- Tailwind CSS

## Backend

- FastAPI

## Database

- PostgreSQL

## ORM

- SQLAlchemy 2.0

## Validation

- Pydantic v2

## Authentication

- JWT
- Access Token
- Refresh Token

## Database Migration

- Alembic

## AI

- External AI Inference Engine

## Report Storage

- Cloudinary

## Documentation

- Swagger / OpenAPI

## Testing

- pytest

## Logging

- Python Logging

## Environment

- python-dotenv

---

# 3. Backend Architecture

## Layer Architecture

```text
                HTTP Request
                      │
                      ▼
               API Router Layer
                      │
                      ▼
            Business Service Layer
               │               │
               ▼               ▼
      Repository Layer   Integration Layer
               │               │
               ▼               ▼
          PostgreSQL     External Systems
```

---

## External Systems

- AI Inference Engine
- Cloudinary

---

## Layer Responsibilities

### API Layer

Purpose

- HTTP communication
- Request validation
- Response serialization

Rules

- MUST remain thin.
- MUST NOT contain business logic.
- MUST call Business Services only.

---

### Business Service Layer

Purpose

- Business logic
- Workflow orchestration
- Validation
- Module coordination

Rules

- MUST contain business logic.
- MUST coordinate repositories.
- MUST coordinate integrations.
- MUST NOT execute raw SQL.
- MUST NOT communicate directly with external SDKs.

---

### Repository Layer

Purpose

- Database operations.

Rules

- CRUD only.
- MUST NOT contain business logic.
- MUST NOT communicate with external systems.

---

### Integration Layer

Purpose

- External communication.

Current Integrations

- AI Engine
- Cloudinary

Rules

- MUST isolate third-party SDKs.
- MUST return backend-friendly objects.
- MUST NOT contain business logic.

---

### Core Layer

Purpose

Infrastructure utilities shared across the application.

Current Component

- File Manager

Rules

- MUST remain infrastructure only.
- MUST NOT contain business logic.

---

# 4. Responsibility Matrix

| Responsibility | Owner |
|----------------|-------|
| HTTP Requests | API |
| Business Logic | Services |
| Database Operations | Repositories |
| Database Models | Models |
| Request Validation | Schemas |
| Response Serialization | Schemas |
| Authentication | Security |
| Password Hashing | Security |
| JWT Management | Security |
| AI Communication | AI Integration |
| Cloud Storage | Storage Integration |
| PDF Generation | Report Service |
| Local File Operations | Core / File Manager |
| Dependency Injection | Dependencies |
| Middleware | Middleware |
| Environment Configuration | Config |
| Exception Handling | Exceptions |
| Generic Utilities | Utils |

---

# 5. Repository Structure

```text
oral-cancer-backend/

│
├── app/
│
├── uploads/
│
├── tests/
│
├── alembic/
│
├── logs/
│
├── .env
├── .env.example
├── requirements.txt
├── README.md
└── .gitignore
```

---

# 6. Application Structure

```text
oral-cancer-backend/

│
├── app/
│   │
│   ├── api/
│   │ 
│   │       ├── auth.py
│   │       ├── profile.py
│   │       ├── diagnostics.py
│   │       ├── reports.py
│   │       ├── dashboard.py
│   │       └── health.py
│   │
│   ├── services/
│   │       ├── auth_service.py
│   │       ├── profile_service.py
│   │       ├── diagnostic_service.py
│   │       └── dashboard_service.py
│   │
│   ├── repositories/
│   │       ├── user_repository.py
│   │       ├── diagnostic_repository.py
│   │       ├── report_repository.py
│   │       └── refresh_token_repository.py
│   │
│   ├── models/
│   │       ├── user.py
│   │       ├── diagnostic.py
│   │       ├── report.py
│   │       └── refresh_token.py
│   │
│   ├── schemas/
│   │       ├── auth.py
│   │       ├── profile.py
│   │       ├── diagnostic.py
│   │       ├── report.py
│   │       ├── dashboard.py
│   │       └── common.py
│   │
│   ├── reports/
│   │       ├── generator.py
│   │       ├── formatter.py
│   │       └── template.py
│   │
│   ├── integrations/
│   │   │
│   │   ├── ai/
│   │   │       ├── ai_service.py
│   │   │       ├── mapper.py
│   │   │       └── schemas.py
│   │   │
│   │   └── storage/
│   │           ├── storage_service.py
│   │           ├── cloudinary_client.py
│   │           └── schemas.py
│   │
│   ├── security/
│   │       ├── jwt.py
│   │       ├── password.py
│   │       ├── auth.py
│   │       └── permissions.py
│   │
│   ├── database/
│   │       ├── base.py
│   │       ├── session.py
│   │       └── connection.py
│   │
│   ├── core/
│   │       └── file_manager.py
│   │
│   ├── middleware/
│   │       ├── authentication.py
│   │       ├── logging.py
│   │       └── exception.py
│   │
│   ├── dependencies/
│   │       ├── database.py
│   │       └── security.py
│   │
│   ├── exceptions/
│   │       ├── base.py
│   │       ├── authentication.py
│   │       ├── diagnostic.py
│   │       ├── report.py
│   │       └── storage.py
│   │
│   ├── config/
│   │       ├── settings.py
│   │       ├── constants.py
│   │       └── logging.py
│   │
│   ├── utils/
│   │       ├── datetime.py
│   │       ├── filename.py
│   │       ├── validators.py
│   │       └── strings.py
│   │
│   └── main.py
│
├── uploads/
│   ├── temp/
│   │   └── images/
│   │
│   └── reports/
│
├── tests/
│
├── alembic/
│
├── logs/
│
├── .env
├── .env.example
├── requirements.txt
├── README.md
└── .gitignore
```

---

# 7. Folder Responsibilities

| Folder | Purpose |
|---------|---------|
| api | REST API routes |
| services | Business logic |
| repositories | Database operations |
| models | SQLAlchemy models |
| schemas | Pydantic schemas |
| integrations | External services |
| security | Authentication & JWT |
| database | Database configuration |
| config | Application configuration |
| middleware | FastAPI middleware |
| dependencies | Dependency Injection |
| exceptions | Custom exceptions |
| utils | Generic reusable utilities |
| core | Infrastructure utilities |

---

# 8. Local Storage Structure

```text
uploads/

├── temp/
│   └── images/
│
└── reports/
```

### uploads/temp/images

Purpose

- Temporary uploaded oral images.

Rules

- MUST store uploaded images.
- MUST delete images after successful processing.
- MUST retain images if processing fails.

---

### uploads/reports

Purpose

- Temporary generated PDF reports.

Rules

- MUST store generated PDF before upload.
- MUST upload through Storage Integration.
- MUST delete local PDF after successful upload.
- MUST retain PDF if upload fails.

---

# 9. General Architecture Rules

## Modules

- One responsibility per module.
- One public responsibility per module.
- Modules MUST communicate through their designated layer.

---

## Classes

- One responsibility per class.
- Keep classes focused.

---

## Functions

- One responsibility per function.
- Keep functions small.
- Avoid duplicated logic.

---

## Services

- Business logic belongs only in Services.

---

## Repositories

- Persistence belongs only in Repositories.

---

## Integrations

- Third-party communication belongs only in Integrations.

---

## Core

- Local infrastructure belongs only in Core.

---

## Utils

Allowed

- Date utilities
- String utilities
- Filename generation
- Generic validators

Not Allowed

- Authentication logic
- AI logic
- Storage logic
- Business logic

---

# 10. Dependency Rules

```text
API
 │
 ▼
Services
 │
 ├────────────┐
 ▼            ▼
Repositories  Integrations
 │            │
 ▼            ▼
Database   External Systems

Services
 │
 ▼
Core
```

Rules

API

- MAY call Services.
- MUST NOT call Repositories.
- MUST NOT call Integrations.

Services

- MAY call Repositories.
- MAY call Integrations.
- MAY call Core.

Repositories

- MAY access Database only.

Integrations

- MAY access External Systems only.

Core

- MUST remain independent of business modules.

---

# 11. Backend Modules

## Authentication

### Purpose

Manage user authentication and authorization.

### Components

- Router
- Service
- Repository
- Security
- Schemas

### Responsibilities

- Register User
- Login User
- Refresh Access Token
- Logout User
- Get Current User

### Dependencies

- User Repository
- Security

### Rules

- MUST use JWT Authentication.
- MUST use Access + Refresh Token.
- MUST hash passwords before storage.
- MUST verify passwords securely.
- MUST NOT expose password hashes.
- MUST require authentication for protected endpoints.

---

## User Profile

### Purpose

Manage authenticated user's profile.

### Components

- Router
- Service
- Repository
- Schemas

### Responsibilities

- Get Profile
- Update Profile

### Profile Fields

- Full Name
- Age
- Gender
- Phone Number
- Email
- Tobacco Habit
- Alcohol Habit
- Clinical Notes

### Dependencies

- User Repository

### Rules

- Every user owns exactly one profile.
- Users MUST access only their own profile.
- Profile updates MUST require authentication.

---

## Diagnostic

### Purpose

Manage complete diagnostic workflow.

### Components

- Router
- Service
- Repository
- Schemas

### Responsibilities

- Create Diagnostic
- Upload Oral Image
- Validate Image
- Execute AI Analysis
- Generate Report
- Save Diagnostic
- Retrieve Diagnostic
- Search Diagnostics
- Delete Diagnostic

### Dependencies

- AI Integration
- Report Service
- Storage Integration
- File Manager
- Diagnostic Repository

### Rules

- MUST validate uploaded image.
- MUST reject unsupported file formats.
- MUST reject empty files.
- MUST use File Manager for local storage.
- MUST use AI Integration only.
- MUST use Report Service only.
- MUST use Storage Integration only.
- MUST save diagnostic after successful report upload.

---

## Report

### Purpose

Generate diagnostic reports.

### Components

- Service

### Responsibilities

- Generate PDF
- Format diagnostic information
- Include uploaded image
- Include AI prediction
- Include confidence score
- Include report metadata

### Dependencies

- File Manager

### Rules

- MUST generate PDF locally.
- MUST return generated PDF path.
- MUST NOT upload files.
- MUST NOT communicate with Cloudinary.

---

## Dashboard

### Purpose

Provide dashboard information.

### Components

- Router
- Service
- Repository
- Schemas

### Responsibilities

- Dashboard Summary
- Recent Diagnostics
- Search Diagnostics
- Statistics

### Dependencies

- Diagnostic Repository
- Report Repository

### Rules

- MUST return authenticated user's data only.
- MUST support pagination.
- MUST support searching.

---

## AI Integration

### Purpose

Communicate with AI Inference Engine.

### Components

- AI Service
- Mapper
- Schemas

### Public API

```python
from inference import analyze_image

prediction = analyze_image(image)
```

### Responsibilities

- Send image to AI Engine
- Receive prediction
- Convert prediction into backend schema

### Rules

- MUST treat AI Engine as a black box.
- MUST NEVER import TensorFlow.
- MUST NEVER call model.predict().
- MUST NEVER modify AI Engine.
- MUST return backend-friendly objects.

---

## Storage Integration

### Purpose

Communicate with Cloudinary.

### Components

- Storage Service
- Cloudinary Client

### Responsibilities

- Upload PDF
- Delete PDF
- Return Report URL
- Return Storage Metadata

### Rules

- MUST upload PDF only.
- MUST NOT upload temporary images.
- MUST isolate Cloudinary SDK.
- MUST return typed responses.

---

## Core

### File Manager

### Purpose

Manage local file operations.

### Responsibilities

- Create Directories
- Save Uploaded Files
- Generate Unique File Names
- Read Files
- Delete Files
- Cleanup Temporary Storage

### Rules

- MUST manage local files only.
- MUST NOT upload files.
- MUST NOT generate reports.
- MUST NOT communicate with AI Engine.

---

# 12. API Groups

## Authentication

Endpoints

- Register
- Login
- Refresh Token
- Logout
- Current User

---

## User Profile

Endpoints

- Get Profile
- Update Profile

---

## Diagnostics

Endpoints

- Create Diagnostic
- Get Diagnostic
- Get Diagnostic History
- Search Diagnostics
- Delete Diagnostic

---

## Reports

Endpoints

- Download Report
- View Report

---

## Dashboard

Endpoints

- Dashboard Summary
- Recent Diagnostics
- Search
- Statistics

---

## Health

Endpoints

- Health Check

---

# 13. Diagnostic Workflow

```text
Authenticated User
        │
        ▼
Upload Image
        │
        ▼
Image Validation
        │
        ▼
File Manager
        │
        ▼
uploads/temp/images
        │
        ▼
AI Integration
        │
        ▼
AI Inference Engine
        │
        ▼
Prediction Result
        │
        ▼
Report Service
        │
        ▼
Generate PDF
        │
        ▼
uploads/reports
        │
        ▼
Storage Integration
        │
        ▼
Cloudinary
        │
        ▼
File Manager Cleanup
        │
        ▼
Save Diagnostic
        │
        ▼
HTTP Response
```

---

# 14. Request Lifecycle

```text
HTTP Request
      │
      ▼
API Router
      │
      ▼
Authentication
      │
      ▼
Request Validation
      │
      ▼
Business Service
      │
 ┌────┴────────────┐
 ▼                 ▼
Repository     Integration
 │                 │
 ▼                 ▼
Database      External System
 │
 ▼
Business Service
 │
 ▼
Response Schema
 │
 ▼
HTTP Response
```

---

# 15. Authentication Flow

```text
Login
   │
   ▼
Validate Credentials
   │
   ▼
Generate JWT Pair
   │
 ┌─┴───────────────┐
 ▼                 ▼
Access Token   Refresh Token
```

Rules

- Access Token MUST protect private APIs.
- Refresh Token MUST generate new Access Tokens.
- Logout MUST invalidate Refresh Token.
- Passwords MUST never be stored in plain text.

---

# 16. File Processing Workflow

```text
Upload Image

↓

File Manager

↓

Temporary Image

↓

AI Analysis

↓

Generate PDF

↓

Temporary PDF

↓

Cloudinary Upload

↓

Delete Temporary Image

↓

Delete Temporary PDF

↓

Complete
```

Failure Handling

If AI fails

- Keep Temporary Image
- Return Error

If PDF generation fails

- Keep Temporary Image
- Return Error

If Upload fails

- Keep Temporary Image
- Keep Temporary PDF
- Return Error


---

# 17. Database Overview

## Database

- PostgreSQL

## ORM

- SQLAlchemy 2.0

## Tables

| Table | Purpose |
|--------|---------|
| users | Authentication & User Profile |
| diagnostics | Diagnostic History |
| reports | Report Metadata |
| refresh_tokens | Refresh Token Management |

---

## users

Purpose

- User authentication
- User profile

Relationships

- One User → Many Diagnostics
- One User → Many Refresh Tokens

---

## diagnostics

Purpose

Store diagnostic history.

Relationships

- Many Diagnostics → One User
- One Diagnostic → One Report

---

## reports

Purpose

Store generated report metadata.

Relationships

- One Report → One Diagnostic

---

## refresh_tokens

Purpose

Manage active login sessions.

Relationships

- Many Refresh Tokens → One User

---

# 18. API Response Standard

## Success Response

```json
{
    "success": true,
    "message": "Operation completed successfully.",
    "data": {}
}
```

---

## Error Response

```json
{
    "success": false,
    "message": "Validation failed.",
    "errors": []
}
```

---

Rules

- Every endpoint MUST return a consistent response structure.
- Never expose internal exception details.
- Every validation error MUST return an error response.

---

# 19. Validation Rules

Request Validation

- Pydantic v2
- Required fields
- Optional fields
- Type validation

File Validation

- Supported formats
- Maximum size
- MIME type
- Empty file
- Corrupted file

Business Validation

- Authentication
- Authorization
- Resource ownership

---

# 20. Security Rules

Authentication

- JWT Authentication
- Access Token
- Refresh Token

Password Rules

- Hash before storage.
- Never store plain text passwords.
- Never return password hashes.

Environment

- Store secrets in .env.
- Never hardcode credentials.
- Never commit .env.

Authorization

- Users MUST access only their own resources.
- Protected endpoints MUST require authentication.

General

- Validate all inputs.
- Prevent SQL Injection using SQLAlchemy.
- Sanitize uploaded file names.
- Validate uploaded file types.

---

# 21. Exception Handling

Rules

- Use custom exceptions.
- Global exception handler.
- Consistent error responses.
- Log unexpected exceptions.

Exception Types

- Authentication
- Authorization
- Validation
- Database
- Storage
- AI Integration
- Report Generation
- Diagnostic Processing

---

# 22. Logging

Log

- Application startup
- Login
- Logout
- Diagnostic creation
- AI execution
- PDF generation
- Cloudinary upload
- Errors
- Exceptions

Do Not Log

- Passwords
- JWT Tokens
- Secrets
- Sensitive user information

---

# 23. Naming Conventions

Folders

- snake_case

Files

- snake_case.py

Classes

- PascalCase

Functions

- snake_case

Variables

- snake_case

Constants

- UPPER_CASE

Database Tables

- plural
- snake_case

Database Columns

- snake_case

API Routes

- lowercase

---

# 24. Coding Standards

General

- Use Python type hints.
- Keep functions small.
- Keep classes focused.
- Avoid duplicated logic.
- Prefer composition over duplication.

Functions

- One responsibility.
- Return predictable values.
- Raise custom exceptions.

Services

- Business logic only.
- Coordinate modules.
- Keep methods focused.

Repositories

- CRUD only.
- No business logic.

Models

- SQLAlchemy only.

Schemas

- Pydantic only.

Integrations

- External communication only.

Core

- Infrastructure utilities only.

Utils

Allowed

- Date utilities
- String utilities
- Filename generation
- Generic validators

Not Allowed

- Business logic
- Database access
- AI logic
- Storage logic

---

# 25. Performance Guidelines

Database

- Select only required columns.
- Avoid duplicate queries.
- Reuse database sessions.

Files

- Delete temporary files.
- Avoid unnecessary copies.

Services

- Keep workflows efficient.
- Avoid duplicate processing.

General

- Keep API response time low.
- Avoid unnecessary object creation.

---

# 26. Testing Strategy

Unit Tests

- Services
- Repositories
- Integrations
- Core

Integration Tests

- Authentication
- Database
- Diagnostics
- Storage
- AI Integration

Future

- End-to-End Tests

---

# 27. Project Rules

Architecture

- One responsibility per module.
- One responsibility per class.
- One responsibility per function.

Development

- Complete one phase at a time.
- Validate every phase.
- Freeze completed phases.

AI Integration

- Treat AI Engine as a black box.
- Never import TensorFlow.
- Never modify AI Engine.

Storage

- Upload PDF reports only.
- Delete temporary files after successful upload.

Reports

- Reports Module generates PDFs only.
- Reports Module never uploads files.

Repositories

- Repositories never execute business logic.

Services

- Services never execute SQL directly.

API

- Routers remain thin.
- Business logic belongs to Services.

---

# 28. Development Phases

## Phase 1

Project Initialization

Deliverables

- FastAPI Project
- Folder Structure
- Dependencies
- Environment Configuration
- Application Startup

Freeze after validation.

---

## Phase 2

Configuration

Deliverables

- Settings
- Environment Loader
- Logging
- Constants

Freeze after validation.

---

## Phase 3

Database

Deliverables

- PostgreSQL
- SQLAlchemy
- Alembic
- Database Session
- Models
- Repositories

Freeze after validation.

---

## Phase 4

Authentication

Deliverables

- Registration
- Login
- JWT
- Refresh Token
- Logout
- Protected Routes

Freeze after validation.

---

## Phase 5

User Profile

Deliverables

- Get Profile
- Update Profile

Freeze after validation.

---

## Phase 6

Diagnostics

Deliverables

- Image Upload
- Image Validation
- Diagnostic Workflow
- Diagnostic History
- Search
- Delete Diagnostic

Freeze after validation.

---

## Phase 7

AI Integration

Deliverables

- AI Integration Module
- Prediction Mapping
- Error Handling

Freeze after validation.

---

## Phase 8

Reports

Deliverables

- PDF Generation
- Report Formatting
- Report Templates

Freeze after validation.

---

## Phase 9

Storage

Deliverables

- Cloudinary Integration
- Report Upload
- File Cleanup

Freeze after validation.

---

## Phase 10

Dashboard

Deliverables

- Dashboard Summary
- Recent Diagnostics
- Search
- Statistics

Freeze after validation.

---

## Phase 11

Testing & Deployment

Deliverables

- Unit Tests
- Integration Tests
- Performance Optimization
- Production Configuration

Freeze after validation.

---

# 29. GitHub Copilot Instructions

## General

- Read this README completely before generating code.
- Follow this specification exactly.
- Do not introduce additional frameworks.
- Do not change the project architecture.
- Do not modify folder structure.
- Complete one phase at a time.
- Stop after each completed phase.

---

## Architecture

- Keep Routers thin.
- Keep Business Logic inside Services.
- Keep Persistence inside Repositories.
- Keep External Communication inside Integrations.
- Keep Local File Operations inside FileManager.
- Keep PDF generation inside Reports Module.

---

## AI Integration

Use only the public API.

```python
from inference import analyze_image

prediction = analyze_image(image)
```

Rules

- Never import TensorFlow.
- Never access model internals.
- Never modify AI Engine.
- Treat AI Engine as an immutable external dependency.

---

## Storage

Provider

- Cloudinary

Rules

- Upload generated PDF reports only.
- Never permanently store uploaded oral images.
- Delete temporary files after successful upload.

---

## Database

- PostgreSQL
- SQLAlchemy 2.0
- Alembic

Rules

- Repository Pattern.
- No raw SQL inside Services.

---

## Code Quality

- Use Python type hints.
- Use dependency injection.
- Keep code modular.
- Keep classes focused.
- Keep functions small.
- Use custom exceptions.
- Write maintainable code.

---

## Validation

Every module MUST be:

- Functional
- Independently testable
- Reviewed
- Frozen

before starting the next phase.

---

# 30. Definition of Done

The backend is considered complete when:

Authentication

- User Registration
- User Login
- JWT Authentication
- Refresh Token
- Logout

User Profile

- Profile Retrieval
- Profile Update

Diagnostics

- Diagnostic Creation
- Diagnostic History
- Diagnostic Search
- Diagnostic Deletion

AI

- AI Integration Complete
- Prediction Mapping Complete

Reports

- PDF Generation Complete
- Report Formatting Complete

Storage

- Cloudinary Integration Complete
- Temporary File Cleanup Complete

Dashboard

- Dashboard APIs Complete

Database

- PostgreSQL Complete
- Alembic Complete

Testing

- Unit Tests Passing
- Integration Tests Passing

Deployment

- Production Ready

---

# 31. Future Enhancements

Future features SHALL NOT affect the current architecture.

Examples

- Grad-CAM Heatmap
- Email Reports
- Multi-language Reports
- Admin Dashboard
- Audit Logs
- Notification System
- Cloud Storage Provider Replacement

These features SHALL be implemented by extending existing modules without modifying established module responsibilities.

---

# 32. Completion Checklist

Architecture

- [ ] Folder Structure Complete
- [ ] Module Structure Complete
- [ ] Dependency Rules Implemented

Database

- [ ] PostgreSQL Configured
- [ ] SQLAlchemy Configured
- [ ] Alembic Configured

Authentication

- [ ] JWT
- [ ] Refresh Token
- [ ] Protected Routes

Profile

- [ ] User Profile

Diagnostics

- [ ] Image Upload
- [ ] Diagnostic Workflow
- [ ] Diagnostic History

AI

- [ ] AI Integration

Reports

- [ ] PDF Generation

Storage

- [ ] Cloudinary Integration

Dashboard

- [ ] Dashboard APIs

Testing

- [ ] Unit Tests
- [ ] Integration Tests

Deployment

- [ ] Production Ready

---

END OF SPECIFICATION