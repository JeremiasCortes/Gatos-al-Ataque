/**
 * Configuración inicial del juego - Cliente
 * Todos los valores de inicio y constantes del juego
 */

export const GAME_CONFIG = {
  // Valores iniciales de los jugadores
  INITIAL_HEALTH: 10000,
  INITIAL_MONEY: 50,
  INITIAL_ENERGY: 100,
  INITIAL_FOOD: 0,
  INITIAL_CLICK_POWER: 1,

  // Tasas de regeneración base (por segundo)
  BASE_ENERGY_PER_SECOND: 1,
  BASE_MONEY_PER_SECOND: 0,

  // Conversión de recursos
  ENERGY_TO_FOOD_RATIO: 10,
  FOOD_COST_PER_ENERGY: 100,

  // Sistema de energía especial
  ENERGY_THRESHOLD: 1000,

  // Tick rate del juego (ms)
  GAME_TICK_RATE: 1000,

  // Límites
  MAX_ENERGY: 1000,

  // Puerto del servidor WebSocket
  WS_PORT: 3001,
  WS_URL: `wss://localhost:3001`,
};

/**
 * Obtiene la URL del WebSocket según el entorno
 * Si es localhost, usa ws://localhost:3001
 * Si es externo, usa la URL del servidor localtunnel
 */
export function getWebSocketURL(): string {
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return 'ws://localhost:3001';
    }
    // Para producción/ngrok/localtunnel: usa la URL fija del servidor
    return 'wss://5bmqprh8-3001.uks1.devtunnels.ms/';
  }
  return 'ws://localhost:3001';
}

/**
 * Opciones disponibles al alcanzar 1000 de energía
 */
export const ENERGY_MODAL_OPTIONS = [
  {
    id: 'damage_enemy',
    name: 'Zarpazo Definitivo',
    description: 'Inflige 100 de daño al enemigo',
    icon: '⚔️',
    effect: {
      type: 'instant_damage',
      value: 100,
    },
  },
  {
    id: 'heal_self',
    name: 'Lamerse las Heridas',
    description: 'Recupera 200 de vida',
    icon: '💚',
    effect: {
      type: 'instant_heal',
      value: 200,
    },
  },
  {
    id: 'boost_earnings',
    name: 'Furia Felina',
    description: '+15% ganancias pero +10% daño recibido',
    icon: '🔥',
    effect: {
      type: 'permanent_modifier',
      earningsMultiplier: 1.15,
      damageMultiplier: 1.10,
    },
  },
  {
    id: 'defensive_stance',
    name: 'Postura Defensiva',
    description: '-10% ganancias pasivas pero -5% daño recibido',
    icon: '🛡️',
    effect: {
      type: 'permanent_modifier',
      passiveEarningsMultiplier: 0.90,
      damageMultiplier: 0.95,
    },
  },
] as const;

/**
 * Configuración de mejoras pasivas de dinero
 */
export const MONEY_PASSIVE_UPGRADES = [
  {
    id: 'scratching_post_basic',
    name: 'Rasca Básico',
    description: 'Un simple poste para rascar que genera monedas',
    icon: '🪵',
    category: 'money_passive' as const,
    baseCost: 10,
    costMultiplier: 1.15,
    effectPerLevel: 1,
    maxLevel: null,
  },
  {
    id: 'milk_bowl',
    name: 'Plato de Leche',
    description: 'Un delicioso plato de leche fresca',
    icon: '🥛',
    category: 'money_passive' as const,
    baseCost: 100,
    costMultiplier: 1.15,
    effectPerLevel: 5,
    maxLevel: null,
  },
  {
    id: 'cardboard_box',
    name: 'Caja de Cartón Premium',
    description: 'La mejor caja para esconderse',
    icon: '📦',
    category: 'money_passive' as const,
    baseCost: 500,
    costMultiplier: 1.15,
    effectPerLevel: 15,
    maxLevel: null,
  },
  {
    id: 'toy_mouse',
    name: 'Ratón de Juguete',
    description: 'Un ratón mecánico que nunca se cansa',
    icon: '🐭',
    category: 'money_passive' as const,
    baseCost: 2000,
    costMultiplier: 1.15,
    effectPerLevel: 50,
    maxLevel: null,
  },
  {
    id: 'cat_tower',
    name: 'Torre para Gatos',
    description: 'Una majestuosa torre de varios niveles',
    icon: '🏰',
    category: 'money_passive' as const,
    baseCost: 10000,
    costMultiplier: 1.15,
    effectPerLevel: 150,
    maxLevel: null,
  },
];

