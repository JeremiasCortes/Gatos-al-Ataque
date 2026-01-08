/**
 * Componente: ItemsTab
 *
 * Pestaña de items de la tienda
 */

import React from 'react';
import { PlayerState } from '../../types/game.types';
import { ALL_ITEMS } from '../../config/gameConfig';
import { Item } from '../../types/game.types';

interface ItemsTabProps {
  player: PlayerState;
  onBuyItem: (itemId: string) => void;
  onUseItem?: (itemId: string) => void;
}

/**
 * Verifica si el jugador puede comprar un item
 */
const canBuyItem = (item: Item, player: PlayerState): boolean => {
  if (item.cost.type === 'money') {
    return player.money >= item.cost.amount;
  } else {
    return player.food >= item.cost.amount;
  }
};

/**
 * Obtiene el icono del costo
 */
const getCostIcon = (costType: string): string => {
  return costType === 'money' ? '💰' : '🍖';
};

/**
 * Componente de una tarjeta de item
 */
const ItemCard: React.FC<{
  item: Item;
  owned: number;
  canBuy: boolean;
  onBuy: () => void;
  onUse?: () => void;
}> = ({ item, owned, canBuy, onBuy, onUse }) => {
  const costIcon = getCostIcon(item.cost.type);

  return (
    <div className="shop-item">
      {/* Icono y nombre */}
      <div className="flex items-start gap-3 mb-2">
        <div className="text-3xl">{item.icon}</div>
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-800 truncate">{item.name}</h4>
          <p className="text-xs text-gray-600 line-clamp-2">{item.description}</p>
        </div>
      </div>

      {/* Cantidad owned si es stackable */}
      {item.stackable && (
        <div className="text-sm text-gray-600 mb-2">
          Tienes: <span className="font-bold text-primary">{owned}</span>
        </div>
      )}

      {/* Efecto del item */}
      <div className="text-xs text-secondary font-semibold mb-2">
        {getEffectLabel(item)}
      </div>

      {/* Costo y botón de compra */}
      <div className="flex items-center justify-between gap-2">
        <div className={`
          text-sm font-bold flex items-center gap-1
          ${canBuy ? item.cost.type === 'money' ? 'text-money' : 'text-food' : 'text-gray-400'}
        `}>
          {costIcon} {item.cost.amount.toLocaleString()}
        </div>

        {/* Botón de comprar */}
        {item.stackable && owned > 0 ? (
          <span className="text-xs text-success font-semibold">Ya tienes</span>
        ) : (
          <button
            onClick={onBuy}
            disabled={!canBuy}
            className={`
              px-3 py-1 rounded-lg text-sm font-bold
              ${canBuy
                ? 'bg-primary hover:bg-red-500 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }
              transition-colors
            `}
          >
            Comprar
          </button>
        )}
      </div>

      {/* Botón de usar (solo items stackables) */}
      {item.stackable && owned > 0 && onUse && (
        <button
          onClick={onUse}
          className="w-full mt-2 btn-success text-sm py-1"
        >
          Usar ({owned})
        </button>
      )}
    </div>
  );
};

/**
 * Obtiene la etiqueta del efecto del item
 */
const getEffectLabel = (item: Item): string => {
  const effect = item.effect;
  switch (effect.type) {
    case 'instant_money':
      return `+${effect.amount} dinero instantáneo`;
    case 'instant_energy':
      return `+${effect.amount} energía instantánea`;
    case 'instant_health':
      return `+${effect.amount} vida instantánea`;
    case 'instant_damage':
      return `${effect.amount} daño al enemigo`;
    case 'money_per_second':
      return `+${effect.amount} dinero/s permanente`;
    case 'energy_per_second':
      return `+${effect.amount} energía/s permanente`;
    case 'damage_per_second':
      return `+${effect.amount} DPS permanente`;
    case 'click_multiplier':
      return `x${effect.multiplier} clics por ${effect.duration}s`;
    default:
      return '';
  }
};

/**
 * Componente de los items
 */
export const ItemsTab: React.FC<ItemsTabProps> = ({ player, onBuyItem, onUseItem }) => {
  // Separar items de un solo uso y acumulables
  const singleUseItems = ALL_ITEMS.filter(i => !i.stackable);
  const stackableItems = ALL_ITEMS.filter(i => i.stackable);

  return (
    <div className="custom-scrollbar max-h-96 overflow-y-auto p-3 space-y-4">
      {/* Items de un solo uso */}
      <div className="bg-secondary/10 rounded-xl p-3">
        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
          ✨ Items de Un Solo Uso
          <span className="text-xs font-normal text-gray-600">
            (Se usan al comprar)
          </span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {singleUseItems.map(item => {
            const canBuy = canBuyItem(item, player);
            return (
              <ItemCard
                key={item.id}
                item={item}
                owned={0}
                canBuy={canBuy}
                onBuy={() => onBuyItem(item.id)}
              />
            );
          })}
        </div>
      </div>

      {/* Items acumulables */}
      <div className="bg-primary/10 rounded-xl p-3">
        <h4 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
          👑 Items Acumulables
          <span className="text-xs font-normal text-gray-600">
            (Se guardan en el inventario)
          </span>
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {stackableItems.map(item => {
            const owned = player.items[item.id] || 0;
            const canBuy = canBuyItem(item, player);
            return (
              <ItemCard
                key={item.id}
                item={item}
                owned={owned}
                canBuy={canBuy}
                onBuy={() => onBuyItem(item.id)}
                onUse={owned > 0 && onUseItem ? () => onUseItem(item.id) : undefined}
              />
            );
          })}
        </div>
      </div>

      {/* Inventario de items acumulables */}
      {onUseItem && Object.keys(player.items).length > 0 && (
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-3">
          <h4 className="font-bold text-gray-800 mb-2">🎒 Tu Inventario</h4>
          <div className="space-y-2">
            {Object.entries(player.items)
              .filter(([_, count]) => count > 0)
              .map(([itemId, count]) => {
                const item = stackableItems.find(i => i.id === itemId);
                if (!item) return null;
                return (
                  <div
                    key={itemId}
                    className="flex items-center justify-between bg-white/60 rounded-lg p-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{item.icon}</span>
                      <span className="font-semibold">{item.name}</span>
                      <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                        x{count}
                      </span>
                    </div>
                    <button
                      onClick={() => onUseItem(itemId)}
                      className="btn-success text-xs px-3 py-1"
                    >
                      Usar
                    </button>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
};
