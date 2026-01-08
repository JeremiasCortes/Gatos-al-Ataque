# CLAUDE.md - Juego Multijugador de Gatos en Tiempo Real

## Descripción del Proyecto

Aplicación web multijugador en tiempo real donde dos jugadores compiten en un juego estilo clicker con temática de gatos. Los jugadores deben gestionar recursos (dinero, energía, pienso) para mejorar sus estadísticas y atacar a su oponente hasta reducir su vida a cero.

## Características Principales

### 1. Sistema de Conexión y Matchmaking
- **Sala de espera**: Menú inicial donde los jugadores se conectan
- **Sistema de emparejamiento**: Dos jugadores deben estar "listos" para iniciar
- **WebSockets**: Comunicación en tiempo real entre jugadores
- **Identificación única**: Cada jugador tiene un ID de sesión único

### 2. Recursos del Juego

#### Dinero (Currency)
- Se genera haciendo clic en el botón principal
- Se genera pasivamente por segundo (upgradeable)
- Usado para comprar mejoras y aumentar vida

#### Energía (Energy)
- Se regenera automáticamente por segundo
- Se puede mejorar la tasa de regeneración
- Usado para comprar pienso

#### Pienso (Food/Kibble)
- Se compra con energía
- Usado para lanzar ataques al enemigo
- Diferentes tipos de ataques tienen diferentes costos

#### Vida (Health)
- Cada jugador empieza con X puntos de vida
- Se puede mejorar/aumentar el máximo con dinero
- Llegar a 0 significa derrota
- Se visualiza con barra de progreso clara

### 3. Sistema de Mejoras (Upgrades)

#### Mejoras Pasivas de Dinero
- **Nivel 1**: "Rasca Básico" - +1 dinero/segundo
- **Nivel 2**: "Plato de Leche" - +5 dinero/segundo
- **Nivel 3**: "Caja de Cartón Premium" - +15 dinero/segundo
- **Nivel 4**: "Ratón de Juguete" - +50 dinero/segundo
- **Nivel 5**: "Torre para Gatos" - +150 dinero/segundo

#### Mejoras de Energía
- **Nivel 1**: "Siesta Corta" - +1 energía/segundo
- **Nivel 2**: "Siesta Media" - +3 energía/segundo
- **Nivel 3**: "Siesta Profunda" - +8 energía/segundo
- **Nivel 4**: "Sueño Gatuno" - +20 energía/segundo

#### Mejoras de Vida
- **Nivel 1**: "+50 Vida Máxima" - Costo: 100 dinero
- **Nivel 2**: "+100 Vida Máxima" - Costo: 300 dinero
- **Nivel 3**: "+200 Vida Máxima" - Costo: 800 dinero

#### Mejora de Click
- **Nivel 1-10**: Cada nivel aumenta el dinero por clic (+1, +2, +3...)

### 4. Sistema de Ataques (Temática Gatos)

#### Ataques Instantáneos (Un Solo Uso)
- **"Arañazo Rápido"**: 10 daño - Costo: 5 pienso
- **"Mordisco Felino"**: 25 daño - Costo: 15 pienso
- **"Zarpazo Salvaje"**: 50 daño - Costo: 35 pienso
- **"Salto Acrobático"**: 100 daño - Costo: 75 pienso
- **"Furia Gatuna"**: 200 daño - Costo: 150 pienso

#### Ataques Pasivos (Daño por Segundo)
- **"Mirada Intimidante"**: 1 daño/segundo - Costo: 20 pienso
- **"Ronroneo Ensordecedor"**: 3 daño/segundo - Costo: 60 pienso
- **"Bola de Pelo Venenosa"**: 8 daño/segundo - Costo: 180 pienso

### 5. Sistema de Items Especiales

#### Items de Un Solo Uso
```typescript
{
  id: string,
  name: string,
  description: string,
  cost: { type: 'money' | 'food', amount: number },
  effect: {
    type: 'instant_money' | 'instant_energy' | 'instant_health' | 'instant_damage',
    amount: number
  }
}
```

Ejemplos:
- **"Lata de Atún"**: +500 energía instantánea - Costo: 150 dinero
- **"Hierba Gatera"**: +2x dinero por clic durante 30 segundos - Costo: 30 pienso

#### Items Acumulables (Pasivos Permanentes)
```typescript
{
  id: string,
  name: string,
  description: string,
  cost: { type: 'money' | 'food', amount: number },
  effect: {
    type: 'money_per_second' | 'energy_per_second' | 'damage_per_second',
    amount: number
  },
  stackable: true,
  owned: number
}
```

### 6. Interfaz de Usuario (Dashboard)

