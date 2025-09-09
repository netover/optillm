@echo off
echo ===================================
echo Building React Frontend...
echo ===================================

REM This script should be run from the project root (optillm-desktop)

REM Navigate to the frontend directory
cd ..\frontend

REM Install dependencies if node_modules is not present
echo Checking for frontend dependencies...
IF NOT EXIST "node_modules" (
    echo Installing dependencies...
    call npm install
)

REM Run the build script defined in package.json
echo Building static assets...
call npm run build

echo.
echo Frontend build complete. Assets are in backend/app/static.

REM Return to the original directory
cd ..\build_scripts
