#!/bin/bash

echo "🐱 Iniciando Batalla de Gatos..."
echo "=================================="

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor, instálalo primero."
    exit 1
fi

# Instalar dependencias del servidor si es necesario
if [ ! -d "server/node_modules" ]; then
    echo "📦 Instalando dependencias del servidor..."
    cd server && npm install && cd ..
fi

# Instalar dependencias del cliente si es necesario
if [ ! -d "client/node_modules" ]; then
    echo "📦 Instalando dependencias del cliente..."
    cd client && npm install && cd ..
fi

# Iniciar el servidor en background
echo "🚀 Iniciando servidor WebSocket..."
cd server && npm run dev &
SERVER_PID=$!
cd ..

# Esperar a que el servidor inicie
sleep 2

# Iniciar el cliente
echo "🚀 Iniciando cliente React..."
echo ""
echo "=================================="
echo "🎮 El juego estará disponible en:"
echo "   http://localhost:5173"
echo ""
echo "Abre dos pestañas del navegador"
echo "para jugar con dos jugadores."
echo "=================================="
echo ""
echo "Presiona Ctrl+C para detener todo"
echo ""

cd client && npm run dev

# Limpiar al salir
trap "kill $SERVER_PID 2>/dev/null" EXIT