#### Vista Principal del Jugador
```
┌─────────────────────────────────────────────────────┐
│  MI GATO                    VS.         ENEMIGO     │
│  ████████░░ 85%                         ██░░░░░░ 25%│
│  Vida: 850/1000                         Vida: 250/1000│
├─────────────────────────────────────────────────────┤
│                                                     │
│  💰 Dinero: 1,547  (+35/s)                         │
│  ⚡ Energía: 234  (+12/s)                           │
│  🍖 Pienso: 89                                      │
│                                                     │
│  [  🐾 CLIC AQUÍ PARA GANAR DINERO  ]              │
│                                                     │
├─────────────────────────────────────────────────────┤
│  TIENDA                                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ MEJORAS  │ │ ATAQUES  │ │  ITEMS   │           │
│  └──────────┘ └──────────┘ └──────────┘           │
└─────────────────────────────────────────────────────┘
```

#### Elementos Visuales Requeridos
- **Barras de vida**: Progreso visual claro con porcentaje
- **Contadores en tiempo real**: Dinero, energía, pienso
- **Indicadores de ganancia pasiva**: "+X/s" visible
- **Botón de clic principal**: Grande, responsive, con feedback visual
- **Tienda organizada por pestañas**: Mejoras, Ataques, Items
- **Inventario de items**: Mostrar cantidad acumulada de cada item
- **Notificaciones de ataques**: Animación cuando recibes daño
- **Log de combate**: Feed de acciones recientes (opcional)

### 7. Menú de Inicio

```
┌─────────────────────────────────────┐
│   🐱 BATALLA DE GATOS 🐱           │
│                                     │
│   Jugador 1: [Esperando...]        │
│   [ ] Listo                         │
│                                     │
│   Jugador 2: [Esperando...]        │
│   [ ] Listo                         │
│                                     │
│   [INICIAR PARTIDA]                 │
│   (ambos deben estar listos)        │
└─────────────────────────────────────┘
```

### 8. Arquitectura Técnica

#### Frontend
- **Opción 1**: React con componentes funcionales
- **Opción 2**: Vanilla JS con arquitectura modular
- **Requisito**: Código limpio, comentado en español
- **Naming**: Variables y funciones en inglés

#### Backend (WebSocket Server)
- Node.js con `ws` o `socket.io`
- Gestión de salas y emparejamiento
- Sincronización de estado del juego
- Validación de acciones del lado del servidor

#### Estructura de Datos en Tiempo Real
```typescript
interface GameState {
  players: {
    [playerId: string]: {
      health: number,
      maxHealth: number,
      money: number,
      energy: number,
      food: number,
      moneyPerSecond: number,
      energyPerSecond: number,
      damagePerSecond: number,
      clickPower: number,
      upgrades: Upgrade[],
      items: Item[]
    }
  },
  gameStarted: boolean,
  winner: string | null
}
```

#### Eventos WebSocket
- `player:join` - Jugador se une a la sala
- `player:ready` - Jugador marca como listo
- `game:start` - Ambos listos, comienza el juego
- `game:tick` - Actualización de recursos pasivos (cada segundo)
- `player:click` - Jugador hace clic para ganar dinero
- `player:buy_upgrade` - Compra mejora
- `player:buy_attack` - Compra ataque
- `player:attack` - Ejecuta ataque al enemigo
- `player:health_update` - Actualización de vida
- `game:end` - Un jugador llega a 0 vida

### 9. Requisitos de Implementación

#### Código Limpio
- Funciones pequeñas y específicas
- Nombres descriptivos
- Separación de responsabilidades
- Comentarios en español explicando lógica compleja

#### Documentación
- README con instrucciones de instalación
- Comentarios JSDoc en funciones principales
- Explicación de flujo de datos WebSocket

#### Extensibilidad
- Sistema de configuración para añadir nuevas mejoras fácilmente
- Templates para nuevos ataques e items
- Constantes centralizadas para balanceo

