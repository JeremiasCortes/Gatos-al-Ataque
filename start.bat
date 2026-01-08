@echo off
echo 🐱 Iniciando Batalla de Gatos...
echo ==================================

REM Verificar si Node.js está instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js no está instalado. Por favor, instálalo primero.
    pause
    exit /b 1
)

REM Instalar dependencias del servidor si es necesario
if not exist "server\node_modules" (
    echo 📦 Instalando dependencias del servidor...
    cd server && npm install && cd ..
)

REM Instalar dependencias del cliente si es necesario
if not exist "client\node_modules" (
    echo 📦 Instalando dependencias del cliente...
    cd client && npm install && cd ..
)

REM Iniciar el servidor en una nueva ventana
echo 🚀 Iniciando servidor WebSocket...
start "Batalla de Gatos - Servidor" cmd /k "cd server && npm run dev"

REM Esperar a que el servidor inicie
timeout /t 3 /nobreak >nul

REM Iniciar el cliente
echo 🚀 Iniciando cliente React...
echo.
echo ==================================
echo 🎮 El juego estará disponible en:
echo    http://localhost:5173
echo.
echo Abre dos pestañas del navegador
echo para jugar con dos jugadores.
echo ==================================
echo.

cd client && npm run dev
