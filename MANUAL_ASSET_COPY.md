# Manual Asset Copy Instructions

## Issue
The globe assets need to be copied manually to the correct location.

## Steps to Fix

### Option 1: Using File Explorer (Easiest)
1. Open File Explorer
2. Navigate to: `E:\mansi\7th sem\GeoSynth\GeoSynth\public`
3. Copy these 3 files:
   - `earth-day.jpg`
   - `earth-topology.png`
   - `world.geojson`

4. Navigate to: `E:\mansi\7th sem\GeoSynth\public`
5. Create folders: `assets\globe` (if they don't exist)
6. Paste the 3 files into: `E:\mansi\7th sem\GeoSynth\public\assets\globe\`

### Option 2: Using PowerShell
Open PowerShell in the project root and run:

```powershell
# Create directory
New-Item -ItemType Directory -Force -Path "public\assets\globe"

# Copy files
Copy-Item "GeoSynth\public\earth-day.jpg" -Destination "public\assets\globe\"
Copy-Item "GeoSynth\public\earth-topology.png" -Destination "public\assets\globe\"
Copy-Item "GeoSynth\public\world.geojson" -Destination "public\assets\globe\"

# Verify
Get-ChildItem "public\assets\globe"
```

### Option 3: Using Command Prompt
```cmd
mkdir public\assets\globe
copy "GeoSynth\public\earth-day.jpg" "public\assets\globe\"
copy "GeoSynth\public\earth-topology.png" "public\assets\globe\"
copy "GeoSynth\public\world.geojson" "public\assets\globe\"
dir public\assets\globe
```

## Verify
After copying, you should have:
```
public/
└── assets/
    └── globe/
        ├── earth-day.jpg
        ├── earth-topology.png
        └── world.geojson
```

## Then
1. Save all files
2. The dev server should auto-reload
3. The globe should load successfully!

If it still doesn't work, try:
- Hard refresh browser (Ctrl+Shift+R)
- Stop and restart dev server
