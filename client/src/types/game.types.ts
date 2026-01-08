/**
 * Tipos de datos del juego - Cliente
 * Definiciones TypeScript para estado del juego, jugadores, mejoras, ataques e items
 */

/**
 * Modificadores permanentes del jugador (de las elecciones de energía)
 */
export interface PlayerModifiers {
  earningsMultiplier: number;          // Multiplicador de todas las ganancias
  passiveEarningsMultiplier: number;    // Multiplicador solo de pasivas
  damageMultiplier: number;             // Multiplicador de daño recibido
}

/**
 * Estado de un jugador individual
 */
export interface PlayerState {
  id: string;
  name: string;
  ready: boolean;

  // Recursos
  health: number;
  maxHealth: number;
  money: number;
  energy: number;
  food: number;

  // Tasas de generación pasiva
  moneyPerSecond: number;
  energyPerSecond: number;
  damagePerSecond: number;

  // Poder de clic
  clickPower: number;

  // Modificadores permanentes
  modifiers: PlayerModifiers;

  // Progreso de mejoras
  upgrades: {
    [upgradeId: string]: number;
  };

  // Items acumulados
  items: {
    [itemId: string]: number;
  };
}

/**
 * Estado completo del juego
 */
export interface GameState {
  roomId: string;
  gameStarted: boolean;
  gameEnded: boolean;
  winner: string | null;
  players: {
    [playerId: string]: PlayerState;
  };
}

/**
 * Tipo de mejora
 */
export interface Upgrade {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'money_passive' | 'energy_passive' | 'health_max' | 'click_power';
  baseCost: number;
  costMultiplier: number;
  effectPerLevel: number;
  maxLevel: number | null;
}

/**
 * Tipo de ataque
 */
export interface Attack {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'instant' | 'passive';
  damage: number;
  foodCost: number;
}

/**
 * Tipo de item
 */
export interface Item {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: {
    type: 'money' | 'food';
    amount: number;
  };
  effect: ItemEffect;
  stackable: boolean;
  maxStack?: number;
}

/**
 * Efecto de un item
 */
export type ItemEffect =
  | { type: 'instant_money'; amount: number }
  | { type: 'instant_energy'; amount: number }
  | { type: 'instant_health'; amount: number }
  | { type: 'instant_damage'; amount: number }
  | { type: 'money_per_second'; amount: number }
  | { type: 'energy_per_second'; amount: number }
  | { type: 'damage_per_second'; amount: number }
  | { type: 'click_multiplier'; multiplier: number; duration: number };

/**
 * Opción del modal de energía
 */
export interface EnergyModalOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  effect: EnergyModalEffect;
}

/**
 * Efecto del modal de energía
 */
export type EnergyModalEffect =
  | { type: 'instant_damage'; value: number }
  | { type: 'instant_heal'; value: number }
  | { type: 'permanent_modifier'; earningsMultiplier?: number; passiveEarningsMultiplier?: number; damageMultiplier?: number };