Estructura del Proyecto
cat-battle-game/
├── client/                      # Frontend React + TypeScript
│   ├── src/
│   │   ├── components/
│   │   │   ├── GameLobby.tsx           # Menú de inicio y sala de espera
│   │   │   ├── GameBoard.tsx           # Dashboard principal del juego
│   │   │   ├── PlayerStats.tsx         # Estadísticas del jugador (vida, recursos)
│   │   │   ├── EnemyStats.tsx          # Estadísticas del enemigo
│   │   │   ├── ClickButton.tsx         # Botón principal para ganar dinero
│   │   │   ├── Shop/
│   │   │   │   ├── ShopTabs.tsx        # Pestañas de la tienda
│   │   │   │   ├── UpgradesTab.tsx     # Tab de mejoras
│   │   │   │   ├── AttacksTab.tsx      # Tab de ataques
│   │   │   │   └── ItemsTab.tsx        # Tab de items
│   │   │   ├── Inventory.tsx           # Inventario de items acumulados
│   │   │   ├── CombatLog.tsx           # Log de acciones (opcional)
│   │   │   ├── EnergyModal.tsx         # Modal cuando energía llega a 1000
│   │   │   └── GameOverModal.tsx       # Modal de victoria/derrota
│   │   ├── hooks/
│   │   │   ├── useWebSocket.ts         # Hook para gestión de WebSocket
│   │   │   ├── useGameState.ts         # Hook para estado del juego
│   │   │   └── useGameTick.ts          # Hook para recursos pasivos
│   │   ├── types/
│   │   │   ├── game.types.ts           # Tipos del juego
│   │   │   ├── player.types.ts         # Tipos de jugador
│   │   │   ├── shop.types.ts           # Tipos de tienda
│   │   │   └── websocket.types.ts      # Tipos de eventos WebSocket
│   │   ├── config/
│   │   │   ├── gameConfig.ts           # Configuración del juego
│   │   │   ├── upgrades.config.ts      # Configuración de mejoras
│   │   │   ├── attacks.config.ts       # Configuración de ataques
│   │   │   └── items.config.ts         # Configuración de items
│   │   ├── utils/
│   │   │   ├── calculations.ts         # Funciones de cálculo
│   │   │   └── formatters.ts           # Funciones de formato
│   │   ├── App.tsx                     # Componente raíz
│   │   └── main.tsx                    # Punto de entrada
│   ├── package.json
│   └── tailwind.config.js
│
└── server/                      # Backend Node.js
    ├── src/
    │   ├── server.ts                   # Servidor principal
    │   ├── game/
    │   │   ├── GameRoom.ts             # Gestión de salas de juego
    │   │   ├── GameState.ts            # Estado del juego
    │   │   └── GameLogic.ts            # Lógica de juego
    │   ├── websocket/
    │   │   ├── WebSocketServer.ts      # Servidor WebSocket
    │   │   └── eventHandlers.ts        # Manejadores de eventos
    │   ├── types/
    │   │   └── game.types.ts           # Tipos compartidos
    │   └── config/
    │       └── constants.ts            # Constantes del juego
    ├── package.json
    └── tsconfig.json

Configuración Inicial del Juego
typescript// client/src/config/gameConfig.ts

/**
 * Configuración inicial del juego
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
  ENERGY_TO_FOOD_RATIO: 10, // 10 energía = 1 pienso
  FOOD_COST_PER_ENERGY: 100, // Cuesta 100 energía comprar 10 pienso
  
  // Sistema de energía especial
  ENERGY_THRESHOLD: 1000, // Umbral para activar modal de elección
  
  // Tick rate del juego (ms)
  GAME_TICK_RATE: 1000, // Actualización cada segundo
  
  // Límites
  MAX_ENERGY: 1000, // Energía máxima antes del modal
} as const;

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

Tipos de Datos (TypeScript)
typescript// client/src/types/game.types.ts

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
  damagePerSecond: number; // Daño pasivo que inflige al enemigo
  
  // Poder de clic
  clickPower: number;
  
  // Modificadores permanentes (de las elecciones de energía)
  modifiers: PlayerModifiers;
  
  // Progreso de mejoras
  upgrades: {
    [upgradeId: string]: number; // ID -> nivel/cantidad
  };
  
  // Items acumulados
  items: {
    [itemId: string]: number; // ID -> cantidad
  };
}

/**
 * Modificadores permanentes del jugador
 */
export interface PlayerModifiers {
  earningsMultiplier: number;      // Multiplicador de todas las ganancias
  passiveEarningsMultiplier: number; // Multiplicador solo de pasivas
  damageMultiplier: number;          // Multiplicador de daño recibido
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
  
  // Función para calcular el costo según el nivel
  baseCost: number;
  costMultiplier: number; // Cada nivel multiplica el costo
  
  // Efecto por nivel
  effectPerLevel: number;
  
  // Máximo nivel (opcional, null = infinito)
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
  type: 'instant' | 'passive'; // Instantáneo o daño por segundo
  
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
  
