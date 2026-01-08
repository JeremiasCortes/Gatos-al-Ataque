/**
 * Componente: App
 *
 * Componente raíz de la aplicación
 * Gestiona el estado global y la conexión WebSocket
 */

import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { GameLobby } from './components/GameLobby';
import { GameBoard } from './components/GameBoard';
import { useWebSocket } from './hooks/useWebSocket';
import { useGameState } from './hooks/useGameState';
import { GameState, PlayerState } from './types/game.types';

/**
 * Componente principal de la aplicación
 */
function App() {
  // Estado de conexión
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // Estado del juego
  const {
    gameState,
    player,
    enemy,
    playerId,
    setPlayerId,
    updateGameState,
    updatePlayer,
    resetGame,
  } = useGameState();

  // Estado de fin de juego
  const [gameEnded, setGameEnded] = useState(false);
  const [isWinner, setIsWinner] = useState(false);
  const [winnerName, setWinnerName] = useState('');

  // Referencias para mantener estabilidad de callbacks
  const playerIdRef = useRef(playerId);
  const updateGameStateRef = useRef(updateGameState);
  const updatePlayerRef = useRef(updatePlayer);

  // Actualizar referencias cuando cambian los valores
  useEffect(() => {
    playerIdRef.current = playerId;
    updateGameStateRef.current = updateGameState;
    updatePlayerRef.current = updatePlayer;
  }, [playerId, updateGameState, updatePlayer]);

  // Configurar callbacks de WebSocket con useMemo para evitar re-creaciones
  const wsCallbacks = useMemo(() => ({
    onConnected: (data: { playerId: string; message: string }) => {
      console.log('✅ Conectado:', data);
      setIsConnected(true);
      setPlayerId(data.playerId);
    },

    onConnecting: () => {
      setIsConnecting(true);
    },

    onDisconnected: () => {
      setIsConnected(false);
      setIsConnecting(false);
    },

    onRoomState: (data: { gameState: GameState }) => {
      updateGameStateRef.current(data.gameState);
    },

    onGameStart: () => {
      console.log('🎮 Juego iniciado');
    },

    onGameTick: (data: { timestamp: number }) => {
      // El tick del juego se maneja actualizando el estado del jugador
    },

    onPlayerUpdate: (data: { playerId: string; player: PlayerState }) => {
      updatePlayerRef.current(data.playerId, data.player);
    },

    onEnemyUpdate: (data: { playerId: string; player: PlayerState }) => {
      updatePlayerRef.current(data.playerId, data.player);
    },

    onAttackReceived: (data: { attackName: string; damage: number }) => {
      console.log(`⚔️ Ataque recibido: ${data.attackName} (-${data.damage})`);
    },

    onGameEnd: (data: { winnerId: string; winnerName: string }) => {
      console.log('🏁 Juego terminado, ganador:', data.winnerName);
      setGameEnded(true);
      setIsWinner(data.winnerId === playerIdRef.current);
      setWinnerName(data.winnerName);
    },

    onError: (data: { message: string }) => {
      console.error('❌ Error del servidor:', data.message);
    },

    onEnergyThresholdReached: () => {
      console.log('⚡ ¡Energía al máximo!');
    },

    onPlayerDisconnected: (data: { playerId: string; playerName: string }) => {
      console.log(`👋 Jugador desconectado: ${data.playerName}`);
    },
  }), []); // Dependencias vacías para que se cree solo una vez

  // Conexión WebSocket
  const {
    isConnected: wsConnected,
    isConnecting: wsConnecting,
    joinRoom,
    setReady,
    click,
    buyFood,
    buyUpgrade,
    buyAttack,
    buyItem,
    useItem,
    makeEnergyChoice,
  } = useWebSocket(wsCallbacks);

  // Actualizar estado de conexión
  useEffect(() => {
    setIsConnected(wsConnected);
    setIsConnecting(wsConnecting);
  }, [wsConnected, wsConnecting]);

  /**
   * Maneja unirse a la sala
   */
  const handleJoinRoom = useCallback((playerName: string) => {
    joinRoom(playerName);
  }, [joinRoom]);

  /**
   * Maneja marcar como listo
   */
  const handleSetReady = useCallback(() => {
    setReady();
  }, [setReady]);

  /**
   * Maneja el clic para ganar dinero
   */
  const handleClick = useCallback(() => {
    click();
  }, [click]);

  /**
   * Maneja la compra de pienso
   */
  const handleBuyFood = useCallback((amount: number) => {
    buyFood(amount);
  }, [buyFood]);

  /**
   * Maneja la compra de una mejora
   */
  const handleBuyUpgrade = useCallback((upgradeId: string) => {
    buyUpgrade(upgradeId);
  }, [buyUpgrade]);

  /**
   * Maneja la compra de un ataque
   */
  const handleBuyAttack = useCallback((attackId: string) => {
    buyAttack(attackId);
  }, [buyAttack]);

  /**
   * Maneja la compra de un item
   */
  const handleBuyItem = useCallback((itemId: string) => {
    buyItem(itemId);
  }, [buyItem]);

  /**
   * Maneja el uso de un item
   */
  const handleUseItem = useCallback((itemId: string) => {
    useItem(itemId);
  }, [useItem]);

  /**
   * Maneja la elección del modal de energía
   */
  const handleEnergyChoice = useCallback((choiceId: string) => {
    makeEnergyChoice(choiceId);
  }, [makeEnergyChoice]);

  /**
   * Reinicia el juego
   */
  const handleResetGame = useCallback(() => {
    resetGame();
    setGameEnded(false);
    setIsWinner(false);
    setWinnerName('');
    window.location.reload();
  }, [resetGame]);

  // Determinar qué componente mostrar
  const gameStarted = gameState?.gameStarted || false;

  return (
    <div className="App">
      {!gameStarted ? (
        <GameLobby
          gameState={gameState}
          playerId={playerId}
          onJoinRoom={handleJoinRoom}
          onSetReady={handleSetReady}
          isConnected={isConnected}
        />
      ) : (
        player && (
          <GameBoard
            player={player}
            enemy={enemy}
            onClick={handleClick}
            onBuyFood={handleBuyFood}
            onBuyUpgrade={handleBuyUpgrade}
            onBuyAttack={handleBuyAttack}
            onBuyItem={handleBuyItem}
            onUseItem={handleUseItem}
            onEnergyChoice={handleEnergyChoice}
            onResetGame={handleResetGame}
            gameEnded={gameEnded}
            isWinner={isWinner}
            winnerName={winnerName}
          />
        )
      )}
    </div>
  );
}

export default App;
