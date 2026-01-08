# 🐱 Batalla de Gatos - Cliente

Cliente React + TypeScript + Vite para el juego Batalla de Gatos.

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## Build para Producción

```bash
npm run build
```

Los archivos optimizados se generarán en `dist/`.

## Preview de Producción

```bash
npm run preview
```

## Tecnologías

- **React 18.2**: Biblioteca UI
- **TypeScript 5.3**: Tipado estático
- **Vite 5.0**: Build tool y servidor de desarrollo
- **Tailwind CSS 3.4**: Framework CSS utility-first

## Estructura del Proyecto

```
src/
├── components/       # Componentes React
│   ├── GameLobby.tsx
│   ├── GameBoard.tsx
│   ├── PlayerStats.tsx
│   ├── ClickButton.tsx
│   ├── Shop.tsx
│   ├── Shop/
│   │   ├── ShopTabs.tsx
│   │   ├── UpgradesTab.tsx
│   │   ├── AttacksTab.tsx
│   │   └── ItemsTab.tsx
│   ├── EnergyModal.tsx
│   └── GameOverModal.tsx
├── hooks/           # Hooks personalizados
│   ├── useWebSocket.ts
│   └── useGameState.ts
├── types/           # Definiciones TypeScript
│   ├── game.types.ts
│   └── websocket.types.ts
├── config/          # Configuración del juego
│   └── gameConfig.ts
├── App.tsx          # Componente raíz
├── main.tsx         # Punto de entrada
└── index.css        # Estilos globales
```

## Configuración de WebSocket

El cliente intenta conectarse a `ws://localhost:3001` por defecto.

Para cambiar la URL del servidor, modifica `WS_URL` en `src/config/gameConfig.ts`.
