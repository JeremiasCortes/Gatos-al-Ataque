/**
 * Componente: GameLobby
 *
 * Sala de espera donde los jugadores se conectan y marcan como listos
 *
 * Funcionalidad:
 * - Muestra el estado de ambos jugadores (esperando/listo)
 * - Permite al jugador marcar como "listo"
 * - Inicia el juego cuando ambos están listos
 * - Muestra el ID de la sala para que el segundo jugador se una
 */

import React, { useState, useEffect } from 'react';
import { GameState } from '../types/game.types';
import { GAME_CONFIG } from '../config/gameConfig';

interface GameLobbyProps {
  gameState: GameState | null;
  playerId: string | null;
  onJoinRoom: (playerName: string) => void;
  onSetReady: () => void;
  isConnected: boolean;
}

/**
 * Componente de la sala de espera
 */
export const GameLobby: React.FC<GameLobbyProps> = ({
  gameState,
  playerId,
  onJoinRoom,
  onSetReady,
  isConnected,
}) => {
  const [playerName, setPlayerName] = useState('');
  const [hasJoined, setHasJoined] = useState(false);

  // Obtener lista de jugadores
  const players = gameState ? Object.values(gameState.players) : [];

  // Verificar si el jugador actual está listo
  const currentPlayer = players.find(p => p.id === playerId);
  const isCurrentPlayerReady = currentPlayer?.ready || false;

  // Verificar si todos los jugadores están listos
  const allPlayersReady = players.length === 2 && players.every(p => p.ready);

  // Verificar si el juego ya ha empezado
  const gameStarted = gameState?.gameStarted || false;

  /**
   * Maneja el envío del formulario para unirse a la sala
   */
  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      onJoinRoom(playerName.trim());
      setHasJoined(true);
    }
  };

  /**
   * Marca al jugador como listo o no listo
   */
  const toggleReady = () => {
    if (isCurrentPlayerReady) {
      // Si ya está listo, no hay forma de cancelar (según el diseño)
      // Pero podríamos añadir esta funcionalidad si se desea
      return;
    }
    onSetReady();
  };

  // Renderizar estado de conexión
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Conectando...</h2>
          <p className="text-gray-600">Estableciendo conexión con el servidor</p>
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="card max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🐱 Batalla de Gatos 🐱
          </h1>
          <p className="text-gray-600">¡El juego de estrategia de gatos más épico!</p>
        </div>

        {/* Formulario para unirse */}
        {!hasJoined ? (
          <form onSubmit={handleJoin} className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tu nombre de gato:
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Ej: Michi, Pelusa, Bigotes..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
              maxLength={20}
              autoFocus
            />
            <button
              type="submit"
              disabled={!playerName.trim()}
              className="btn-primary w-full mt-4 text-lg"
            >
              🎮 Unirse a la partida
            </button>
          </form>
        ) : (
          <>
            {/* ID de la sala */}
            {gameState && (
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 mb-6">
                <div className="text-sm text-gray-600 mb-1">ID de la Sala:</div>
                <div className="text-2xl font-mono font-bold text-primary">
                  {gameState.roomId}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Comparte este ID con tu amigo para que se una
                </div>
              </div>
            )}

            {/* Lista de jugadores */}
            <div className="space-y-3 mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Jugadores ({players.length}/2)
              </h3>

              {/* Jugador 1 */}
              <div className="bg-white/60 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">🐱</div>
                  <div>
                    {players[0] ? (
                      <>
                        <div className="font-semibold text-gray-800">
                          {players[0].name}
                          {players[0].id === playerId && ' (Tú)'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {players[0].ready ? (
                            <span className="text-success font-semibold">✓ Listo</span>
                          ) : (
                            <span className="text-warning">Esperando...</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-400">Esperando jugador...</div>
                    )}
                  </div>
                </div>
                {players[0]?.id === playerId && (
                  <div className={`w-4 h-4 rounded-full ${isCurrentPlayerReady ? 'bg-success' : 'bg-warning'}`} />
                )}
              </div>

              {/* Jugador 2 */}
              <div className="bg-white/60 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">😾</div>
                  <div>
                    {players[1] ? (
                      <>
                        <div className="font-semibold text-gray-800">
                          {players[1].name}
                          {players[1].id === playerId && ' (Tú)'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {players[1].ready ? (
                            <span className="text-success font-semibold">✓ Listo</span>
                          ) : (
                            <span className="text-warning">Esperando...</span>
                          )}
                        </div>
                      </>
                    ) : (
                      <div className="text-gray-400">Esperando jugador...</div>
                    )}
                  </div>
                </div>
                {players[1]?.id === playerId && (
                  <div className={`w-4 h-4 rounded-full ${isCurrentPlayerReady ? 'bg-success' : 'bg-warning'}`} />
                )}
              </div>
            </div>

            {/* Botón de listo */}
            {currentPlayer && !gameStarted && (
              <button
                onClick={toggleReady}
                disabled={isCurrentPlayerReady}
                className={`btn-primary w-full text-lg ${
                  isCurrentPlayerReady ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isCurrentPlayerReady ? '✓ Estoy listo' : '👆 Marcar como listo'}
              </button>
            )}

            {/* Mensaje de espera */}
            {players.length < 2 && !gameStarted && (
              <div className="text-center text-gray-600 mt-4">
                <p>🔔 Esperando a que se una otro jugador...</p>
              </div>
            )}

            {/* Mensaje de todos listos */}
            {allPlayersReady && !gameStarted && (
              <div className="text-center text-success font-semibold mt-4 animate-pulse">
                <p>🎉 ¡Todos listos! La partida comenzará pronto...</p>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Conectado al servidor: {GAME_CONFIG.WS_URL}</p>
        </div>
      </div>
    </div>
  );
};
