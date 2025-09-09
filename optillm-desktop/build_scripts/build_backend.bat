@echo off
echo ===================================
echo Building Backend Executable...
echo ===================================

REM This script should be run from the project root (optillm-desktop)
SET VENV_DIR=..\.venv

REM Create a virtual environment if it doesn't exist
echo Checking for Python virtual environment...
IF NOT EXIST "%VENV_DIR%" (
    echo Creating virtual environment...
    python -m venv %VENV_DIR%
)

REM Activate the virtual environment
echo Activating virtual environment...
call %VENV_DIR%\Scripts\activate

REM Install/update dependencies
echo Installing backend dependencies and PyInstaller...
pip install -r ..\backend\requirements.txt
pip install pyinstaller

REM Navigate to the backend directory to run PyInstaller
cd ..\backend

echo Running PyInstaller...
pyinstaller ^
  --noconfirm ^
  --onefile ^
  --windowed ^
  --name "OptiLLM_Configurator" ^
  --add-data "app/static;app/static" ^
  --add-data "../config;config" ^
  launch.py

echo.
echo Backend build complete. Executable is in backend/dist/.

REM Return to the original directory
cd ..\build_scripts