  // Si es stackable, se puede comprar múltiples veces
  stackable: boolean;
  maxStack?: number; // null = infinito
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
  | { type: 'click_multiplier'; multiplier: number; duration: number }; // Temporal

Configuración de Mejoras
typescript// client/src/config/upgrades.config.ts

import { Upgrade } from '../types/shop.types';

/**
 * Configuración de todas las mejoras disponibles
 * Organizadas por categoría para fácil mantenimiento
 */

// ==================== MEJORAS DE DINERO PASIVO ====================
export const MONEY_PASSIVE_UPGRADES: Upgrade[] = [
  {
    id: 'scratching_post_basic',
    name: 'Rasca Básico',
    description: 'Un simple poste para rascar que genera monedas',
    icon: '🪵',
    category: 'money_passive',
    baseCost: 10,
    costMultiplier: 1.15,
    effectPerLevel: 1, // +1 dinero/segundo por nivel
    maxLevel: null,
  },
  {
    id: 'milk_bowl',
    name: 'Plato de Leche',
    description: 'Un delicioso plato de leche fresca',
    icon: '🥛',
    category: 'money_passive',
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
    category: 'money_passive',
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
    category: 'money_passive',
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
    category: 'money_passive',
    baseCost: 10000,
    costMultiplier: 1.15,
    effectPerLevel: 150,
    maxLevel: null,
  },
];

// ==================== MEJORAS DE ENERGÍA PASIVA ====================
export const ENERGY_PASSIVE_UPGRADES: Upgrade[] = [
  {
    id: 'short_nap',
    name: 'Siesta Corta',
    description: 'Un descanso rápido para recuperar energía',
    icon: '😴',
    category: 'energy_passive',
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
    category: 'energy_passive',
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
    category: 'energy_passive',
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
    category: 'energy_passive',
    baseCost: 8000,
    costMultiplier: 1.2,
    effectPerLevel: 20,
    maxLevel: null,
  },
];

// ==================== MEJORAS DE VIDA MÁXIMA ====================
export const HEALTH_MAX_UPGRADES: Upgrade[] = [
  {
    id: 'health_boost_1',
    name: 'Vida Extra I',
    description: 'Aumenta tu vida máxima en 50',
    icon: '❤️',
    category: 'health_max',
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
    category: 'health_max',
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
    category: 'health_max',
    baseCost: 800,
    costMultiplier: 1.5,
    effectPerLevel: 200,
    maxLevel: null,
  },
];

// ==================== MEJORAS DE PODER DE CLIC ====================
export const CLICK_POWER_UPGRADES: Upgrade[] = [
  {
    id: 'sharper_claws',
    name: 'Garras Afiladas',
    description: 'Gana más dinero por cada clic',
    icon: '🔪',
    category: 'click_power',
    baseCost: 25,
    costMultiplier: 1.3,
    effectPerLevel: 1,
    maxLevel: null,
  },
];

// ==================== EXPORTACIÓN DE TODAS LAS MEJORAS ====================
export const ALL_UPGRADES: Upgrade[] = [
  ...MONEY_PASSIVE_UPGRADES,
  ...ENERGY_PASSIVE_UPGRADES,
  ...HEALTH_MAX_UPGRADES,
  ...CLICK_POWER_UPGRADES,
];

Configuración de Ataques
typescript// client/src/config/attacks.config.ts

import { Attack } from '../types/shop.types';

/**
 * Configuración de todos los ataques disponibles
 * Temática: Movimientos y comportamientos de gatos
 */

// ==================== ATAQUES INSTANTÁNEOS ====================
export const INSTANT_ATTACKS: Attack[] = [
  {
    id: 'quick_scratch',
    name: 'Arañazo Rápido',
    description: 'Un zarpazo veloz que inflige daño moderado',
    icon: '🐾',
    type: 'instant',
    damage: 10,
    foodCost: 5,
  },
  {
    id: 'feline_bite',
    name: 'Mordisco Felino',
    description: 'Una mordida precisa en el punto débil',
    icon: '😾',
    type: 'instant',
    damage: 25,
    foodCost: 15,
  },
  {
    id: 'wild_swipe',
    name: 'Zarpazo Salvaje',
    description: 'Un ataque furioso con ambas patas',
    icon: '💥',
    type: 'instant',
    damage: 50,
    foodCost: 35,
  },
  {
    id: 'acrobatic_leap',
    name: 'Salto Acrobático',
    description: 'Salto desde las alturas con ataque descendente',
    icon: '🦘',
    type: 'instant',
    damage: 100,
    foodCost: 75,
  },
  {
    id: 'cat_fury',
    name: 'Furia Gatuna',
    description: 'Desata toda la ira felina contenida',
    icon: '😡',
    type: 'instant',
    damage: 200,
    foodCost: 150,
  },
  {
    id: 'mega_pounce',
    name: 'Mega Abalanzamiento',
    description: 'Un salto devastador que aplasta al enemigo',
    icon: '💫',
    type: 'instant',
    damage: 500,
    foodCost: 400,
  },
];

// ==================== ATAQUES PASIVOS (Daño por segundo) ====================
export const PASSIVE_ATTACKS: Attack[] = [
  {
    id: 'intimidating_stare',
    name: 'Mirada Intimidante',
    description: 'Tu mirada hace daño constante al enemigo',
    icon: '👁️',
    type: 'passive',
    damage: 1, // Daño por segundo
    foodCost: 20,
  },
  {
    id: 'deafening_purr',
    name: 'Ronroneo Ensordecedor',
    description: 'Un ronroneo tan fuerte que causa daño',
    icon: '😺',
    type: 'passive',
    damage: 3,
    foodCost: 60,
  },
  {
    id: 'poison_hairball',
    name: 'Bola de Pelo Venenosa',
    description: 'Bolas de pelo tóxicas que dañan constantemente',
    icon: '🤢',
    type: 'passive',
    damage: 8,
    foodCost: 180,
  },
  {
    id: 'cursed_meow',
    name: 'Maullido Maldito',
    description: 'Un maullido que drena la vida del enemigo',
    icon: '👻',
    type: 'passive',
    damage: 20,
    foodCost: 500,
  },
];

// ==================== EXPORTACIÓN DE TODOS LOS ATAQUES ====================
export const ALL_ATTACKS: Attack[] = [
  ...INSTANT_ATTACKS,
  ...PASSIVE_ATTACKS,
];

Configuración de Items
typescript// client/src/config/items.config.ts

import { Item } from '../types/shop.types';

/**
 * Configuración de todos los items especiales
 * Items de un solo uso y acumulables
 */

// ==================== ITEMS DE UN SOLO USO ====================
export const SINGLE_USE_ITEMS: Item[] = [
  {
    id: 'tuna_can',
    name: 'Lata de Atún',
    description: 'Recupera 500 de energía instantáneamente',
    icon: '🥫',
    cost: { type: 'money', amount: 150 },
    effect: { type: 'instant_energy', amount: 500 },
    stackable: false,
  },
  {
    id: 'catnip',
    name: 'Hierba Gatera',
    description: 'Duplica el dinero por clic durante 30 segundos',
    icon: '🌿',
    cost: { type: 'food', amount: 30 },
    effect: { type: 'click_multiplier', multiplier: 2, duration: 30 },
    stackable: false,
  },
  {
    id: 'fish_feast',
    name: 'Festín de Pescado',
    description: 'Gana 1000 de dinero al instante',
    icon: '🐟',
    cost: { type: 'food', amount: 50 },
    effect: { type: 'instant_money', amount: 1000 },
    stackable: false,
  },
  {
    id: 'healing_treat',
    name: 'Golosina Curativa',
    description: 'Recupera 500 de vida',
    icon: '🍖',
    cost: { type: 'money', amount: 200 },
    effect: { type: 'instant_health', amount: 500 },
    stackable: false,
  },
];

// ==================== ITEMS ACUMULABLES (Permanentes) ====================
export const STACKABLE_ITEMS: Item[] = [
  {
    id: 'gold_collar',
    name: 'Collar de Oro',
    description: '+5 dinero por segundo (acumulable)',
    icon: '👑',
    cost: { type: 'money', amount: 500 },
    effect: { type: 'money_per_second', amount: 5 },
    stackable: true,
  },
  {
    id: 'energy_crystal',
    name: 'Cristal de Energía',
    description: '+2 energía por segundo (acumulable)',
    icon: '💎',
    cost: { type: 'money', amount: 400 },
    effect: { type: 'energy_per_second', amount: 2 },
    stackable: true,
  },
  {
    id: 'cursed_bell',
    name: 'Campana Maldita',
    description: '+1 daño por segundo al enemigo (acumulable)',
    icon: '🔔',
    cost: { type: 'food', amount: 100 },
    effect: { type: 'damage_per_second', amount: 1 },
    stackable: true,
  },
];

// ==================== EXPORTACIÓN DE TODOS LOS ITEMS ====================
export const ALL_ITEMS: Item[] = [
  ...SINGLE_USE_ITEMS,
  ...STACKABLE_ITEMS,
];

Eventos WebSocket
typescript// shared/types/websocket.types.ts

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
  [ServerEvents.ROOM_STATE]: { gameState: GameState };
  [ServerEvents.GAME_START]: {};
  [ServerEvents.GAME_TICK]: { timestamp: number };
  [ServerEvents.PLAYER_UPDATE]: { playerId: string; updates: Partial<PlayerState> };
  [ServerEvents.ENEMY_UPDATE]: { playerId: string; updates: Partial<PlayerState> };
  [ServerEvents.ATTACK_RECEIVED]: { attackName: string; damage: number };
  [ServerEvents.GAME_END]: { winnerId: string; winnerName: string };
  [ServerEvents.ERROR]: { message: string };
}

