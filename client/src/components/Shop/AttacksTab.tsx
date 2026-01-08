/**
 * Componente: AttacksTab
 *
 * Pestaña de ataques de la tienda
 */

import React from 'react';
import { PlayerState } from '../../types/game.types';
import { ALL_ATTACKS } from '../../config/gameConfig';
import { Attack } from '../../types/game.types';

interface AttacksTabProps {
  player: PlayerState;
  onBuyAttack: (attackId: string) => void;
}

/**
 * Verifica si el jugador puede comprar un ataque
 */
const canBuyAttack = (attack: Attack, player: PlayerState): boolean => {
  return player.food >= attack.foodCost;
};

/**
 * Componente de una tarjeta de ataque
 */
const AttackCard: React.FC<{
  attack: Attack;
  canBuy: boolean;
  onClick: () => void;
}> = ({ attack, canBuy, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={!canBuy}
      className={`
        shop-item text-left w-full
        ${canBuy ? 'hover:bg-white/90' : 'opacity-50 cursor-not-allowed'}
        ${attack.type === 'instant' ? 'border-l-4 border-danger' : 'border-l-4 border-warning'}
      `}
    >
      {/* Icono y nombre */}
      <div className="flex items-start gap-3 mb-2">
        <div className="text-3xl">{attack.icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-800 truncate">{attack.name}</h4>
          <p className="text-xs text-gray-600 line-clamp-2">{attack.description}</p>
        </div>
      </div>

      {/* Tipo de ataque */}
      <div className="text-xs mb-2">
        {attack.type === 'instant' ? (
          <span className="bg-danger/20 text-danger px-2 py-1 rounded-full font-semibold">
            💥 Instantáneo
          </span>
        ) : (
          <span className="bg-warning/20 text-warning px-2 py-1 rounded-full font-semibold">
            ⏳ Pasivo ({attack.damage} DPS)
          </span>
        )}
      </div>

      {/* Daño */}
      <div className="text-sm font-semibold mb-2">
        {attack.type === 'instant' ? (
          <span className="text-danger">💥 {attack.damage} daño</span>
        ) : (
          <span className="text-warning">⏳ {attack.damage} daño/s</span>
        )}
      </div>

      {/* Costo */}
      <div className={`
        text-sm font-bold flex items-center gap-1
        ${canBuy ? 'text-food' : 'text-gray-400'}
      `}>
        🍖 {attack.foodCost} pienso
      </div>
    </button>
  );
};

/**
 * Componente de los ataques
 */
export const AttacksTab: React.FC<AttacksTabProps> = ({ player, onBuyAttack }) => {
  // Separar ataques instantáneos y pasivos
  const instantAttacks = ALL_ATTACKS.filter(a => a.type === 'instant');
  const passiveAttacks = ALL_ATTACKS.filter(a => a.type === 'passive');

  return (
    <div className="custom-scrollbar max-h-96 overflow-y-auto p-3 space-y-4">
      {/* Ataques instantáneos */}
      <div className="bg-danger/10 rounded-xl p-3">
        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
          💥 Ataques Instantáneos
          <span className="text-xs font-normal text-gray-600">
            (Daño inmediato al enemigo)
          </span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {instantAttacks.map(attack => {
            const canBuy = canBuyAttack(attack, player);
            return (
              <AttackCard
                key={attack.id}
                attack={attack}
                canBuy={canBuy}
                onClick={() => onBuyAttack(attack.id)}
              />
            );
          })}
        </div>
      </div>

      {/* Ataques pasivos */}
      <div className="bg-warning/10 rounded-xl p-3">
        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
          ⏳ Ataques Pasivos
          <span className="text-xs font-normal text-gray-600">
            (Daño continuo por segundo)
          </span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {passiveAttacks.map(attack => {
            const canBuy = canBuyAttack(attack, player);
            return (
              <AttackCard
                key={attack.id}
                attack={attack}
                canBuy={canBuy}
                onClick={() => onBuyAttack(attack.id)}
              />
            );
          })}
        </div>
      </div>

      {/* Info de DPS actual */}
      {player.damagePerSecond > 0 && (
        <div className="bg-gradient-to-r from-warning/20 to-danger/20 rounded-xl p-3 text-center">
          <div className="text-sm text-gray-600">Daño por segundo actual:</div>
          <div className="text-2xl font-black text-danger">
            ⚔️ {player.damagePerSecond} DPS
          </div>
        </div>
      )}
    </div>
  );
};
