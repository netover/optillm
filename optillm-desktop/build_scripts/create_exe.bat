@echo off
echo =================================================
echo  OptiLLM Configurator - Full Build Process
echo =================================================
echo.

echo ** Step 1: Building Frontend Assets **
call build_frontend.bat
echo.

echo ** Step 2: Building Backend Executable **
call build_backend.bat
echo.

echo =================================================
echo  Build Process Finished!
echo  Find the final executable in: ..\backend\dist\
echo =================================================
pause
