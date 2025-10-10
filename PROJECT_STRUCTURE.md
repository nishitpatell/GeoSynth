# Project Structure Visualization

## 🏗️ Complete Directory Tree

```
world-lens-map/
│
├── 📄 Configuration Files
│   ├── .env                          # Environment variables
│   ├── package.json                  # Dependencies
│   ├── vite.config.js               # Vite configuration
│   ├── tailwind.config.js           # Tailwind CSS config
│   └── components.json              # shadcn/ui config
│
├── 📚 Documentation
│   ├── README.md                    # Project overview
│   ├── ARCHITECTURE.md              # Architecture details
│   ├── RESTRUCTURING_GUIDE.md       # Migration guide
│   ├── RESTRUCTURING_SUMMARY.md     # Phase 1 summary
│   ├── README_RESTRUCTURING.md      # Quick reference
│   ├── PROJECT_STRUCTURE.md         # This file
│   ├── AUTH_SETUP.md                # Auth documentation
│   └── QUICK_AUTH_GUIDE.md          # Auth quick guide
│
├── 🗄️ Database
│   └── supabase/
│       └── migrations/              # Database migrations
│
└── 💻 Source Code (src/)
    │
    ├── 🎯 Application Entry
    │   ├── main.jsx                 # App entry point
    │   ├── App.jsx                  # Main app component
    │   └── index.css                # Global styles
    │
    ├── ⚙️ Configuration Layer (config/)
    │   ├── env.js                   # Environment variables
    │   ├── app.config.js            # App settings
    │   └── api.config.js            # API endpoints
    │
    ├── 🔧 Core Infrastructure (core/)
    │   │
    │   ├── 🌐 API Layer (api/)
    │   │   ├── client/
    │   │   │   ├── httpClient.js    # Generic HTTP client
    │   │   │   └── supabaseClient.js # Supabase client
    │   │   └── services/
    │   │       ├── restCountriesApi.js # REST Countries
    │   │       ├── worldBankApi.js     # World Bank
    │   │       └── index.js
    │   │
    │   ├── 💾 Data Access (repositories/)
    │   │   ├── countryRepository.js  # Country data
    │   │   ├── wishlistRepository.js # Wishlist data
    │   │   └── index.js
    │   │
    │   ├── 🗂️ Caching (cache/)
    │   │   └── cacheManager.js       # Cache with TTL
    │   │
    │   ├── ❌ Error Handling (errors/)
    │   │   ├── AppError.js           # Error classes
    │   │   ├── errorHandler.js       # Error handler
    │   │   └── index.js
    │   │
    │   └── 📝 Logging (logger/)
    │       └── logger.js             # Logger service
    │
    ├── 🤝 Shared Resources (shared/)
    │   │
    │   ├── 🎨 Components (components/)
    │   │   ├── layout/               # Layout components
    │   │   │   └── Navbar.jsx
    │   │   ├── common/               # Common components
    │   │   │   ├── CountrySearch.jsx
    │   │   │   ├── WorldMap.jsx
    │   │   │   └── ProtectedRoute.jsx
    │   │   └── ui/                   # shadcn/ui components
    │   │       ├── button.jsx
    │   │       ├── card.jsx
    │   │       ├── avatar.jsx
    │   │       ├── dropdown-menu.jsx
    │   │       └── ... (20+ components)
    │   │
    │   ├── 🎣 Hooks (hooks/)
    │   │   └── use-toast.js          # Toast hook
    │   │
    │   ├── 🛠️ Utilities (utils/)
    │   │   ├── formatters.js         # Format functions
    │   │   ├── validators.js         # Validation functions
    │   │   ├── helpers.js            # Helper functions
    │   │   └── index.js
    │   │
    │   └── 📋 Constants (constants/)
    │       ├── routes.js             # Route definitions
    │       └── index.js              # App constants
    │
    ├── 🎭 Features (features/) - 🔜 PHASE 2
    │   │
    │   ├── auth/                     # Authentication
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   ├── services/
    │   │   ├── context/
    │   │   ├── pages/
    │   │   └── index.js
    │   │
    │   ├── countries/                # Countries
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   ├── services/
    │   │   ├── pages/
    │   │   └── index.js
    │   │
    │   ├── wishlist/                 # Wishlist
    │   │   ├── components/
    │   │   ├── hooks/
    │   │   ├── services/
    │   │   ├── pages/
    │   │   └── index.js
    │   │
    │   └── compare/                  # Compare
    │       ├── components/
    │       ├── hooks/
    │       ├── services/
    │       ├── pages/
    │       └── index.js
    │
    ├── 📄 Pages (pages/) - Current
    │   ├── Index.jsx                 # Home page
    │   ├── Auth.jsx                  # Auth page
    │   ├── CountryProfile.jsx        # Country details
    │   ├── Wishlist.jsx              # Wishlist page
    │   ├── Compare.jsx               # Compare page
    │   └── NotFound.jsx              # 404 page
    │
    ├── 🔐 Contexts (contexts/)
    │   └── AuthContext.jsx           # Auth context
    │
    ├── 🔌 Integrations (integrations/)
    │   └── supabase/
    │       └── client.js             # Legacy client
    │
    └── 🎨 Styles & Assets
        ├── lib/
        │   └── utils.js              # Tailwind utils
        └── assets/                   # Static assets
```