Componentes React Principales
1. GameLobby (Menú de Inicio)
typescript// client/src/components/GameLobby.tsx

/**
 * Componente: Sala de espera donde los jugadores se conectan y marcan como listos
 * 
 * Funcionalidad:
 * - Muestra el estado de ambos jugadores (esperando/listo)
 * - Permite al jugador marcar como "listo"
 * - Inicia el juego cuando ambos están listos
 * - Muestra el ID de la sala para que el segundo jugador se una
 */

import React, { useState } from 'react';

interface GameLobbyProps {
  onReady: () => void;
  players: { id: string; name: string; ready: boolean }[];
  canStart: boolean;
}

export const GameLobby: React.FC<GameLobbyProps> = ({ onReady, players, canStart }) => {
  // Implementación del componente
  // - Input para nombre del jugador
  // - Botón "Listo" para cada jugador
  // - Indicadores visuales de estado
  // - Botón "Iniciar Partida" (solo visible cuando ambos listos)
};
2. GameBoard (Dashboard Principal)
typescript// client/src/components/GameBoard.tsx

/**
 * Componente: Dashboard principal del juego donde ocurre toda la acción
 * 
 * Estructura:
 * - Header: Estadísticas de ambos jugadores (vida, recursos)
 * - Centro: Botón de clic principal
 * - Sidebar: Tienda con tabs (Mejoras, Ataques, Items)
 * - Footer: Inventario de items acumulados
 */