/**
 * Configuración de mejoras de energía pasiva
 */
export const ENERGY_PASSIVE_UPGRADES = [
  {
    id: 'short_nap',
    name: 'Siesta Corta',
    description: 'Un descanso rápido para recuperar energía',
    icon: '😴',
    category: 'energy_passive' as const,
    baseCost: 50,
    costMultiplier: 1.2,
    effectPerLevel: 1,
    maxLevel: null,
  },
  {
    id: 'medium_nap',
    name: 'Siesta Media',
    description: 'Un sueño más profundo y reparador',
    icon: '💤',
    category: 'energy_passive' as const,
    baseCost: 300,
    costMultiplier: 1.2,
    effectPerLevel: 3,
    maxLevel: null,
  },
  {
    id: 'deep_sleep',
    name: 'Siesta Profunda',
    description: 'Sueño profundo de gato satisfecho',
    icon: '🌙',
    category: 'energy_passive' as const,
    baseCost: 1500,
    costMultiplier: 1.2,
    effectPerLevel: 8,
    maxLevel: null,
  },
  {
    id: 'cat_dream',
    name: 'Sueño Gatuno',
    description: 'Soñar con campos infinitos de hierba gatera',
    icon: '✨',
    category: 'energy_passive' as const,
    baseCost: 8000,
    costMultiplier: 1.2,
    effectPerLevel: 20,
    maxLevel: null,
  },
];

/**
 * Configuración de mejoras de vida máxima
 */
export const HEALTH_MAX_UPGRADES = [
  {
    id: 'health_boost_1',
    name: 'Vida Extra I',
    description: 'Aumenta tu vida máxima en 50',
    icon: '❤️',
    category: 'health_max' as const,
    baseCost: 100,
    costMultiplier: 1.5,
    effectPerLevel: 50,
    maxLevel: null,
  },
  {
    id: 'health_boost_2',
    name: 'Vida Extra II',
    description: 'Aumenta tu vida máxima en 100',
    icon: '💕',
    category: 'health_max' as const,
    baseCost: 300,
    costMultiplier: 1.5,
    effectPerLevel: 100,
    maxLevel: null,
  },
  {
    id: 'health_boost_3',
    name: 'Vida Extra III',
    description: 'Aumenta tu vida máxima en 200',
    icon: '💖',
    category: 'health_max' as const,
    baseCost: 800,
    costMultiplier: 1.5,
    effectPerLevel: 200,
    maxLevel: null,
  },
];

/**
 * Configuración de mejoras de poder de clic
 */
export const CLICK_POWER_UPGRADES = [
  {
    id: 'sharper_claws',
    name: 'Garras Afiladas',
    description: 'Gana más dinero por cada clic',
    icon: '🔪',
    category: 'click_power' as const,
    baseCost: 25,
    costMultiplier: 1.3,
    effectPerLevel: 1,
    maxLevel: null,
  },
];

/**
 * Todas las mejoras disponibles
 */
export const ALL_UPGRADES = [
  ...MONEY_PASSIVE_UPGRADES,
  ...ENERGY_PASSIVE_UPGRADES,
  ...HEALTH_MAX_UPGRADES,
  ...CLICK_POWER_UPGRADES,
];

/**
 * Configuración de ataques instantáneos
 */
export const INSTANT_ATTACKS = [
  {
    id: 'quick_scratch',
    name: 'Arañazo Rápido',
    description: 'Un zarpazo veloz que inflige daño moderado',
    icon: '🐾',
    type: 'instant' as const,
    damage: 10,
    foodCost: 5,
  },
  {
    id: 'feline_bite',
    name: 'Mordisco Felino',
    description: 'Una mordida precisa en el punto débil',
    icon: '😾',
    type: 'instant' as const,
    damage: 25,
    foodCost: 15,
  },
  {
    id: 'wild_swipe',
    name: 'Zarpazo Salvaje',
    description: 'Un ataque furioso con ambas patas',
    icon: '💥',
    type: 'instant' as const,
    damage: 50,
    foodCost: 35,
  },
  {
    id: 'acrobatic_leap',
    name: 'Salto Acrobático',
    description: 'Salto desde las alturas con ataque descendente',
    icon: '🦘',
    type: 'instant' as const,
    damage: 100,
    foodCost: 75,
  },
  {
    id: 'cat_fury',
    name: 'Furia Gatuna',
    description: 'Desata toda la ira felina contenida',
    icon: '😡',
    type: 'instant' as const,
    damage: 200,
    foodCost: 150,
  },
  {
    id: 'mega_pounce',
    name: 'Mega Abalanzamiento',
    description: 'Un salto devastador que aplasta al enemigo',
    icon: '💫',
    type: 'instant' as const,
    damage: 500,
    foodCost: 400,
  },
];

