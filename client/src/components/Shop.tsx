/**
 * Componente: Shop
 *
 * Componente principal de la tienda que agrupa las pestañas
 */

import React, { useState } from 'react';
import { PlayerState } from '../types/game.types';
import { ShopTab, ShopTabs } from './Shop/ShopTabs';
import { UpgradesTab } from './Shop/UpgradesTab';
import { AttacksTab } from './Shop/AttacksTab';
import { ItemsTab } from './Shop/ItemsTab';

interface ShopProps {
  player: PlayerState;
  onBuyUpgrade: (upgradeId: string) => void;
  onBuyAttack: (attackId: string) => void;
  onBuyItem: (itemId: string) => void;
  onUseItem: (itemId: string) => void;
  onBuyFood: (amount: number) => void;
}

/**
 * Componente de la tienda
 */
export const Shop: React.FC<ShopProps> = ({
  player,
  onBuyUpgrade,
  onBuyAttack,
  onBuyItem,
  onUseItem,
  onBuyFood,
}) => {
  const [activeTab, setActiveTab] = useState<ShopTab>('upgrades');

  return (
    <div className="card">
      {/* Pestañas de navegación */}
      <ShopTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Contenido de la pestaña activa */}
      <div className="bg-white/40 rounded-b-xl rounded-tr-xl">
        {activeTab === 'upgrades' && (
          <UpgradesTab player={player} onBuyUpgrade={onBuyUpgrade} />
        )}
        {activeTab === 'attacks' && (
          <AttacksTab player={player} onBuyAttack={onBuyAttack} />
        )}
        {activeTab === 'items' && (
          <ItemsTab player={player} onBuyItem={onBuyItem} onUseItem={onUseItem} />
        )}
      </div>

      {/* Botón para comprar pienso */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-gray-700">Comprar Pienso:</span>
          <span className="text-sm text-gray-600">
            ⚡ 10 energía → 🍖 1 pienso
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onBuyFood(10)}
            disabled={player.energy < 100}
            className={`
              flex-1 py-2 px-4 rounded-lg font-bold transition-all
              ${player.energy >= 100
                ? 'bg-food hover:bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            🍖 x10 (⚡100)
          </button>
          <button
            onClick={() => onBuyFood(50)}
            disabled={player.energy < 500}
            className={`
              flex-1 py-2 px-4 rounded-lg font-bold transition-all
              ${player.energy >= 500
                ? 'bg-food hover:bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            🍖 x50 (⚡500)
          </button>
          <button
            onClick={() => onBuyFood(100)}
            disabled={player.energy < 1000}
            className={`
              flex-1 py-2 px-4 rounded-lg font-bold transition-all
              ${player.energy >= 1000
                ? 'bg-food hover:bg-orange-500 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }
            `}
          >
            🍖 x100 (⚡1K)
          </button>
        </div>
      </div>
    </div>
  );
};
