# Geosynth - Industry-Level Repository Restructuring Plan

## 🎯 Objectives

1. **Integrate 3D Globe** from GeoSynth folder into main app
2. **Restructure repository** to industry standards
3. **Apply SOLID principles** throughout codebase
4. **Implement clean architecture** with proper separation of concerns
5. **Organize as monorepo** with clear frontend/backend separation

## 📐 New Repository Structure

```
geosynth/
├── 📁 frontend/                    # React frontend application
│   ├── public/
│   │   ├── assets/
│   │   │   ├── globe/             # 3D globe textures
│   │   │   │   ├── earth-day.jpg
│   │   │   │   ├── earth-topology.png
│   │   │   │   └── world.geojson
│   │   │   └── images/
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── app/                   # Application layer
│   │   │   ├── App.jsx
│   │   │   ├── router.jsx
│   │   │   └── providers.jsx
│   │   │
│   │   ├── features/              # Feature modules (domain-driven)
│   │   │   ├── auth/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── services/
│   │   │   │   ├── types/
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── globe/             # NEW: 3D Globe feature
│   │   │   │   ├── components/
│   │   │   │   │   ├── Globe3D.jsx
│   │   │   │   │   ├── GlobeControls.jsx
│   │   │   │   │   └── GlobeTooltip.jsx
│   │   │   │   ├── hooks/
│   │   │   │   │   ├── useGlobeData.js
│   │   │   │   │   ├── useGlobeInteraction.js
│   │   │   │   │   └── useGlobeSearch.js
│   │   │   │   ├── services/
│   │   │   │   │   └── globeService.js
│   │   │   │   ├── utils/
│   │   │   │   │   └── geometryUtils.js
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── countries/
│   │   │   │   ├── components/
│   │   │   │   ├── hooks/
│   │   │   │   ├── services/
│   │   │   │   └── index.js
│   │   │   │
│   │   │   ├── wishlist/
│   │   │   ├── comparison/
│   │   │   └── profile/
│   │   │
│   │   ├── shared/                # Shared resources
│   │   │   ├── components/
│   │   │   │   ├── ui/           # shadcn components
│   │   │   │   ├── layout/
│   │   │   │   ├── common/
│   │   │   │   └── search/       # Enhanced search components
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── useDebounce.js
│   │   │   │   ├── useLocalStorage.js
│   │   │   │   └── useMediaQuery.js
│   │   │   │
│   │   │   ├── utils/
│   │   │   │   ├── formatters.js
│   │   │   │   ├── validators.js
│   │   │   │   └── helpers.js
│   │   │   │
│   │   │   ├── constants/
│   │   │   │   ├── routes.js
│   │   │   │   ├── api.js
│   │   │   │   └── theme.js
│   │   │   │
│   │   │   └── types/            # TypeScript types (future)
│   │   │
│   │   ├── core/                  # Core infrastructure
│   │   │   ├── api/
│   │   │   │   ├── client/
│   │   │   │   │   ├── httpClient.js
│   │   │   │   │   ├── supabaseClient.js
│   │   │   │   │   └── apiClient.js
│   │   │   │   │
│   │   │   │   ├── services/     # External API services
│   │   │   │   │   ├── restCountries/
│   │   │   │   │   ├── weather/
│   │   │   │   │   ├── news/
│   │   │   │   │   └── currency/
│   │   │   │   │
│   │   │   │   └── interceptors/
│   │   │   │
│   │   │   ├── repositories/     # Data access layer
│   │   │   │   ├── countryRepository.js
│   │   │   │   ├── wishlistRepository.js
│   │   │   │   └── userRepository.js
│   │   │   │
│   │   │   ├── cache/
│   │   │   │   ├── cacheManager.js
│   │   │   │   └── strategies/
│   │   │   │
│   │   │   ├── errors/
│   │   │   │   ├── errorHandler.js
│   │   │   │   ├── errorTypes.js
│   │   │   │   └── errorBoundary.jsx
│   │   │   │
│   │   │   └── logger/
│   │   │       └── logger.js
│   │   │
│   │   ├── config/                # Configuration
│   │   │   ├── env.js
│   │   │   ├── app.config.js
│   │   │   └── api.config.js
│   │   │
│   │   ├── styles/                # Global styles
│   │   │   └── index.css
│   │   │
│   │   └── main.jsx               # Entry point
│   │
│   ├── tests/                     # Test files
│   │   ├── unit/
│   │   ├── integration/
│   │   └── e2e/
│   │
│   ├── .env.example
│   ├── .env.local
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── README.md
│
├── 📁 backend/                     # Backend services (future)
│   ├── src/
│   │   ├── api/
│   │   ├── services/
│   │   ├── models/
│   │   └── utils/
│   ├── package.json
│   └── README.md
│
├── 📁 docs/                        # Documentation
│   ├── architecture/
│   │   ├── ARCHITECTURE.md
│   │   ├── DESIGN_PATTERNS.md
│   │   └── API_DESIGN.md
│   │
│   ├── guides/
│   │   ├── SETUP.md
│   │   ├── DEVELOPMENT.md
│   │   ├── DEPLOYMENT.md
│   │   └── CONTRIBUTING.md
│   │
│   └── features/
│       ├── GLOBE_INTEGRATION.md
│       ├── AUTH_SYSTEM.md
│       └── WISHLIST.md
│
├── 📁 scripts/                     # Build & deployment scripts
│   ├── setup.sh
│   ├── deploy.sh
│   └── migrate.sh
│
├── 📁 .github/                     # GitHub workflows
│   └── workflows/
│       ├── ci.yml
│       └── deploy.yml
│
├── .gitignore
├── README.md                       # Main project README
├── package.json                    # Root package.json (monorepo)
└── LICENSE

```