export const GameBoard: React.FC = () => {
  // Renderiza:
  // - PlayerStats (jugador actual)
  // - EnemyStats (enemigo)
  // - ClickButton
  // - Shop con tabs
  // - Inventory
  // - CombatLog (opcional)
  // - Modales (EnergyModal, GameOverModal)
};
3. PlayerStats
typescript// client/src/components/PlayerStats.tsx

/**
 * Componente: Muestra las estadísticas del jugador actual
 * 
 * Información mostrada:
 * - Barra de vida con porcentaje
 * - Dinero actual + ganancia por segundo
 * - Energía actual + ganancia por segundo
 * - Pienso actual
 * - Modificadores activos (si los hay)
 */

interface PlayerStatsProps {
  player: PlayerState;
}

export const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {
  // Diseño: Card con información clara y visual
  // - Barra de progreso para vida
  // - Iconos para cada recurso
  // - Indicadores "+X/s" en verde
};
4. EnergyModal
typescript// client/src/components/EnergyModal.tsx

/**
 * Componente: Modal que aparece cuando la energía llega a 1000
 * 
 * Funcionalidad:
 * - Muestra las 4 opciones disponibles
 * - Cada opción tiene icono, nombre, descripción y efecto
 * - Al seleccionar una opción:
 *   - Se consume la energía (vuelve a 0)
 *   - Se aplica el efecto elegido
 *   - Se cierra el modal
 *   - Se notifica al servidor
 */

interface EnergyModalProps {
  isOpen: boolean;
  onChoice: (choiceId: string) => void;
}

export const EnergyModal: React.FC<EnergyModalProps> = ({ isOpen, onChoice }) => {
  // Diseño: Modal centrado con overlay
  // - 4 botones grandes con las opciones
  // - Cada botón muestra efecto claramente
  // - Colores diferenciados (ataque=rojo, curación=verde, etc.)
};
---

## Lógica del Backend

### GameRoom Class

