/**
 * Componente: PlayerStats
 *
 * Muestra las estadísticas del jugador (vida, recursos, tasas)
 */

import React from 'react';
import { PlayerState } from '../types/game.types';

interface PlayerStatsProps {
  player: PlayerState;
  isEnemy?: boolean;
  showDamage?: boolean;
  damageReceived?: number;
}

/**
 * Componente de estadísticas de un jugador
 */
export const PlayerStats: React.FC<PlayerStatsProps> = ({
  player,
  isEnemy = false,
  showDamage = false,
  damageReceived = 0,
}) => {
  // Calcular porcentaje de vida
  const healthPercent = (player.health / player.maxHealth) * 100;

  // Color de la barra de vida según porcentaje
  const getHealthColor = () => {
    if (healthPercent > 60) return 'bg-health';
    if (healthPercent > 30) return 'bg-warning';
    return 'bg-danger';
  };

  return (
    <div
      className={`card ${isEnemy ? 'bg-gradient-to-br from-red-50 to-orange-50' : 'bg-gradient-to-br from-green-50 to-teal-50'} ${showDamage ? 'damage-flash' : ''}`}
    >
      {/* Header con nombre y avatar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="text-4xl">{isEnemy ? '😾' : '🐱'}</div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 text-lg">
            {isEnemy ? `Enemigo: ${player.name}` : player.name}
          </h3>
          {showDamage && damageReceived > 0 && (
            <div className="text-danger font-semibold animate-pulse">
              -{damageReceived} daño recibido
            </div>
          )}
        </div>
      </div>

      {/* Barra de vida */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-semibold text-gray-700">❤️ Vida</span>
          <span className="font-mono font-bold text-gray-800">
            {Math.floor(player.health)} / {player.maxHealth}
          </span>
        </div>
        <div className="progress-bar h-6 bg-gray-300">
          <div
            className={`progress-fill ${getHealthColor()} relative overflow-hidden`}
            style={{ width: `${Math.max(0, healthPercent)}%` }}
          >
            {/* Patrón de rayas */}
            <div className="absolute inset-0 opacity-20">
              <div className="h-full w-full" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(255,255,255,0.3) 5px, rgba(255,255,255,0.3) 10px)',
              }}></div>
            </div>
          </div>
        </div>
        <div className="text-right text-xs font-semibold text-gray-600 mt-1">
          {healthPercent.toFixed(1)}%
        </div>
      </div>

      {/* Recursos - solo mostrar para el jugador actual */}
      {!isEnemy && (
        <div className="grid grid-cols-3 gap-2">
          {/* Dinero */}
          <div className="bg-white/60 rounded-lg p-2 text-center">
            <div className="text-2xl mb-1">💰</div>
            <div className="font-mono font-bold text-gray-800 text-sm">
              {Math.floor(player.money).toLocaleString()}
            </div>
            <div className="text-xs text-success font-semibold">
              +{player.moneyPerSecond}/s
            </div>
          </div>

          {/* Energía */}
          <div className="bg-white/60 rounded-lg p-2 text-center">
            <div className="text-2xl mb-1">⚡</div>
            <div className="font-mono font-bold text-gray-800 text-sm">
              {Math.floor(player.energy)}
            </div>
            <div className="text-xs text-energy font-semibold">
              +{player.energyPerSecond}/s
            </div>
          </div>

          {/* Pienso */}
          <div className="bg-white/60 rounded-lg p-2 text-center">
            <div className="text-2xl mb-1">🍖</div>
            <div className="font-mono font-bold text-gray-800 text-sm">
              {player.food}
            </div>
            <div className="text-xs text-food font-semibold">
              {player.damagePerSecond > 0 && `+${player.damagePerSecond} DPS`}
            </div>
          </div>
        </div>
      )}

      {/* Stats adicionales para el enemigo */}
      {isEnemy && (
        <div className="flex gap-2 text-sm">
          <div className="bg-white/60 rounded-lg px-3 py-1 flex items-center gap-1">
            <span>⚔️</span>
            <span className="font-bold">{player.damagePerSecond} DPS</span>
          </div>
        </div>
      )}

      {/* Modificadores activos */}
      {player.modifiers && (
        (player.modifiers.earningsMultiplier !== 1 ||
          player.modifiers.passiveEarningsMultiplier !== 1 ||
          player.modifiers.damageMultiplier !== 1) && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs font-semibold text-gray-600 mb-2">Modificadores:</div>
            <div className="flex flex-wrap gap-2">
              {player.modifiers.earningsMultiplier !== 1 && (
                <div className="bg-money/20 text-xs px-2 py-1 rounded-full">
                  💰 x{player.modifiers.earningsMultiplier.toFixed(2)}
                </div>
              )}
              {player.modifiers.passiveEarningsMultiplier !== 1 && (
                <div className="bg-money/20 text-xs px-2 py-1 rounded-full">
                  📊 Pasivas x{player.modifiers.passiveEarningsMultiplier.toFixed(2)}
                </div>
              )}
              {player.modifiers.damageMultiplier !== 1 && (
                <div className="bg-danger/20 text-xs px-2 py-1 rounded-full">
                  🛡️ x{player.modifiers.damageMultiplier.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  );
};
