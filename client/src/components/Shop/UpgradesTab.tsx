/**
 * Componente: UpgradesTab
 *
 * Pestaña de mejoras de la tienda
 */

import React from 'react';
import { PlayerState } from '../../types/game.types';
import { ALL_UPGRADES } from '../../config/gameConfig';
import { Upgrade } from '../../types/game.types';

interface UpgradesTabProps {
  player: PlayerState;
  onBuyUpgrade: (upgradeId: string) => void;
}

/**
 * Calcula el costo de una mejora según el nivel actual
 */
const getUpgradeCost = (upgrade: Upgrade, currentLevel: number): number => {
  return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, currentLevel));
};

/**
 * Verifica si el jugador puede comprar una mejora
 */
const canBuyUpgrade = (upgrade: Upgrade, player: PlayerState): boolean => {
  const currentLevel = player.upgrades[upgrade.id] || 0;

  // Verificar nivel máximo
  if (upgrade.maxLevel && currentLevel >= upgrade.maxLevel) {
    return false;
  }

  const cost = getUpgradeCost(upgrade, currentLevel);
  return player.money >= cost;
};

/**
 * Componente de una tarjeta de mejora
 */
const UpgradeCard: React.FC<{
  upgrade: Upgrade;
  currentLevel: number;
  cost: number;
  canBuy: boolean;
  onClick: () => void;
}> = ({ upgrade, currentLevel, cost, canBuy, onClick }) => {
  return (
    <button
      onClick={onClick}
      disabled={!canBuy}
      className={`
        shop-item text-left w-full
        ${canBuy ? 'hover:bg-white/90' : 'opacity-50 cursor-not-allowed'}
      `}
    >
      {/* Icono y nombre */}
      <div className="flex items-start gap-3 mb-2">
        <div className="text-3xl">{upgrade.icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-800 truncate">{upgrade.name}</h4>
          <p className="text-xs text-gray-600 line-clamp-2">{upgrade.description}</p>
        </div>
      </div>

      {/* Nivel actual */}
      <div className="text-sm text-gray-600 mb-2">
        Nivel: <span className="font-bold text-primary">{currentLevel}</span>
        {upgrade.maxLevel && ` / ${upgrade.maxLevel}`}
        {!upgrade.maxLevel && ' ∞'}
      </div>

      {/* Efecto por nivel */}
      <div className="text-xs text-success font-semibold mb-2">
        +{upgrade.effectPerLevel} {getEffectLabel(upgrade.category)}
      </div>

      {/* Costo */}
      <div className={`
        text-sm font-bold flex items-center gap-1
        ${canBuy ? 'text-money' : 'text-gray-400'}
      `}>
        💰 {cost.toLocaleString()}
      </div>
    </button>
  );
};

/**
 * Obtiene la etiqueta del efecto según la categoría
 */
const getEffectLabel = (category: string): string => {
  switch (category) {
    case 'money_passive': return 'dinero/s';
    case 'energy_passive': return 'energía/s';
    case 'health_max': return 'vida máxima';
    case 'click_power': return 'dinero/clic';
    default: return '';
  }
};

/**
 * Agrupa las mejoras por categoría
 */
const groupUpgrades = (upgrades: Upgrade[]) => {
  return {
    money_passive: upgrades.filter(u => u.category === 'money_passive'),
    energy_passive: upgrades.filter(u => u.category === 'energy_passive'),
    health_max: upgrades.filter(u => u.category === 'health_max'),
    click_power: upgrades.filter(u => u.category === 'click_power'),
  };
};

/**
 * Componente de las mejoras
 */
export const UpgradesTab: React.FC<UpgradesTabProps> = ({ player, onBuyUpgrade }) => {
  const grouped = groupUpgrades(ALL_UPGRADES);

  const renderUpgradeGroup = (upgrades: Upgrade[], title: string, bgColor: string) => {
    if (upgrades.length === 0) return null;

    return (
      <div className={`mb-4 ${bgColor} rounded-xl p-3`}>
        <h4 className="font-bold text-gray-800 mb-2">{title}</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {upgrades.map(upgrade => {
            const currentLevel = player.upgrades[upgrade.id] || 0;
            const cost = getUpgradeCost(upgrade, currentLevel);
            const canBuy = canBuyUpgrade(upgrade, player);
            const isMaxed = upgrade.maxLevel && currentLevel >= upgrade.maxLevel;

            return (
              <UpgradeCard
                key={upgrade.id}
                upgrade={upgrade}
                currentLevel={currentLevel}
                cost={cost}
                canBuy={canBuy && !isMaxed}
                onClick={() => onBuyUpgrade(upgrade.id)}
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="custom-scrollbar max-h-96 overflow-y-auto p-3 space-y-3">
      {renderUpgradeGroup(grouped.money_passive, '💰 Generadores de Dinero', 'bg-money/10')}
      {renderUpgradeGroup(grouped.energy_passive, '⚡ Regeneradores de Energía', 'bg-energy/10')}
      {renderUpgradeGroup(grouped.health_max, '❤️ Mejoras de Vida', 'bg-health/10')}
      {renderUpgradeGroup(grouped.click_power, '🔪 Poder de Clic', 'bg-warning/20')}
    </div>
  );
};