```typescript
// server/src/game/GameRoom.ts

/**
 * Clase que gestiona una sala de juego con dos jugadores
 * 
 * Responsabilidades:
 * - Mantener el estado del juego
 * - Validar acciones de jugadores
 * - Aplicar efectos de mejoras, ataques e items
 * - Actualizar recursos pasivos cada segundo (game tick)
 * - Detectar condición de victoria
 * - Sincronizar estado con ambos clientes
 */

export class GameRoom {
  private gameState: GameState;
  private tickInterval: NodeJS.Timer | null = null;

  constructor(roomId: string) {
    this.gameState = this.initializeGameState(roomId);
  }

  /**
   * Inicializa el estado del juego con valores por defecto
   */
  private initializeGameState(roomId: string): GameState {
    return {
      roomId,
      gameStarted: false,
      gameEnded: false,
      winner: null,
      players: {},
    };
  }

  /**
   * Añade un jugador a la sala
   */
  public addPlayer(playerId: string, playerName: string): void {
    this.gameState.players[playerId] = {
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
   * Marca un jugador como listo
   */
  public setPlayerReady(playerId: string): void {
    if (this.gameState.players[playerId]) {
      this.gameState.players[playerId].ready = true;
    }
    
    // Si ambos jugadores están listos, iniciar el juego
    if (this.areAllPlayersReady()) {
      this.startGame();
    }
  }

  /**
   * Inicia el juego y el game tick
   */
  private startGame(): void {
    this.gameState.gameStarted = true;
    
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
      
      // Generar dinero pasivo (con modificadores)
      const moneyGain = player.moneyPerSecond * 
                        player.modifiers.earningsMultiplier * 
                        player.modifiers.passiveEarningsMultiplier;
      player.money += moneyGain;
      
      // Generar energía pasiva (con modificadores)
      const energyGain = player.energyPerSecond * 
                         player.modifiers.earningsMultiplier;
      player.energy = Math.min(player.energy + energyGain, GAME_CONFIG.MAX_ENERGY);
      
      // Aplicar daño pasivo al enemigo (con modificadores del enemigo)
      if (player.damagePerSecond > 0 && enemy) {
        const damageDealt = player.damagePerSecond * enemy.modifiers.damageMultiplier;
        enemy.health = Math.max(0, enemy.health - damageDealt);
      }
    }
    
    // Verificar condición de victoria
    this.checkWinCondition();
  }

  /**
   * Procesa un clic del jugador
   */
  public handleClick(playerId: string): void {
    const player = this.gameState.players[playerId];
    if (!player) return;
    
    const moneyGain = player.clickPower * player.modifiers.earningsMultiplier;
    player.money += moneyGain;
  }

  /**
   * Procesa la compra de una mejora
   */
  public handleBuyUpgrade(playerId: string, upgradeId: string): boolean {
    const player = this.gameState.players[playerId];
    const upgrade = ALL_UPGRADES.find(u => u.id === upgradeId);
    
    if (!player || !upgrade) return false;
    
    // Calcular nivel actual de la mejora
    const currentLevel = player.upgrades[upgradeId] || 0;
    
    // Verificar nivel máximo
    if (upgrade.maxLevel && currentLevel >= upgrade.maxLevel) return false;
    
    // Calcular costo de esta mejora
    const cost = Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
    
    // Verificar si tiene suficiente dinero
    if (player.money < cost) return false;
    
    // Aplicar compra
    player.money -= cost;
    player.upgrades[upgradeId] = currentLevel + 1;
    
    // Aplicar efecto de la mejora
    this.applyUpgradeEffect(player, upgrade);
    
    return true;
  }

  /**
   * Aplica el efecto de una mejora al jugador
   */
  private applyUpgradeEffect(player: PlayerState, upgrade: Upgrade): void {
    switch (upgrade.category) {
      case 'money_passive':
        player.moneyPerSecond += upgrade.effectPerLevel;
        break;
      case 'energy_passive':
        player.energyPerSecond += upgrade.effectPerLevel;
        break;
      case 'health_max':
        player.maxHealth += upgrade.effectPerLevel;
        player.health += upgrade.effectPerLevel; // También curamos la diferencia
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
    
    if (!player || !enemy || !attack) return false;
    
    // Verificar si tiene suficiente pienso
    if (player.food < attack.foodCost) return false;
    
    // Aplicar compra
    player.food -= attack.foodCost;
    
    // Aplicar efecto del ataque
    if (attack.type === 'instant') {
      // Daño instantáneo con modificador del enemigo
      const damageDealt = attack.damage * enemy.modifiers.damageMultiplier;
      enemy.health = Math.max(0, enemy.health - damageDealt);
    } else {
      // Daño pasivo
      player.damagePerSecond += attack.damage;
    }
    
    return true;
  }

  /**
   * Procesa la compra de pienso
   */
  public handleBuyFood(playerId: string, amount: number): boolean {
    const player = this.gameState.players[playerId];
    if (!player) return false;
    
    const energyCost = amount * GAME_CONFIG.ENERGY_TO_FOOD_RATIO;
    
    // Verificar si tiene suficiente energía
    if (player.energy < energyCost) return false;
    
    // Aplicar compra
    player.energy -= energyCost;
    player.food += amount;
    
    return true;
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
    
    switch (choice.effect.type) {
      case 'instant_damage':
        if (enemy) {
          const damageDealt = choice.effect.value * enemy.modifiers.damageMultiplier;
          enemy.health = Math.max(0, enemy.health - damageDealt);
        }
        break;
        
      case 'instant_heal':
        player.health = Math.min(player.maxHealth, player.health + choice.effect.value);
        break;
        
      case 'permanent_modifier':
        if (choice.effect.earningsMultiplier) {
          player.modifiers.earningsMultiplier *= choice.effect.earningsMultiplier;
        }
        if (choice.effect.passiveEarningsMultiplier) {
          player.modifiers.passiveEarningsMultiplier *= choice.effect.passiveEarningsMultiplier;
        }
        if (choice.effect.damageMultiplier) {
          player.modifiers.damageMultiplier *= choice.effect.damageMultiplier;
        }
        break;
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
    
    // Detener el game tick
    if (this.tickInterval) {
      clearInterval(this.tickInterval);
      this.tickInterval = null;
    }
  }

  /**
   * Obtiene el jugador enemigo
   */
  private getEnemyPlayer(playerId: string): PlayerState | null {
    const enemyId = Object.keys(this.gameState.players).find(id => id !== playerId);
    return enemyId ? this.gameState.players[enemyId] : null;
  }

  // Getters
  public getGameState(): GameState {
    return this.gameState;
  }

  public isGameStarted(): boolean {
    return this.gameState.gameStarted;
  }

  public isGameEnded(): boolean {
    return this.gameState.gameEnded;
  }
}
```

