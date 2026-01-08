# 🐱 Batalla de Gatos - Servidor

Servidor WebSocket para el juego multijugador de Batalla de Gatos.

## Instalación

```bash
cd server
npm install
```

## Desarrollo

```bash
npm run dev
```

El servidor se iniciará en el puerto `3001`.

## Producción

```bash
npm run build
npm start
```

## API

### Eventos del Cliente

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `player:join` | `{ playerName: string }` | Unirse a una sala |
| `player:ready` | `{}` | Marcar como listo |
| `player:click` | `{}` | Hacer clic para ganar dinero |
| `player:buy_food` | `{ amount: number }` | Comprar pienso |
| `player:buy_upgrade` | `{ upgradeId: string }` | Comprar mejora |
| `player:buy_attack` | `{ attackId: string }` | Comprar ataque |
| `player:buy_item` | `{ itemId: string }` | Comprar item |
| `player:use_item` | `{ itemId: string }` | Usar item |
| `player:energy_choice` | `{ choiceId: string }` | Elegir opción de energía |

### Eventos del Servidor

| Evento | Payload | Descripción |
|--------|---------|-------------|
| `connected` | `{ playerId: string, message: string }` | Conexión exitosa |
| `room:state` | `{ gameState: GameState }` | Estado de la sala |
| `game:start` | `{}` | Juego iniciado |
| `game:tick` | `{ timestamp: number }` | Tick del juego |
| `player:update` | `{ playerId: string, player: PlayerState }` | Actualización del jugador |
| `enemy:update` | `{ playerId: string, player: PlayerState }` | Actualización del enemigo |
| `attack:received` | `{ attackName: string, damage: number }` | Ataque recibido |
| `game:end` | `{ winnerId: string, winnerName: string }` | Juego terminado |
| `energy:threshold_reached` | `{}` | Energía alcanzó el máximo |
| `error` | `{ message: string }` | Error |
