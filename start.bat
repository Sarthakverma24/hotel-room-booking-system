@echo off
echo ========================================
echo   Sutreya E-Commerce Platform Startup
echo ========================================
echo.

echo [1/3] Killing existing backend process...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    taskkill /F /PID %%a 2>nul
)
timeout /t 2 /nobreak >nul

echo [2/3] Starting Backend (Java Spring Boot)...
cd backend
start "Sutreya Backend" cmd /k "mvn spring-boot:run"
cd ..

echo [3/3] Starting Frontend (React)...
timeout /t 5 /nobreak >nul
cd frontend
start "Sutreya Frontend" cmd /k "npm start"
cd ..

echo.
echo ========================================
echo   Sutreya Platform Started!
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to exit...
pause >nul