---

## Diseño Visual (Tailwind CSS)

### Paleta de Colores Sugerida

```typescript
// Tema de gatos con colores cálidos y acogedores

const theme = {
  primary: '#FF6B6B',      // Rojo coral para botones principales
  secondary: '#4ECDC4',    // Turquesa para recursos
  success: '#95E1D3',      // Verde menta para ganancias
  warning: '#FFE66D',      // Amarillo para alertas
  danger: '#F38181',       // Rosa salmón para daño
  dark: '#2D3436',         // Gris oscuro para texto
  light: '#F7F7F7',        // Blanco roto para fondos
  energy: '#A8E6CF',       // Verde claro para energía
  money: '#FFD93D',        // Dorado para dinero
  food: '#FF8C42',         // Naranja para pienso
  health: '#FF6B9D',       // Rosa para vida
};
```

### Layout Principal

```tsx
<div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 p-4">
  {/* Header: Stats de ambos jugadores */}
  <div className="grid grid-cols-2 gap-4 mb-6">
    <PlayerStatsCard /> {/* Mi gato */}
    <EnemyStatsCard />  {/* Enemigo */}
  </div>

  {/* Centro: Botón de clic + recursos actuales */}
  <div className="max-w-2xl mx-auto mb-6">
    <ResourceDisplay />
    <ClickButton />
  </div>

  {/* Tienda */}
  <div className="max-w-4xl mx-auto">
    <Shop />
  </div>
</div>
```

---

## Sistema de Persistencia (Preparado para Futuro)

```typescript
// server/src/database/schema.ts (PREPARADO, NO IMPLEMENTADO)

/**
 * Esquema de base de datos para persistencia futura
 * 
 * Tablas propuestas:
 * - users: Información de usuarios
 * - game_sessions: Historial de partidas
 * - player_progress: Progreso acumulado entre partidas
 * - leaderboard: Ranking de jugadores
 */

interface UserSchema {
  id: string;
  username: string;
  created_at: Date;
  
  // Estadísticas acumuladas
  total_games_played: number;
  total_wins: number;
  total_losses: number;
  total_damage_dealt: number;
  total_money_earned: number;
}

interface GameSessionSchema {
  id: string;
  player1_id: string;
  player2_id: string;
  winner_id: string;
  duration: number; // segundos
  ended_at: Date;
  
  // Snapshot final del juego
  final_state: GameState;
}

// Nota: La implementación de BD se dejará para una fase futura
// Por ahora, cada partida es independiente y se reinicia desde cero
```

---

## Instrucciones de Desarrollo

### Paso 1: Configurar el Proyecto

```bash
# Crear directorios
mkdir cat-battle-game
cd cat-battle-game
mkdir client server

# Frontend (React + TypeScript + Vite)
cd client
npm create vite@latest . -- --template react-ts
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install socket.io-client

# Backend (Node.js + TypeScript)
cd ../server
npm init -y
npm install express ws
npm install -D typescript @types/node @types/express @types/ws ts-node nodemon
npx tsc --init
```

### Paso 2: Implementar Backend Primero

```typescript
// Orden de implementación del servidor:

1. server/src/types/game.types.ts         // Tipos compartidos
2. server/src/config/constants.ts         // Constantes del juego
3. server/src/game/GameState.ts          // Clase de estado
4. server/src/game/GameRoom.ts           // Lógica de sala
5. server/src/websocket/WebSocketServer.ts // Servidor WS
6. server/src/server.ts                  // Servidor principal
```

### Paso 3: Implementar Frontend

```typescript
// Orden de implementación del cliente:

1. client/src/types/                     // Todos los tipos
2. client/src/config/                    // Todas las configuraciones
3. client/src/hooks/useWebSocket.ts      // Conexión WebSocket
4. client/src/hooks/useGameState.ts      // Estado del juego
5. client/src/components/GameLobby.tsx   // Menú de inicio
6. client/src/components/PlayerStats.tsx // Stats del jugador
7. client/src/components/ClickButton.tsx // Botón principal
8. client/src/components/Shop/           // Sistema de tienda
9. client/src/components/EnergyModal.tsx // Modal de elección
10. client/src/components/GameBoard.tsx  // Dashboard principal
11. client/src/App.tsx                   // Componente raíz
```

### Paso 4: Testing y Balanceo

```typescript
// Cosas a probar:

1. Conexión de dos jugadores
2. Sistema de "listo" y inicio de partida
3. Clic y generación de dinero
4. Compra de mejoras y efecto en stats
5. Compra de pienso
6. Ataques instantáneos y pasivos
7. Modal de energía a 1000
8. Sincronización en tiempo real
9. Condición de victoria
10. Balanceo de costos y daños
```

---
