/**
 * Servidor principal de Batalla de Gatos
 *
 * Punto de entrada del servidor WebSocket
 */

import { GameWebSocketServer } from './websocket/WebSocketServer';
import { GAME_CONFIG } from './config/constants';

/**
 * Inicia el servidor del juego
 */
function startServer(): void {
  console.log('🐱 Iniciando Batalla de Gatos - Servidor...');
  console.log('===========================================');

  // Crear e iniciar el servidor WebSocket
  const wsServer = new GameWebSocketServer(GAME_CONFIG.WS_PORT);

  console.log('===========================================');
  console.log('✅ Servidor listo y esperando conexiones...');
  console.log(`📍 Puerto: ${GAME_CONFIG.WS_PORT}`);
  console.log('');

  // Manejar cierre del servidor
  process.on('SIGINT', () => {
    console.log('\n🛑 Recibida señal de cierre...');
    wsServer.close();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Recibida señal de cierre...');
    wsServer.close();
    process.exit(0);
  });
}

// Iniciar el servidor
startServer();
