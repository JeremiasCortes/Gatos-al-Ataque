/**
 * WebSocketServer - Servidor WebSocket para el juego
 *
 * Gestiona las conexiones de los jugadores y las salas de juego
 */

import { WebSocketServer as WSServer, WebSocket } from 'ws';
import { GameRoom } from '../game/GameRoom';
import { ClientEvents } from '../types/websocket.types';
import { GAME_CONFIG } from '../config/constants';

/**
 * Información de un cliente conectado
 */
interface ClientInfo {
  ws: WebSocket;
  playerId: string;
  playerName: string;
  room: GameRoom | null;
}

/**
 * Servidor WebSocket del juego
 */
export class GameWebSocketServer {
  private wss: WSServer;
  private clients: Map<WebSocket, ClientInfo>;
  private waitingRoom: GameRoom | null;

  constructor(port: number = GAME_CONFIG.WS_PORT) {
    this.wss = new WSServer({ port, host: '0.0.0.0' });
    this.clients = new Map();
    this.waitingRoom = null;

    this.setupServerHandlers();
    console.log(`🎮 Servidor WebSocket iniciado en puerto ${port}`);
  }

  /**
   * Configura los manejadores de eventos del servidor
   */
  private setupServerHandlers(): void {
    this.wss.on('connection', (ws: WebSocket) => {
      console.log('🔌 Nuevo cliente conectado');

      // Generar ID único para el jugador
      const playerId = this.generatePlayerId();

      // Crear info del cliente
      this.clients.set(ws, {
        ws,
        playerId,
        playerName: '',
        room: null,
      });

      // Configurar manejadores de mensajes del cliente
      ws.on('message', (data: Buffer) => {
        this.handleMessage(ws, data);
      });

      // Manejar desconexión
      ws.on('close', () => {
        this.handleDisconnect(ws);
      });

      // Manejar errores
      ws.on('error', (error) => {
        console.error('❌ Error en WebSocket:', error);
      });

      // Enviar mensaje de bienvenida con el ID del jugador
      this.sendToClient(ws, 'connected', {
        playerId,
        message: 'Conectado al servidor de Batalla de Gatos',
      });
    });
  }

