/**
 * Componente: ShopTabs
 *
 * Pestañas de navegación de la tienda
 */

import React from 'react';

export type ShopTab = 'upgrades' | 'attacks' | 'items';

interface ShopTabsProps {
  activeTab: ShopTab;
  onTabChange: (tab: ShopTab) => void;
}

/**
 * Componente de las pestañas de la tienda
 */
export const ShopTabs: React.FC<ShopTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: ShopTab; label: string; icon: string }[] = [
    { id: 'upgrades', label: 'Mejoras', icon: '⬆️' },
    { id: 'attacks', label: 'Ataques', icon: '⚔️' },
    { id: 'items', label: 'Items', icon: '🎒' },
  ];

  return (
    <div className="flex gap-1 bg-white/40 rounded-t-xl p-1">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`
            tab-button flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg
            transition-all duration-200
            ${activeTab === tab.id
              ? 'bg-white text-primary font-bold shadow-md'
              : 'text-gray-600 hover:bg-white/50'
            }
          `}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};