## 🏗️ SOLID Principles Implementation

### 1. Single Responsibility Principle (SRP)
- **Each module has one reason to change**
- Components: Only handle UI rendering
- Services: Only handle business logic
- Repositories: Only handle data access
- Hooks: Only handle specific state/side effects

### 2. Open/Closed Principle (OCP)
- Services are open for extension, closed for modification
- Use interfaces/abstractions for API services
- Plugin architecture for external integrations

### 3. Liskov Substitution Principle (LSP)
- All API services implement common interface
- Interchangeable implementations

### 4. Interface Segregation Principle (ISP)
- Small, focused interfaces
- No fat interfaces

### 5. Dependency Inversion Principle (DIP)
- High-level modules depend on abstractions
- Dependency injection pattern
- Use React Context for dependency injection

## 🌍 3D Globe Integration Plan

### Phase 1: Setup Dependencies
```bash
npm install react-globe.gl three
```

### Phase 2: Copy Assets
```
GeoSynth/public/ → frontend/public/assets/globe/
- earth-day.jpg
- earth-topology.png
- world.geojson
```

### Phase 3: Create Globe Feature Module
```
frontend/src/features/globe/
├── components/
│   ├── Globe3D.jsx              # Main 3D globe component
│   ├── GlobeControls.jsx        # Zoom, rotation controls
│   ├── GlobeTooltip.jsx         # Hover tooltip
│   └── GlobeSearchBar.jsx       # Integrated search
│
├── hooks/
│   ├── useGlobeData.js          # Load GeoJSON data
│   ├── useGlobeInteraction.js   # Handle clicks, hovers
│   └── useGlobeSearch.js        # Search & zoom logic
│
├── services/
│   └── globeService.js          # Globe-related business logic
│
├── utils/
│   └── geometryUtils.js         # Centroid calculations
│
└── index.js                     # Public exports
```

### Phase 4: Adapt to Main App
- Replace MUI with Tailwind CSS
- Apply green/yellow/golden theme
- Integrate with existing auth system
- Use existing routing
- Connect to Supabase for country data

### Phase 5: Create Toggle Feature
- Add button to switch between 2D and 3D views
- Store preference in localStorage
- Smooth transition between views

## 🔄 Migration Strategy