  /**
   * Genera un ID único para el jugador
   */
  private generatePlayerId(): string {
    return `player_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Maneja los mensajes recibidos de un cliente
   */
  private handleMessage(ws: WebSocket, data: Buffer): void {
    const client = this.clients.get(ws);
    if (!client) return;

    try {
      const message = JSON.parse(data.toString());
      const { event, data: messageData } = message;

      console.log(`📨 Recibido: ${event} de ${client.playerName || client.playerId}`);

      switch (event) {
        case ClientEvents.JOIN_ROOM:
          this.handleJoinRoom(client, messageData);
          break;

        case ClientEvents.READY:
          this.handleReady(client);
          break;

        case ClientEvents.CLICK:
          this.handleClick(client);
          break;

        case ClientEvents.BUY_FOOD:
          this.handleBuyFood(client, messageData);
          break;

        case ClientEvents.BUY_UPGRADE:
          this.handleBuyUpgrade(client, messageData);
          break;

        case ClientEvents.BUY_ATTACK:
          this.handleBuyAttack(client, messageData);
          break;

        case ClientEvents.BUY_ITEM:
          this.handleBuyItem(client, messageData);
          break;

        case ClientEvents.USE_ITEM:
          this.handleUseItem(client, messageData);
          break;

        case ClientEvents.ENERGY_CHOICE:
          this.handleEnergyChoice(client, messageData);
          break;

        default:
          console.warn(`⚠️ Evento desconocido: ${event}`);
          this.sendToClient(ws, 'error', { message: `Evento desconocido: ${event}` });
      }
    } catch (error) {
      console.error('❌ Error al procesar mensaje:', error);
      this.sendToClient(ws, 'error', { message: 'Error al procesar mensaje' });
    }
  }

  /**
   * Maneja la petición de unirse a una sala
   */
  private handleJoinRoom(client: ClientInfo, data: any): void {
    const { playerName } = data;

    if (!playerName || playerName.trim() === '') {
      this.sendToClient(client.ws, 'error', { message: 'Nombre de jugador inválido' });
      return;
    }

    client.playerName = playerName.trim();

    // Si no hay sala de espera O la sala actual está llena, crear una nueva
    if (!this.waitingRoom || this.waitingRoom.getPlayerCount() >= 2) {
      const newRoom = new GameRoom((event, data, excludePlayerId) => {
        this.broadcastToRoom(newRoom, event, data, excludePlayerId);
      });
      this.waitingRoom = newRoom;
      console.log(`🏠 Nueva sala creada: ${this.waitingRoom.roomId}`);
    }

    // Añadir jugador a la sala
    this.waitingRoom.addPlayer(client.playerId, client.playerName);
    client.room = this.waitingRoom;

    console.log(`👤 Jugador "${client.playerName}" (${client.playerId}) se unió a la sala ${this.waitingRoom.roomId}`);

    // Enviar estado actual de la sala
    this.broadcastToRoom(client.room, 'room:state', {
      gameState: client.room.getSerializableState(),
    });
  }

  /**
   * Maneja cuando un jugador marca como listo
   */
  private handleReady(client: ClientInfo): void {
    if (!client.room) return;

    console.log(`✅ Jugador "${client.playerName}" está listo`);
    client.room.setPlayerReady(client.playerId);
  }

  /**
   * Maneja un clic del jugador
   */
  private handleClick(client: ClientInfo): void {
    if (!client.room) return;
    client.room.handleClick(client.playerId);
  }

  /**
   * Maneja la compra de pienso
   */
  private handleBuyFood(client: ClientInfo, data: any): void {
    if (!client.room) return;

    const { amount = 10 } = data;
    const success = client.room.handleBuyFood(client.playerId, amount);

    if (!success) {
      this.sendToClient(client.ws, 'error', { message: 'No tienes suficiente energía' });
    }
  }

  /**
   * Maneja la compra de una mejora
   */
  private handleBuyUpgrade(client: ClientInfo, data: any): void {
    if (!client.room) return;

    const { upgradeId } = data;
    const success = client.room.handleBuyUpgrade(client.playerId, upgradeId);

    if (!success) {
      this.sendToClient(client.ws, 'error', { message: 'No puedes comprar esta mejora' });
    }
  }

  /**
   * Maneja la compra de un ataque
   */
  private handleBuyAttack(client: ClientInfo, data: any): void {
    if (!client.room) return;

    const { attackId } = data;
    const success = client.room.handleBuyAttack(client.playerId, attackId);

    if (!success) {
      this.sendToClient(client.ws, 'error', { message: 'No tienes suficiente pienso' });
    }
  }

  /**
   * Maneja la compra de un item
   */
  private handleBuyItem(client: ClientInfo, data: any): void {
    if (!client.room) return;

    const { itemId } = data;
    const success = client.room.handleBuyItem(client.playerId, itemId);

    if (!success) {
      this.sendToClient(client.ws, 'error', { message: 'No puedes comprar este item' });
    }
  }

  /**
   * Maneja el uso de un item
   */
  private handleUseItem(client: ClientInfo, data: any): void {
    if (!client.room) return;

    const { itemId } = data;
    const success = client.room.handleUseItem(client.playerId, itemId);

    if (!success) {
      this.sendToClient(client.ws, 'error', { message: 'No puedes usar este item' });
    }
  }

  /**
   * Maneja la elección del modal de energía
   */
  private handleEnergyChoice(client: ClientInfo, data: any): void {
    if (!client.room) return;

    const { choiceId } = data;
    const success = client.room.handleEnergyChoice(client.playerId, choiceId);

    if (!success) {
      this.sendToClient(client.ws, 'error', { message: 'No puedes realizar esta acción' });
    }
  }

  /**
   * Maneja la desconexión de un cliente
   */
  private handleDisconnect(ws: WebSocket): void {
    const client = this.clients.get(ws);
    if (!client) return;

    console.log(`🔌 Cliente desconectado: ${client.playerName || client.playerId}`);

    // Si está en una sala, eliminarlo
    if (client.room) {
      client.room.removePlayer(client.playerId);

      // Si la sala se queda vacía, eliminarla
      if (client.room.getPlayerCount() === 0) {
        client.room.destroy();
        if (this.waitingRoom === client.room) {
          this.waitingRoom = null;
        }
      } else {
        // Notificar al otro jugador
        this.broadcastToRoom(client.room, 'player:disconnected', {
          playerId: client.playerId,
          playerName: client.playerName,
        });
      }
    }

    this.clients.delete(ws);
  }

  /**
   * Envía un mensaje a un cliente específico
   */
  private sendToClient(ws: WebSocket, event: string, data: any): void {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ event, data }));
    }
  }

  /**
   * Envía un mensaje a todos los clientes de una sala
   */
  private broadcastToRoom(room: GameRoom, event: string, data: any, excludePlayerId?: string): void {
    const state = room.getSerializableState();
    const players = state.players || {};
    const playerIds = Object.keys(players);

    for (const [ws, client] of this.clients.entries()) {
      if (client.room === room) {
        // No enviar al jugador excluido (si se especifica)
        if (excludePlayerId && client.playerId === excludePlayerId) {
          continue;
        }
        this.sendToClient(ws, event, data);
      }
    }
  }

  /**
   * Cierra el servidor y limpia recursos
   */
  public close(): void {
    for (const client of this.clients.values()) {
      if (client.room) {
        client.room.destroy();
      }
    }
    this.wss.close();
    console.log('👋 Servidor WebSocket cerrado');
  }
}
