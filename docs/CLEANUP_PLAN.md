# Codebase Cleanup Plan

## Files to Remove/Archive

### 1. Duplicate/Temporary Documentation (Move to docs/archive/)
- ❌ APP_NAME_UPDATE.md
- ❌ GLOBE_FOLDER_ANALYSIS.md
- ❌ GLOBE_INTEGRATION_COMPLETE.md
- ❌ GLOBE_TROUBLESHOOTING.md
- ❌ IMPLEMENTATION_GUIDE.md
- ❌ MANUAL_ASSET_COPY.md
- ❌ RESTRUCTURING_PLAN.md
- ❌ UI_FIXES_SUMMARY.md

### 2. Temporary Scripts
- ❌ copy-assets.bat (no longer needed)

### 3. Duplicate Folder
- ❌ GeoSynth/ folder (original source, no longer needed)

### 4. Keep & Organize
- ✅ README.md (update and keep in root)
- ✅ ARCHITECTURE.md → docs/ARCHITECTURE.md
- ✅ AUTH_SETUP.md → docs/AUTH_SETUP.md
- ✅ GOOGLE_AUTH_SETUP_GUIDE.md → docs/GOOGLE_AUTH_SETUP.md
- ✅ PROJECT_STRUCTURE.md → docs/PROJECT_STRUCTURE.md

## New Structure

```
geosynth/
├── docs/                           # All documentation
│   ├── README.md                   # Docs index
│   ├── ARCHITECTURE.md
│   ├── AUTH_SETUP.md
│   ├── GOOGLE_AUTH_SETUP.md
│   ├── PROJECT_STRUCTURE.md
│   ├── CONTRIBUTING.md             # New
│   ├── DEPLOYMENT.md               # New
│   └── archive/                    # Old docs for reference
│       ├── APP_NAME_UPDATE.md
│       ├── GLOBE_INTEGRATION_COMPLETE.md
│       └── ...
│
├── src/                            # Source code
├── public/                         # Static assets
├── supabase/                       # Database migrations
├── .env.example                    # New - template
├── .gitignore                      # Updated
├── README.md                       # Main project README
├── package.json
└── ...config files
```

## Actions

1. Create docs/ structure
2. Move documentation files
3. Remove temporary files
4. Update .gitignore
5. Create .env.example
6. Update main README.md
7. Remove GeoSynth/ folder
8. Clean up unused imports