/**
 * Configuración de ataques pasivos (daño por segundo)
 */
export const PASSIVE_ATTACKS = [
  {
    id: 'intimidating_stare',
    name: 'Mirada Intimidante',
    description: 'Tu mirada hace daño constante al enemigo',
    icon: '👁️',
    type: 'passive' as const,
    damage: 1,
    foodCost: 20,
  },
  {
    id: 'deafening_purr',
    name: 'Ronroneo Ensordecedor',
    description: 'Un ronroneo tan fuerte que causa daño',
    icon: '😺',
    type: 'passive' as const,
    damage: 3,
    foodCost: 60,
  },
  {
    id: 'poison_hairball',
    name: 'Bola de Pelo Venenosa',
    description: 'Bolas de pelo tóxicas que dañan constantemente',
    icon: '🤢',
    type: 'passive' as const,
    damage: 8,
    foodCost: 180,
  },
  {
    id: 'cursed_meow',
    name: 'Maullido Maldito',
    description: 'Un maullido que drena la vida del enemigo',
    icon: '👻',
    type: 'passive' as const,
    damage: 20,
    foodCost: 500,
  },
];

/**
 * Todos los ataques disponibles
 */
export const ALL_ATTACKS = [
  ...INSTANT_ATTACKS,
  ...PASSIVE_ATTACKS,
];

/**
 * Items de un solo uso
 */
export const SINGLE_USE_ITEMS = [
  {
    id: 'tuna_can',
    name: 'Lata de Atún',
    description: 'Recupera 500 de energía instantáneamente',
    icon: '🥫',
    cost: { type: 'money' as const, amount: 150 },
    effect: { type: 'instant_energy', amount: 500 },
    stackable: false,
  },
  {
    id: 'catnip',
    name: 'Hierba Gatera',
    description: 'Duplica el dinero por clic durante 30 segundos',
    icon: '🌿',
    cost: { type: 'food' as const, amount: 30 },
    effect: { type: 'click_multiplier', multiplier: 2, duration: 30 },
    stackable: false,
  },
  {
    id: 'fish_feast',
    name: 'Festín de Pescado',
    description: 'Gana 1000 de dinero al instante',
    icon: '🐟',
    cost: { type: 'food' as const, amount: 50 },
    effect: { type: 'instant_money', amount: 1000 },
    stackable: false,
  },
  {
    id: 'healing_treat',
    name: 'Golosina Curativa',
    description: 'Recupera 500 de vida',
    icon: '🍖',
    cost: { type: 'money' as const, amount: 200 },
    effect: { type: 'instant_health', amount: 500 },
    stackable: false,
  },
];

/**
 * Items acumulables (permanentes)
 */
export const STACKABLE_ITEMS = [
  {
    id: 'gold_collar',
    name: 'Collar de Oro',
    description: '+5 dinero por segundo (acumulable)',
    icon: '👑',
    cost: { type: 'money' as const, amount: 500 },
    effect: { type: 'money_per_second', amount: 5 },
    stackable: true,
  },
  {
    id: 'energy_crystal',
    name: 'Cristal de Energía',
    description: '+2 energía por segundo (acumulable)',
    icon: '💎',
    cost: { type: 'money' as const, amount: 400 },
    effect: { type: 'energy_per_second', amount: 2 },
    stackable: true,
  },
  {
    id: 'cursed_bell',
    name: 'Campana Maldita',
    description: '+1 daño por segundo al enemigo (acumulable)',
    icon: '🔔',
    cost: { type: 'food' as const, amount: 100 },
    effect: { type: 'damage_per_second', amount: 1 },
    stackable: true,
  },
];

/**
 * Todos los items disponibles
 */
export const ALL_ITEMS = [
  ...SINGLE_USE_ITEMS,
  ...STACKABLE_ITEMS,
];
