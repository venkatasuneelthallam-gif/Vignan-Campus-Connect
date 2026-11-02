@echo off
cd /d "%~dp0"
title VignanConnect - University Exhibition Live Demo
echo ========================================================
echo    VignanConnect (VFSTR Vadlamudi) - MERN Stack Portal
echo ========================================================
echo.
echo Launching VignanConnect Production Server on http://localhost:5000 ...
timeout /t 2 /nobreak >nul
start http://localhost:5000
echo.
cd server
node server.js
pause
