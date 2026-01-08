# BATALLA DE GATOS

> Aplicacion web multijugador en tiempo real donde dos jugadores compiten en un juego estilo clicker con tematica de gatos.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-cyan)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)

---

## Tabla de Contenidos

- [Descripcion](#descripcion)
- [Caracteristicas](#caracteristicas)
- [Tecnologias](#tecnologias)
- [Arquitectura](#arquitectura)
- [Instalacion](#instalacion)
- [Configuracion de VS Code](#configuracion-de-vs-code)
- [Uso](#uso)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Mecanicas del Juego](#mecanicas-del-juego)
- [API WebSocket](#api-websocket)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Licencia](#licencia)
- [Creditos](#creditos)

---

## Descripcion

Batalla de Gatos es un juego competitivo en tiempo real donde dos jugadores se enfrentan gestionando recursos (dinero, energia, pienso) para mejorar sus estadisticas y atacar a su oponente hasta reducir su vida a cero.

El juego combina mecanicas de clicker games con estrategia en tiempo real, permitiendo a los jugadores:

- Generar recursos activamente mediante clicks
- Invertir en mejoras pasivas
- Lanzar ataques instantaneos o continuos
- Tomar decisiones estrategicas al alcanzar puntos de inflexion

---

## Caracteristicas

### Sistema de Conexion

- Sala de espera con sistema de emparejamiento
- Comunicacion en tiempo real mediante WebSockets
- Identificacion unica de sesion para cada jugador

### Recursos del Juego

| Recurso | Descripcion |
|---------|-------------|
| Dinero | Se genera haciendo clic y pasivamente por segundo |
| Energia | Se regenera automaticamente, se usa para comprar pienso |
| Pienso | Se compra con energia, se usa para lanzar ataques |
| Vida | Llegar a 0 significa derrota |

### Sistema de Mejoras

- Mejoras pasivas de dinero (5 niveles disponibles)
- Mejoras de regeneracion de energia (4 niveles)
- Aumentos de vida maxima
- Mejoras de poder de clic

### Sistema de Ataques

#### Ataques Instantaneos

| Ataque | Daño | Costo |
|--------|------|-------|
| Arañazo Rapido | 10 | 5 pienso |
| Mordisco Felino | 25 | 15 pienso |
| Zarpazo Salvaje | 50 | 35 pienso |
| Salto Acrobatico | 100 | 75 pienso |
| Furia Gatuna | 200 | 150 pienso |

#### Ataques Pasivos

| Ataque | Daño/s | Costo |
|--------|--------|-------|
| Mirada Intimidante | 1 | 20 pienso |
| Ronroneo Ensordecedor | 3 | 60 pienso |
| Bola de Pelo Venenosa | 8 | 180 pienso |

### Modal de Energia Especial

Al alcanzar 1000 puntos de energia, el jugador debe elegir entre:

- **Zarpazo Definitivo**: Inflige 100 de daño al enemigo
- **Lamerse las Heridas**: Recupera 200 de vida
- **Furia Felina**: +15% ganancias pero +10% daño recibido
- **Postura Defensiva**: -10% ganancias pasivas pero -5% daño recibido

---

## Tecnologias

### Frontend

```
React 18.x
TypeScript 5.x
Vite 5.x
Tailwind CSS 3.x
Socket.io-client
```

### Backend

```
Node.js 20.x
TypeScript 5.x
Express 4.x
Socket.io
ws
```

### Herramientas de Desarrollo

```
ESLint
Prettier
Nodemon
```

---

## Arquitectura

```
batalla-de-gatos/
|-- client/                 # Frontend React + TypeScript
|   |-- src/
|   |   |-- components/     # Componentes React
|   |   |-- hooks/          # Hooks personalizados
|   |   |-- types/          # Definiciones de tipos
|   |   |-- config/         # Configuraciones del juego
|   |   |-- utils/          # Funciones utilitarias
|   |   |-- App.tsx         # Componente raiz
|   |   `-- main.tsx        # Punto de entrada
|   |-- package.json
|   `-- tailwind.config.js
|
|-- server/                 # Backend Node.js
|   |-- src/
|   |   |-- game/           # Logica del juego
|   |   |-- websocket/      # Servidor WebSocket
|   |   |-- types/          # Tipos compartidos
|   |   |-- config/         # Constantes
|   |   `-- server.ts       # Servidor principal
|   |-- package.json
|   `-- tsconfig.json
|
`-- README.md
```

---

## Instalacion

### Requisitos Previos

- Node.js 20.x o superior
- npm 10.x o superior
- Git

### Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/batalla-de-gatos.git
cd batalla-de-gatos
```

### Instalar Dependencias del Servidor

```bash
cd server
npm install
```

### Instalar Dependencias del Cliente

```bash
cd ../client
npm install
```

---

## Configuracion de VS Code

Para depurar tanto el frontend como el backend simultaneamente, configura el siguiente archivo `launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Backend Server",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/server",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    },
    {
      "name": "Frontend Client",
      "type": "node",
      "request": "launch",
      "cwd": "${workspaceFolder}/client",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ],
  "compounds": [
    {
      "name": "Run Full Stack",
      "configurations": ["Backend Server", "Frontend Client"],
      "stopAll": true
    }
  ]
}
```

### Configuracion de Redireccion de Puertos

Si usas WSL o un contenedor Docker, asegurate de redirigir los siguientes puertos:

| Servicio | Puerto | Uso |
|----------|--------|-----|
| Frontend | 5173 | Vite dev server |
| Backend | 3001 | API + WebSocket |

**En WSL / Windows:**

```powershell
# En PowerShell (ejecutar como administrador)
netsh interface portproxy add v4tov4 listenport=5173 listenaddress=0.0.0.0 connectport=5173 connectaddress=127.0.0.1
netsh interface portproxy add v4tov4 listenport=3001 listenaddress=0.0.0.0 connectport=3001 connectaddress=127.0.0.1
```

---

## Uso

### Iniciar el Servidor Backend

```bash
cd server
npm run dev
```

El servidor se iniciara en `http://localhost:3001`

### Iniciar el Cliente Frontend

```bash
cd client
npm run dev
```

La aplicacion estara disponible en `http://localhost:5173`

### Modo Produccion

```bash
# Backend
cd server
npm run build
npm start

# Frontend
cd client
npm run build
npm run preview
```

---

## Estructura del Proyecto

### Componentes Principales

| Componente | Descripcion |
|------------|-------------|
| `GameLobby` | Sala de espera y emparejamiento |
| `GameBoard` | Dashboard principal del juego |
| `PlayerStats` | Estadisticas del jugador actual |
| `EnemyStats` | Estadisticas del enemigo |
| `ClickButton` | Boton principal para generar recursos |
| `Shop` | Sistema de tienda con pestañas |
| `EnergyModal` | Modal de decision estrategica |
| `GameOverModal` | Pantalla de fin de partida |

### Hooks Personalizados

| Hook | Descripcion |
|------|-------------|
| `useWebSocket` | Gestion de conexion WebSocket |
| `useGameState` | Estado del juego local |
| `useGameTick` | Actualizacion de recursos pasivos |

---

## Mecanicas del Juego

### Flujo del Juego

```
Jugador se une --> Sala llena? --> No: Esperar segundo jugador
                                    Si: Ambos listos?
                                       No: Marcarse como listo
                                       Si: Iniciar partida
                                          --> Loop principal --> Alguien gana?
                                                              No: Continuar
                                                              Si: Fin del juego
```

### Sistema de Recursos

```
CLICK --> Dinero --> Mejoras/Ataques --> Ventaja
Energia --> Pienso --> Ataques --> Daño al enemigo
Energia --> 1000 --> Eleccion estrategica --> Mejoras/Perjuicios
```

---

## API WebSocket

### Eventos del Cliente

| Evento | Payload | Descripcion |
|--------|---------|-------------|
| `player:join` | `{ playerName: string }` | Jugador se une a la sala |
| `player:ready` | `{ }` | Jugador marca como listo |
| `player:click` | `{ }` | Jugador hace clic |
| `player:buy_upgrade` | `{ upgradeId: string }` | Compra mejora |
| `player:buy_attack` | `{ attackId: string }` | Compra ataque |
| `player:buy_food` | `{ amount: number }` | Compra pienso |
| `player:energy_choice` | `{ choiceId: string }` | Eleccion al 1000 energia |

### Eventos del Servidor

| Evento | Payload | Descripcion |
|--------|---------|-------------|
| `room:state` | `{ gameState }` | Estado completo de la sala |
| `game:start` | `{ }` | Juego iniciado |
| `game:tick` | `{ timestamp }` | Tick del juego (cada segundo) |
| `player:update` | `{ playerId, updates }` | Actualizacion de jugador |
| `attack:received` | `{ attackName, damage }` | Ataque recibido |
| `game:end` | `{ winnerId, winnerName }` | Fin del juego |

---

## Roadmap

### Version 1.0 (Actual)

- [x] Sistema multijugador en tiempo real
- [x] Mecanicas de clicker
- [x] Sistema de mejoras
- [x] Sistema de ataques
- [x] Modal de energia especial
- [x] UI/UX completa

### Version 2.0 (Futura)

- [ ] Sistema de persistencia de datos
- [ ] Leaderboard global
- [ ] Skins para gatos
- [ ] Sala de chat
- [ ] Modo de juego por equipos
- [ ] Sistema de logros
- [ ] Mas items especiales

---

## Contributing

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## Licencia

Este proyecto esta bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para mas detalles.

---

## Creditos

Desarrollado por:

### Jeremías Cortés

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jeremias-cortes/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/JeremiasCortes)

### Irene Fontcuberta

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/irene-fontcuberta/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat&logo=github&logoColor=white)](https://github.com/irenefont)

---

## Demo

[![Watch the demo](https://img.shields.io/badge/YouTube-Video-red?style=flat&logo=youtube&logoColor=white)](https://youtu.be/f2cuwGGrfqs)

---

**Hecho con gatos y código**
