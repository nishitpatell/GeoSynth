@echo off
echo Copying globe assets...

REM Create directory structure
if not exist "public\assets\globe" mkdir "public\assets\globe"

REM Copy files
copy "GeoSynth\public\earth-day.jpg" "public\assets\globe\" /Y
copy "GeoSynth\public\earth-topology.png" "public\assets\globe\" /Y
copy "GeoSynth\public\world.geojson" "public\assets\globe\" /Y

echo.
echo Verifying files...
dir "public\assets\globe"

echo.
echo Done! Press any key to exit.
pause