### Step 1: Preparation (No Breaking Changes)
1. Create new folder structure alongside existing
2. Copy files to new locations
3. Update imports gradually

### Step 2: Feature Integration
1. Install globe dependencies
2. Copy globe assets
3. Create globe feature module
4. Test in isolation

### Step 3: Gradual Migration
1. Move one feature at a time
2. Update imports
3. Test thoroughly
4. Commit after each feature

### Step 4: Cleanup
1. Remove old folder structure
2. Update all documentation
3. Final testing

## 📋 File Movement Map

### Current → New Structure

```
src/components/Navbar.jsx 
  → frontend/src/shared/components/layout/Navbar.jsx

src/components/WorldMap.jsx 
  → frontend/src/features/countries/components/WorldMap2D.jsx

src/pages/Index.jsx 
  → frontend/src/features/home/pages/HomePage.jsx

src/features/auth/* 
  → frontend/src/features/auth/*

src/features/wishlist/* 
  → frontend/src/features/wishlist/*

src/services/* 
  → frontend/src/core/api/services/*

src/contexts/AuthContext.jsx 
  → frontend/src/features/auth/context/AuthContext.jsx

GeoSynth/src/pages/GlobePage.js 
  → frontend/src/features/globe/components/Globe3D.jsx

GeoSynth/src/hooks/useCountrySearch.js 
  → frontend/src/features/globe/hooks/useGlobeSearch.js
```

## 🎨 Theme Integration

### Globe Colors (Green/Yellow/Golden)
```javascript
const GLOBE_THEME = {
  polygonDefault: 'rgba(34, 197, 94, 0.15)',    // Green with transparency
  polygonHover: '#EAB308',                       // Golden yellow
  polygonActive: '#F59E0B',                      // Amber
  stroke: 'rgba(0, 0, 0, 0.3)',                 // Dark borders
  background: 'transparent',                     // Transparent background
};
```

## 🧪 Testing Strategy

### Unit Tests
- Component rendering
- Hook logic
- Service functions
- Utility functions

### Integration Tests
- Feature workflows
- API integrations
- State management

### E2E Tests
- User journeys
- Critical paths
- Cross-browser testing

## 📦 Package.json Structure

### Root package.json (Monorepo)
```json
{
  "name": "geosynth-monorepo",
  "private": true,
  "workspaces": [
    "frontend",
    "backend"
  ],
  "scripts": {
    "dev": "npm run dev --workspace=frontend",
    "build": "npm run build --workspaces",
    "test": "npm run test --workspaces"
  }
}
```

## 🚀 Implementation Timeline

### Phase 1: Setup (Day 1)
- Create new folder structure
- Install dependencies
- Copy assets

### Phase 2: Globe Integration (Day 1-2)
- Create Globe3D component
- Implement hooks
- Style with Tailwind
- Test functionality

### Phase 3: Restructuring (Day 2-3)
- Move files to new structure
- Update imports
- Test each feature

### Phase 4: Documentation (Day 3)
- Update all docs
- Create migration guide
- Add code examples

### Phase 5: Testing & Cleanup (Day 4)
- Comprehensive testing
- Remove old structure
- Final polish

## ✅ Success Criteria

- [ ] 3D globe fully functional with theme
- [ ] All existing features working
- [ ] Clean folder structure
- [ ] SOLID principles applied
- [ ] Comprehensive documentation
- [ ] All tests passing
- [ ] No breaking changes for users

## 🔐 Environment Variables

```env
# Frontend (.env.local)
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_API_BASE_URL=
VITE_ENABLE_3D_GLOBE=true

# Backend (.env)
DATABASE_URL=
JWT_SECRET=
API_PORT=3001
```

## 📝 Next Steps

1. **Review this plan** - Ensure alignment with requirements
2. **Approve structure** - Confirm folder organization
3. **Begin implementation** - Start with Phase 1
4. **Iterative development** - Test after each phase
5. **Documentation** - Update as we go

---

**Created**: 2025-10-10
**Status**: 📋 Planning Phase
**Estimated Time**: 3-4 days for complete restructuring
