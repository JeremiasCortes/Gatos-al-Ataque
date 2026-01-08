/**
 * Tipos de eventos WebSocket - Cliente
 */

/**
 * Eventos que el cliente puede enviar al servidor
 */
export enum ClientEvents {
  JOIN_ROOM = 'player:join',
  READY = 'player:ready',
  CLICK = 'player:click',
  BUY_UPGRADE = 'player:buy_upgrade',
  BUY_ATTACK = 'player:buy_attack',
  BUY_ITEM = 'player:buy_item',
  USE_ITEM = 'player:use_item',
  BUY_FOOD = 'player:buy_food',
  ENERGY_CHOICE = 'player:energy_choice',
}

/**
 * Eventos que el servidor puede enviar al cliente
 */
export enum ServerEvents {
  CONNECTED = 'connected',
  ROOM_STATE = 'room:state',
  GAME_START = 'game:start',
  GAME_TICK = 'game:tick',
  PLAYER_UPDATE = 'player:update',
  ENEMY_UPDATE = 'enemy:update',
  ATTACK_RECEIVED = 'attack:received',
  GAME_END = 'game:end',
  ERROR = 'error',
  ENERGY_THRESHOLD_REACHED = 'energy:threshold_reached',
  PLAYER_DISCONNECTED = 'player:disconnected',
}

/**
 * Mensaje WebSocket genérico
 */
export interface WSMessage<T = any> {
  event: string;
  data: T;
}

/**
 * Callbacks de eventos WebSocket
 */
export interface WSEventCallbacks {
  onConnected?: (data: { playerId: string; message: string }) => void;
  onRoomState?: (data: { gameState: any }) => void;
  onGameStart?: () => void;
  onGameTick?: (data: { timestamp: number }) => void;
  onPlayerUpdate?: (data: { playerId: string; player: any }) => void;
  onEnemyUpdate?: (data: { playerId: string; player: any }) => void;
  onAttackReceived?: (data: { attackName: string; damage: number }) => void;
  onGameEnd?: (data: { winnerId: string; winnerName: string }) => void;
  onError?: (data: { message: string }) => void;
  onEnergyThresholdReached?: () => void;
  onPlayerDisconnected?: (data: { playerId: string; playerName: string }) => void;
  onConnecting?: () => void;
  onDisconnected?: () => void;
}
