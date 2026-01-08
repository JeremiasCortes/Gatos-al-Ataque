/**
 * GameRoom - Gestiona una sala de juego con dos jugadores
 *
 * Responsabilidades:
 * - Mantener el estado del juego
 * - Validar acciones de jugadores
 * - Aplicar efectos de mejoras, ataques e items
 * - Actualizar recursos pasivos cada segundo (game tick)
 * - Detectar condición de victoria
 * - Sincronizar estado con ambos clientes
 */

import { v4 as uuidv4 } from 'uuid';
import { GameState, PlayerState, PlayerModifiers } from '../types/game.types';
import { GAME_CONFIG, ENERGY_MODAL_OPTIONS, ALL_UPGRADES, ALL_ATTACKS, ALL_ITEMS } from '../config/constants';

/**
 * Clase que representa una sala de juego
 */
export class GameRoom {
  public readonly roomId: string;
  private gameState: GameState;
  private tickInterval: NodeJS.Timeout | null = null;
  private readonly broadcastCallback: (event: string, data: any, excludePlayerId?: string) => void;

  constructor(broadcastCallback: (event: string, data: any, excludePlayerId?: string) => void) {
    this.roomId = uuidv4().substring(0, 8);
    this.gameState = this.initializeGameState();
    this.broadcastCallback = broadcastCallback;
  }

  /**
   * Inicializa el estado del juego con valores por defecto
   */
  private initializeGameState(): GameState {
    return {
      roomId: this.roomId,
      gameStarted: false,
      gameEnded: false,
      winner: null,
      players: {},
    };
  }

  /**
   * Crea el estado inicial de un jugador
   */
  private createInitialPlayerState(playerId: string, playerName: string): PlayerState {
    return {
      id: playerId,
      name: playerName,
      ready: false,
      health: GAME_CONFIG.INITIAL_HEALTH,
      maxHealth: GAME_CONFIG.INITIAL_HEALTH,
      money: GAME_CONFIG.INITIAL_MONEY,
      energy: GAME_CONFIG.INITIAL_ENERGY,
      food: GAME_CONFIG.INITIAL_FOOD,
      moneyPerSecond: GAME_CONFIG.BASE_MONEY_PER_SECOND,
      energyPerSecond: GAME_CONFIG.BASE_ENERGY_PER_SECOND,
      damagePerSecond: 0,
      clickPower: GAME_CONFIG.INITIAL_CLICK_POWER,
      modifiers: {
        earningsMultiplier: 1,
        passiveEarningsMultiplier: 1,
        damageMultiplier: 1,
      },
      upgrades: {},
      items: {},
    };
  }

  /**
   * Añade un jugador a la sala
   */
  public addPlayer(playerId: string, playerName: string): void {
    this.gameState.players[playerId] = this.createInitialPlayerState(playerId, playerName);
    this.broadcastState();
  }

  /**
   * Elimina un jugador de la sala
   */
  public removePlayer(playerId: string): void {
    delete this.gameState.players[playerId];

    // Si el juego está en curso y se va un jugador, terminarlo
    if (this.gameState.gameStarted && !this.gameState.gameEnded) {
      const remainingPlayerId = Object.keys(this.gameState.players)[0];
      if (remainingPlayerId) {
        this.endGame(remainingPlayerId);
      }
    }
  }

  /**
   * Obtiene el número de jugadores en la sala
   */
  public getPlayerCount(): number {
    return Object.keys(this.gameState.players).length;
  }

  /**
   * Marca un jugador como listo
   */
  public setPlayerReady(playerId: string): void {
    const player = this.gameState.players[playerId];
    if (player) {
      player.ready = true;
      this.broadcastState();

      // Si ambos jugadores están listos, iniciar el juego
      if (this.areAllPlayersReady()) {
        this.startGame();
      }
    }
  }

  /**
   * Verifica si todos los jugadores están listos
   */
  private areAllPlayersReady(): boolean {
    const players = Object.values(this.gameState.players);
    return players.length === 2 && players.every(p => p.ready);
  }

  /**
   * Inicia el juego y el game tick
   */
  private startGame(): void {
    this.gameState.gameStarted = true;

    // Entrar el estado actualizado con gameStarted=true
    this.broadcastState();

    // Entrar el evento de inicio
    this.broadcastCallback('game:start', {});

    // Iniciar el tick del juego (actualización cada segundo)
    this.tickInterval = setInterval(() => {
      this.gameTick();
    }, GAME_CONFIG.GAME_TICK_RATE);
  }

