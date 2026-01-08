/**
 * Tipos de eventos WebSocket
 * Definiciones de mensajes entre cliente y servidor
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
  ROOM_STATE = 'room:state',
  GAME_START = 'game:start',
  GAME_TICK = 'game:tick',
  PLAYER_UPDATE = 'player:update',
  ENEMY_UPDATE = 'enemy:update',
  ATTACK_RECEIVED = 'attack:received',
  GAME_END = 'game:end',
  ERROR = 'error',
  ENERGY_THRESHOLD_REACHED = 'energy:threshold_reached',
}

/**
 * Payloads de eventos del cliente
 */
export interface ClientEventPayloads {
  [ClientEvents.JOIN_ROOM]: { playerName: string };
  [ClientEvents.READY]: {};
  [ClientEvents.CLICK]: {};
  [ClientEvents.BUY_UPGRADE]: { upgradeId: string };
  [ClientEvents.BUY_ATTACK]: { attackId: string };
  [ClientEvents.BUY_ITEM]: { itemId: string };
  [ClientEvents.USE_ITEM]: { itemId: string };
  [ClientEvents.BUY_FOOD]: { amount: number };
  [ClientEvents.ENERGY_CHOICE]: { choiceId: string };
}

/**
 * Payloads de eventos del servidor
 */
export interface ServerEventPayloads {
  [ServerEvents.ROOM_STATE]: { gameState: any };
  [ServerEvents.GAME_START]: {};
  [ServerEvents.GAME_TICK]: { timestamp: number };
  [ServerEvents.PLAYER_UPDATE]: { playerId: string; updates: any };
  [ServerEvents.ENEMY_UPDATE]: { playerId: string; updates: any };
  [ServerEvents.ATTACK_RECEIVED]: { attackName: string; damage: number };
  [ServerEvents.GAME_END]: { winnerId: string; winnerName: string };
  [ServerEvents.ERROR]: { message: string };
  [ServerEvents.ENERGY_THRESHOLD_REACHED]: {};
}
