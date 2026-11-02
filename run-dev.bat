@echo off
cd /d "%~dp0"
title VignanConnect Development Launcher
echo ========================================================
echo    Starting VignanConnect in Full Development Mode
echo ========================================================
echo.
echo Launching Express Backend API on http://127.0.0.1:5000 ...
start "VignanConnect Backend" cmd /k "cd server && npm run dev"
echo Launching Vite React Frontend on http://localhost:3000 ...
start "VignanConnect Frontend" cmd /k "cd client && npm run dev"
echo.
echo Both servers started!
echo Frontend: http://localhost:3000
echo Backend API: http://127.0.0.1:5000/api
echo ========================================================
pause
