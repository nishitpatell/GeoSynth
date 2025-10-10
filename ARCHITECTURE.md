# Geosynth Architecture - GeoSynth

## Overview
This project follows **Clean Architecture** principles with a **feature-based folder structure**, ensuring scalability, maintainability, and testability.

## SOLID Principles Applied
### Single Responsibility Principle (SRP)
- Each module has one reason to change
- Services handle specific business logic
- Components focus on presentation only

### Open/Closed Principle (OCP)
- Services are open for extension, closed for modification
- Plugin architecture for API integrations

### Liskov Substitution Principle (LSP)
- All API services implement common interface

### Interface Segregation Principle (ISP)
- Small, focused interfaces

### Dependency Inversion Principle (DIP)
- High-level modules depend on abstractions
- Dependency injection pattern

## New Directory Structure

```
src/
├── app/                          # Application entry & config
│   ├── App.jsx
│   ├── router.jsx
│   └── providers.jsx
│
├── features/                     # Feature modules (domain-driven)
│   ├── auth/
│   ├── countries/
│   ├── wishlist/
│   └── compare/
│
├── shared/                       # Shared resources
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── constants/
│
├── core/                         # Core infrastructure
│   ├── api/
│   ├── repositories/
│   ├── cache/
│   └── errors/
│
├── config/                       # Configuration
├── types/                        # Type definitions
└── styles/                       # Global styles
```

## Data Flow Pattern

```
UI Component → Custom Hook → Service → Repository → API Client → External API
```

## Feature Module Structure

Each feature is self-contained:

```
feature/
├── components/        # UI components
├── hooks/            # Business logic hooks
├── services/         # Domain services
├── pages/            # Route pages
└── index.js          # Public exports
```