## 📊 Layer Dependencies

```
┌─────────────────────────────────────────────────────┐
│                   Presentation                      │
│              (Pages, Components)                    │
│  Dependencies: Hooks, Shared Components             │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│                  Application                        │
│              (Hooks, Context)                       │
│  Dependencies: Services, Repositories               │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│                    Domain                           │
│          (Services, Business Logic)                 │
│  Dependencies: Repositories, Entities               │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│                Infrastructure                       │
│     (API, Database, Cache, Errors, Logger)          │
│  Dependencies: External Services, Config            │
└─────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Example

```
User Action (Click Country)
        │
        ▼
┌───────────────────┐
│   Component       │  CountryProfile.jsx
│   (Presentation)  │  - Renders UI
└────────┬──────────┘  - Handles user input
         │
         ▼
┌───────────────────┐
│   Hook            │  useCountry(code)
│   (Application)   │  - Manages state
└────────┬──────────┘  - Handles side effects
         │
         ▼
┌───────────────────┐
│   Repository      │  countryRepository
│   (Data Access)   │  - Checks cache
└────────┬──────────┘  - Fetches data
         │
         ├─────────────┐
         │             │
         ▼             ▼
┌────────────┐  ┌────────────┐
│   Cache    │  │  API       │
│   Manager  │  │  Service   │
└────────────┘  └────────────┘
         │             │
         └──────┬──────┘
                │
                ▼
         ┌─────────────┐
         │  External   │
         │  API        │
         └─────────────┘
```

## 🎯 Import Patterns

### ✅ Correct Imports

```javascript
// Configuration
import { ENV } from '@/config/env';
import { APP_CONFIG } from '@/config/app.config';
import { API_ENDPOINTS } from '@/config/api.config';

// Core
import { countryRepository } from '@/core/repositories';
import { handleError } from '@/core/errors';
import { logger } from '@/core/logger/logger';

// Shared
import { ROUTES, generateRoute } from '@/shared/constants';
import { formatNumber, debounce } from '@/shared/utils';
import { Button } from '@/shared/components/ui/button';

// Features (Phase 2)
import { useAuth } from '@/features/auth';
import { useCountry } from '@/features/countries';
```

### ❌ Avoid

```javascript
// Don't use relative paths for core/shared
import { countryRepository } from '../../../core/repositories';

// Don't import from internal files
import { httpClient } from '@/core/api/client/httpClient';
// Use: import { restCountriesApi } from '@/core/api/services';
```

## 📦 Module Responsibilities

### Config Layer
- **Purpose**: Centralize all configuration
- **Exports**: ENV, APP_CONFIG, API_ENDPOINTS
- **Imports**: Nothing (leaf nodes)

### Core Layer
- **Purpose**: Infrastructure and technical concerns
- **Exports**: Clients, Services, Repositories, Errors, Logger, Cache
- **Imports**: Config, Shared Utils

### Shared Layer
- **Purpose**: Reusable across features
- **Exports**: Components, Hooks, Utils, Constants
- **Imports**: Config, Core (minimal)

### Features Layer (Phase 2)
- **Purpose**: Business features
- **Exports**: Feature-specific components, hooks, services
- **Imports**: Core, Shared, Other Features (carefully)

### Pages Layer (Current)
- **Purpose**: Route pages
- **Exports**: Page components
- **Imports**: Features, Shared, Core

## 🔍 File Naming Conventions

```
Components:     PascalCase.jsx      CountryCard.jsx
Hooks:          camelCase.js        useCountry.js
Services:       camelCase.js        countryService.js
Repositories:   camelCase.js        countryRepository.js
Utils:          camelCase.js        formatters.js
Constants:      camelCase.js        routes.js
Config:         camelCase.js        app.config.js
Types:          camelCase.js        country.js
```

## 📈 Growth Path

### Current (Phase 1)
```
src/
├── config/      ✅ Complete
├── core/        ✅ Complete
├── shared/      ✅ Partial
├── pages/       ✅ Existing
└── contexts/    ✅ Existing
```

### Phase 2 (Feature Modules)
```
src/
├── features/    🔜 To Create
│   ├── auth/
│   ├── countries/
│   ├── wishlist/
│   └── compare/
└── app/         🔜 To Create
    ├── App.jsx
    ├── router.jsx
    └── providers.jsx
```

### Phase 3 (Migration)
```
src/
├── features/    ✅ Complete
├── shared/      ✅ Complete
├── app/         ✅ Complete
└── [old files]  ❌ Removed
```

## 🎓 Quick Reference

### Need to...

**Fetch data?**
→ Use `@/core/repositories`

**Handle errors?**
→ Use `@/core/errors/errorHandler`

**Log something?**
→ Use `@/core/logger/logger`

**Format data?**
→ Use `@/shared/utils/formatters`

**Validate input?**
→ Use `@/shared/utils/validators`

**Define routes?**
→ Use `@/shared/constants/routes`

**Configure app?**
→ Use `@/config/*`

**Create UI?**
→ Use `@/shared/components/ui/*`

## 🚀 Ready to Build!

The structure is solid. Everything is organized. Time to create amazing features! 🎉