  /**
   * Actualización del juego cada segundo
   * - Genera recursos pasivos
   * - Aplica daño pasivo entre jugadores
   * - Verifica condiciones de victoria
   */
  private gameTick(): void {
    const playerIds = Object.keys(this.gameState.players);

    for (const playerId of playerIds) {
      const player = this.gameState.players[playerId];
      const enemy = this.getEnemyPlayer(playerId);

      if (!player) continue;

      // Generar dinero pasivo (con modificadores)
      const moneyGain = player.moneyPerSecond *
                        player.modifiers.earningsMultiplier *
                        player.modifiers.passiveEarningsMultiplier;
      player.money += moneyGain;

      // Generar energía pasiva (con modificadores)
      const energyGain = player.energyPerSecond * player.modifiers.earningsMultiplier;
      player.energy = Math.min(
        player.energy + energyGain,
        GAME_CONFIG.MAX_ENERGY
      );

      // Verificar si alcanzó el umbral de energía
      if (player.energy >= GAME_CONFIG.MAX_ENERGY) {
        this.broadcastCallback('energy:threshold_reached', {}, playerId);
      }

      // Aplicar daño pasivo al enemigo (con modificadores del enemigo)
      if (player.damagePerSecond > 0 && enemy) {
        const damageDealt = player.damagePerSecond * enemy.modifiers.damageMultiplier;
        enemy.health = Math.max(0, enemy.health - damageDealt);
      }
    }

    // Verificar condición de victoria
    this.checkWinCondition();

    // Enviar actualización del tick
    this.broadcastCallback('game:tick', { timestamp: Date.now() });

    // Enviar actualizaciones de jugadores
    this.broadcastPlayerUpdates();
  }

  /**
   * Procesa un clic del jugador
   */
  public handleClick(playerId: string): void {
    const player = this.gameState.players[playerId];
    if (!player || !this.gameState.gameStarted) return;

    const moneyGain = player.clickPower * player.modifiers.earningsMultiplier;
    player.money += moneyGain;

    this.sendPlayerUpdate(playerId);
  }

  /**
   * Procesa la compra de pienso
   */
  public handleBuyFood(playerId: string, amount: number): boolean {
    const player = this.gameState.players[playerId];
    if (!player || !this.gameState.gameStarted) return false;

    const energyCost = amount * GAME_CONFIG.ENERGY_TO_FOOD_RATIO;

    if (player.energy < energyCost) return false;

    player.energy -= energyCost;
    player.food += amount;

    this.sendPlayerUpdate(playerId);
    return true;
  }

