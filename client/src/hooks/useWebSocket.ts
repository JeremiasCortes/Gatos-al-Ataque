/**
 * Hook useWebSocket
 * Gestiona la conexión WebSocket con el servidor del juego
 */

import { useEffect, useRef, useCallback, useState } from 'react';
import { WSEventCallbacks, WSMessage } from '../types/websocket.types';
import { GAME_CONFIG, getWebSocketURL } from '../config/gameConfig';

/**
 * Hook personalizado para gestionar la conexión WebSocket
 *
 * @param callbacks - Funciones de callback para los diferentes eventos
 * @returns Objeto con funciones para enviar mensajes al servidor
 */
export const useWebSocket = (callbacks: WSEventCallbacks = {}) => {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const callbacksRef = useRef(callbacks);
  const hasConnectedRef = useRef(false);

  // Mantener los callbacks actualizados sin causar re-renders
  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  /**
   * Conecta al servidor WebSocket
   */
  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setIsConnecting(true);
    callbacksRef.current.onConnecting?.();

    try {
      const ws = new WebSocket(getWebSocketURL());
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('🔗 Conectado al servidor WebSocket');
        setIsConnected(true);
        setIsConnecting(false);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event: MessageEvent) => {
        try {
          const message: WSMessage = JSON.parse(event.data);
          const { event: eventType, data } = message;

          // Solo loguear eventos importantes para reducir spam
          if (eventType !== 'game:tick' && eventType !== 'player:update' && eventType !== 'enemy:update') {
            console.log(`📨 Evento recibido: ${eventType}`);
          }

          // Manejar diferentes eventos
          switch (eventType) {
            case 'connected':
              callbacksRef.current.onConnected?.(data);
              break;
            case 'room:state':
              callbacksRef.current.onRoomState?.(data);
              break;
            case 'game:start':
              callbacksRef.current.onGameStart?.();
              break;
            case 'game:tick':
              callbacksRef.current.onGameTick?.(data);
              break;
            case 'player:update':
              callbacksRef.current.onPlayerUpdate?.(data);
              break;
            case 'enemy:update':
              callbacksRef.current.onEnemyUpdate?.(data);
              break;
            case 'attack:received':
              callbacksRef.current.onAttackReceived?.(data);
              break;
            case 'game:end':
              callbacksRef.current.onGameEnd?.(data);
              break;
            case 'energy:threshold_reached':
              callbacksRef.current.onEnergyThresholdReached?.();
              break;
            case 'player:disconnected':
              callbacksRef.current.onPlayerDisconnected?.(data);
              break;
            case 'error':
              callbacksRef.current.onError?.(data);
              break;
            default:
              console.warn(`⚠️ Evento no manejado: ${eventType}`);
          }
        } catch (error) {
          console.error('❌ Error al procesar mensaje:', error);
        }
      };

      ws.onclose = (event) => {
        console.log('🔌 Conexión WebSocket cerrada', event.code, event.reason);
        setIsConnected(false);
        setIsConnecting(false);
        callbacksRef.current.onDisconnected?.();

        // Intentar reconectar si no fue un cierre intencional
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 10000);
          console.log(`🔄 Reconectando en ${delay}ms... (intento ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);

          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        }
      };

      ws.onerror = (error) => {
        console.error('❌ Error en WebSocket:', error);
        callbacksRef.current.onError?.({ message: 'Error de conexión' });
      };
    } catch (error) {
      console.error('❌ Error al crear conexión WebSocket:', error);
      setIsConnecting(false);
      callbacksRef.current.onError?.({ message: 'No se pudo establecer la conexión' });
    }
  }, []); // Sin dependencias - se crea una sola vez

  /**
   * Desconecta del servidor WebSocket
   */
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, 'Cierre voluntario');
      wsRef.current = null;
    }

    setIsConnected(false);
  }, []);

  /**
   * Envía un mensaje al servidor
   */
  const send = useCallback((event: string, data: any = {}) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const message: WSMessage = { event, data };
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('⚠️ WebSocket no conectado, no se puede enviar mensaje');
    }
  }, []);

  /**
   * Efecto para conectar automáticamente al montar el componente (solo una vez)
   */
  useEffect(() => {
    if (!hasConnectedRef.current) {
      hasConnectedRef.current = true;
      connect();
    }

    return () => {
      disconnect();
    };
  }, []); // Sin dependencias - solo se ejecuta al montar

  /**
   * Funciones para enviar eventos específicos al servidor
   */
  const joinRoom = useCallback((playerName: string) => {
    send('player:join', { playerName });
  }, [send]);

  const setReady = useCallback(() => {
    send('player:ready', {});
  }, [send]);

  const click = useCallback(() => {
    send('player:click', {});
  }, [send]);

  const buyFood = useCallback((amount: number = 10) => {
    send('player:buy_food', { amount });
  }, [send]);

  const buyUpgrade = useCallback((upgradeId: string) => {
    send('player:buy_upgrade', { upgradeId });
  }, [send]);

  const buyAttack = useCallback((attackId: string) => {
    send('player:buy_attack', { attackId });
  }, [send]);

  const buyItem = useCallback((itemId: string) => {
    send('player:buy_item', { itemId });
  }, [send]);

  const useItem = useCallback((itemId: string) => {
    send('player:use_item', { itemId });
  }, [send]);

  const makeEnergyChoice = useCallback((choiceId: string) => {
    send('player:energy_choice', { choiceId });
  }, [send]);

  return {
    isConnected,
    isConnecting,
    connect,
    disconnect,
    send,
    // Eventos del juego
    joinRoom,
    setReady,
    click,
    buyFood,
    buyUpgrade,
    buyAttack,
    buyItem,
    useItem,
    makeEnergyChoice,
  };
};
