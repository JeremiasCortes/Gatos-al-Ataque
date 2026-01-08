/**
 * Hook useGameState
 * Gestiona el estado del juego del cliente
 */

import { useState, useCallback, useRef } from 'react';
import { GameState, PlayerState } from '../types/game.types';

/**
 * Hook personalizado para gestionar el estado del juego
 *
 * @returns Objeto con el estado del juego y funciones para actualizarlo
 */
export const useGameState = () => {
  // Estado del juego completo
  const [gameState, setGameState] = useState<GameState | null>(null);

  // ID del jugador actual
  const [playerId, setPlayerId] = useState<string | null>(null);

  // Estado del jugador actual
  const [player, setPlayer] = useState<PlayerState | null>(null);

  // Estado del enemigo
  const [enemy, setEnemy] = useState<PlayerState | null>(null);

  // Referencia al último estado del enemigo para detectar cambios
  const prevEnemyHealthRef = useRef<number | null>(null);

  /**
   * Actualiza el estado completo del juego
   */
  const updateGameState = useCallback((newGameState: GameState) => {
    setGameState(newGameState);

    // Si aún no tenemos ID de jugador, asignar el primero
    if (!playerId) {
      const playerIds = Object.keys(newGameState.players);
      if (playerIds.length > 0) {
        setPlayerId(playerIds[0]);
      }
    }

    // Actualizar jugador y enemigo
    if (playerId) {
      const currentPlayer = newGameState.players[playerId];
      const enemyId = Object.keys(newGameState.players).find(id => id !== playerId);
      const currentEnemy = enemyId ? newGameState.players[enemyId] : null;

      setPlayer(currentPlayer || null);
      setEnemy(currentEnemy || null);
    }
  }, [playerId]);

  /**
   * Actualiza solo los datos de un jugador específico
   */
  const updatePlayer = useCallback((playerIdToUpdate: string, playerData: PlayerState) => {
    setGameState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        players: {
          ...prev.players,
          [playerIdToUpdate]: playerData,
        },
      };
    });

    // Si es nuestro jugador, actualizarlo
    if (playerId && playerIdToUpdate === playerId) {
      setPlayer(playerData);
    }

    // Si es el enemigo, actualizarlo
    if (playerId && playerIdToUpdate !== playerId) {
      setEnemy(playerData);
    }
  }, [playerId]);

  /**
   * Establece el ID del jugador
   */
  const setMyPlayerId = useCallback((id: string) => {
    setPlayerId(id);
  }, []);

  /**
   * Reinicia el estado del juego
   */
  const resetGame = useCallback(() => {
    setGameState(null);
    setPlayerId(null);
    setPlayer(null);
    setEnemy(null);
    prevEnemyHealthRef.current = null;
  }, []);

  return {
    gameState,
    player,
    enemy,
    playerId,
    setPlayerId: setMyPlayerId,
    updateGameState,
    updatePlayer,
    resetGame,
  };
};