  /**
   * Procesa la compra de una mejora
   */
  public handleBuyUpgrade(playerId: string, upgradeId: string): boolean {
    const player = this.gameState.players[playerId];
    const upgrade = ALL_UPGRADES.find(u => u.id === upgradeId);

    if (!player || !upgrade || !this.gameState.gameStarted) return false;

    // Calcular nivel actual de la mejora
    const currentLevel = player.upgrades[upgradeId] || 0;

    // Verificar nivel máximo
    if (upgrade.maxLevel && currentLevel >= upgrade.maxLevel) return false;

    // Calcular costo de esta mejora
    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));

    if (player.money < cost) return false;

    // Aplicar compra
    player.money -= cost;
    player.upgrades[upgradeId] = currentLevel + 1;

    // Aplicar efecto de la mejora
    this.applyUpgradeEffect(player, upgrade);

    this.sendPlayerUpdate(playerId);
    return true;
  }

  /**
   * Aplica el efecto de una mejora al jugador
   */
  private applyUpgradeEffect(player: PlayerState, upgrade: any): void {
    switch (upgrade.category) {
      case 'money_passive':
        player.moneyPerSecond += upgrade.effectPerLevel;
        break;
      case 'energy_passive':
        player.energyPerSecond += upgrade.effectPerLevel;
        break;
      case 'health_max':
        player.maxHealth += upgrade.effectPerLevel;
        player.health += upgrade.effectPerLevel;
        break;
      case 'click_power':
        player.clickPower += upgrade.effectPerLevel;
        break;
    }
  }

  /**
   * Procesa la compra de un ataque
   */
  public handleBuyAttack(playerId: string, attackId: string): boolean {
    const player = this.gameState.players[playerId];
    const enemy = this.getEnemyPlayer(playerId);
    const attack = ALL_ATTACKS.find(a => a.id === attackId);

    if (!player || !enemy || !attack || !this.gameState.gameStarted) return false;

    if (player.food < attack.foodCost) return false;

    // Aplicar compra
    player.food -= attack.foodCost;

    // Aplicar efecto del ataque
    if (attack.type === 'instant') {
      const damageDealt = attack.damage * enemy.modifiers.damageMultiplier;
      enemy.health = Math.max(0, enemy.health - damageDealt);

      // Notificar al enemigo que recibió un ataque
      this.broadcastCallback('attack:received', {
        attackName: attack.name,
        damage: damageDealt,
      }, playerId);
    } else {
      player.damagePerSecond += attack.damage;
    }

    this.sendPlayerUpdate(playerId);
    this.sendPlayerUpdate(enemy.id);
    return true;
  }

  /**
   * Procesa la compra de un item
   */
  public handleBuyItem(playerId: string, itemId: string): boolean {
    const player = this.gameState.players[playerId];
    const item = ALL_ITEMS.find(i => i.id === itemId);

    if (!player || !item || !this.gameState.gameStarted) return false;

    // Verificar costo
    let canAfford = false;
    if (item.cost.type === 'money') {
      canAfford = player.money >= item.cost.amount;
      if (canAfford) player.money -= item.cost.amount;
    } else if (item.cost.type === 'food') {
      canAfford = player.food >= item.cost.amount;
      if (canAfford) player.food -= item.cost.amount;
    }

    if (!canAfford) return false;

    // Si es stackable, añadir al inventario
    if (item.stackable) {
      player.items[itemId] = (player.items[itemId] || 0) + 1;
    } else {
      // Si no es stackable, usarlo inmediatamente
      this.applyItemEffect(player, item);
      const enemy = this.getEnemyPlayer(playerId);
      if (enemy) {
        this.sendPlayerUpdate(enemy.id);
      }
    }

    this.sendPlayerUpdate(playerId);
    return true;
  }

  /**
   * Procesa el uso de un item del inventario
   */
  public handleUseItem(playerId: string, itemId: string): boolean {
    const player = this.gameState.players[playerId];
    const item = ALL_ITEMS.find(i => i.id === itemId);

    if (!player || !item || !this.gameState.gameStarted) return false;

    // Verificar si tiene el item
    if (!player.items[itemId] || player.items[itemId] <= 0) return false;

    // Usar el item
    player.items[itemId]--;
    if (player.items[itemId] <= 0) {
      delete player.items[itemId];
    }

    this.applyItemEffect(player, item);

    const enemy = this.getEnemyPlayer(playerId);
    if (enemy) {
      this.sendPlayerUpdate(enemy.id);
    }

    this.sendPlayerUpdate(playerId);
    return true;
  }

  /**
   * Aplica el efecto de un item al jugador
   */
  private applyItemEffect(player: PlayerState, item: any): void {
    const effect = item.effect;
    const enemy = this.getEnemyPlayer(player.id);

    switch (effect.type) {
      case 'instant_money':
        player.money += effect.amount;
        break;
      case 'instant_energy':
        player.energy += effect.amount;
        break;
      case 'instant_health':
        player.health = Math.min(player.maxHealth, player.health + effect.amount);
        break;
      case 'instant_damage':
        if (enemy) {
          const damageDealt = effect.amount * enemy.modifiers.damageMultiplier;
          enemy.health = Math.max(0, enemy.health - damageDealt);
          this.broadcastCallback('attack:received', {
            attackName: item.name,
            damage: damageDealt,
          }, player.id);
        }
        break;
      case 'money_per_second':
        player.moneyPerSecond += effect.amount;
        break;
      case 'energy_per_second':
        player.energyPerSecond += effect.amount;
        break;
      case 'damage_per_second':
        player.damagePerSecond += effect.amount;
        break;
      case 'click_multiplier':
        // Se implementaría con un sistema de buffs temporales
        // Por ahora, aplicamos un multiplicador permanente simplificado
        player.clickPower *= effect.multiplier;
        break;
    }
  }

  /**
   * Procesa la elección cuando la energía llega a 1000
   */
  public handleEnergyChoice(playerId: string, choiceId: string): boolean {
    const player = this.gameState.players[playerId];
    const enemy = this.getEnemyPlayer(playerId);

    if (!player || player.energy < GAME_CONFIG.ENERGY_THRESHOLD) return false;

    // Consumir energía
    player.energy = 0;

    // Aplicar efecto según la elección
    const choice = ENERGY_MODAL_OPTIONS.find(o => o.id === choiceId);
    if (!choice) return false;

    const effect = choice.effect;

    switch (effect.type) {
      case 'instant_damage':
        if (enemy) {
          const damageDealt = effect.value * enemy.modifiers.damageMultiplier;
          enemy.health = Math.max(0, enemy.health - damageDealt);
          this.broadcastCallback('attack:received', {
            attackName: choice.name,
            damage: damageDealt,
          }, playerId);
        }
        break;

      case 'instant_heal':
        player.health = Math.min(player.maxHealth, player.health + effect.value);
        break;

      case 'permanent_modifier': {
        const mod = effect as { earningsMultiplier?: number; passiveEarningsMultiplier?: number; damageMultiplier?: number };
        if (mod.earningsMultiplier) {
          player.modifiers.earningsMultiplier *= mod.earningsMultiplier;
        }
        if (mod.passiveEarningsMultiplier) {
          player.modifiers.passiveEarningsMultiplier *= mod.passiveEarningsMultiplier;
        }
        if (mod.damageMultiplier) {
          player.modifiers.damageMultiplier *= mod.damageMultiplier;
        }
        break;
      }
    }

    this.sendPlayerUpdate(playerId);
    if (enemy) {
      this.sendPlayerUpdate(enemy.id);
    }
    return true;
  }

  /**
   * Verifica si algún jugador ha ganado
   */
  private checkWinCondition(): void {
    const playerIds = Object.keys(this.gameState.players);

    for (const playerId of playerIds) {
      const player = this.gameState.players[playerId];

      if (player.health <= 0) {
        const winnerId = playerIds.find(id => id !== playerId);
        if (winnerId) {
          this.endGame(winnerId);
        }
        break;
      }
    }
  }

  /**
   * Termina el juego y declara un ganador
   */
  private endGame(winnerId: string): void {
    this.gameState.gameEnded = true;
    this.gameState.winner = winnerId;

    const winner = this.gameState.players[winnerId];

    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }

    this.broadcastCallback('game:end', {
      winnerId,
      winnerName: winner?.name || 'Desconocido',
    });
  }

  /**
   * Obtiene el jugador enemigo
   */
  private getEnemyPlayer(playerId: string): PlayerState | null {
    const enemyId = Object.keys(this.gameState.players).find(id => id !== playerId);
    return enemyId ? this.gameState.players[enemyId] : null;
  }

  /**
   * Envía actualización del estado completo a todos los jugadores
   */
  private broadcastState(): void {
    this.broadcastCallback('room:state', {
      gameState: this.getSerializableState(),
    });
  }

  /**
   * Envía actualización de un jugador específico
   */
  private sendPlayerUpdate(playerId: string): void {
    this.broadcastCallback('player:update', {
      playerId,
      player: this.gameState.players[playerId],
    });

    // También enviar como actualización del enemigo para el otro jugador
    const enemyId = Object.keys(this.gameState.players).find(id => id !== playerId);
    if (enemyId) {
      this.broadcastCallback('enemy:update', {
        playerId,
        player: this.gameState.players[playerId],
      }, playerId);
    }
  }

  /**
   * Envía actualizaciones de todos los jugadores
   */
  private broadcastPlayerUpdates(): void {
    const playerIds = Object.keys(this.gameState.players);
    for (const playerId of playerIds) {
      this.sendPlayerUpdate(playerId);
    }
  }

  /**
   * Obtiene el estado del juego de forma serializable (sin funciones)
   */
  public getSerializableState(): Partial<GameState> {
    return {
      roomId: this.roomId,
      gameStarted: this.gameState.gameStarted,
      gameEnded: this.gameState.gameEnded,
      winner: this.gameState.winner,
      players: this.gameState.players,
    };
  }

  /**
   * Getters públicos
   */
  public getGameState(): GameState {
    return this.gameState;
  }

  public isGameStarted(): boolean {
    return this.gameState.gameStarted;
  }

  public isGameEnded(): boolean {
    return this.gameState.gameEnded;
  }

  /**
   * Limpia recursos al destruir la sala
   */
  public destroy(): void {
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }
}
