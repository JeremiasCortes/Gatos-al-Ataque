/**
 * Componente: EnergyModal
 *
 * Modal que aparece cuando la energía llega a 1000
 * Ofrece 4 opciones diferentes al jugador
 */

import React from 'react';
import { ENERGY_MODAL_OPTIONS } from '../config/gameConfig';

interface EnergyModalProps {
  isOpen: boolean;
  onChoice: (choiceId: string) => void;
  playerHealth?: number;
  playerMaxHealth?: number;
}

/**
 * Componente del modal de energía
 */
export const EnergyModal: React.FC<EnergyModalProps> = ({
  isOpen,
  onChoice,
  playerHealth = 0,
  playerMaxHealth = 10000,
}) => {
  if (!isOpen) return null;

  // Calcular porcentaje de vida
  const healthPercent = (playerHealth / playerMaxHealth) * 100;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">⚡⚡⚡</div>
          <h2 className="text-3xl font-black text-gray-800 mb-2">
            ¡¡ENERGÍA MÁXIMA!!
          </h2>
          <p className="text-gray-600">
            Tu energía ha alcanzado el máximo. Elige una opción:
          </p>
        </div>

        {/* Opciones */}
        <div className="grid grid-cols-1 gap-3">
          {ENERGY_MODAL_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => onChoice(option.id)}
              className={`
                relative overflow-hidden
                bg-gradient-to-r from-gray-50 to-gray-100
                hover:from-primary/20 hover:to-secondary/20
                rounded-xl p-4 text-left
                transition-all duration-200 transform hover:scale-102
                border-2 border-transparent hover:border-primary/50
                group
              `}
            >
              {/* Icono y nombre */}
              <div className="flex items-start gap-3">
                <div className="text-4xl group-hover:scale-110 transition-transform">
                  {option.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg mb-1">
                    {option.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {option.description}
                  </p>

                  {/* Detalles del efecto */}
                  <div className="text-sm">
                    {option.effect.type === 'instant_damage' && (
                      <span className="text-danger font-semibold">
                        💥 {option.effect.value} daño al enemigo
                      </span>
                    )}
                    {option.effect.type === 'instant_heal' && (
                      <span className="text-success font-semibold">
                        💚 +{option.effect.value} vida
                      </span>
                    )}
                    {option.effect.type === 'permanent_modifier' && (
                      <div className="flex flex-wrap gap-2">
                        {option.effect.earningsMultiplier && (
                          <span className="bg-money/20 text-money px-2 py-1 rounded-full text-xs font-semibold">
                            💰 +{Math.round((option.effect.earningsMultiplier - 1) * 100)}% ganancias
                          </span>
                        )}
                        {option.effect.passiveEarningsMultiplier && (
                          <span className="bg-warning/20 text-warning px-2 py-1 rounded-full text-xs font-semibold">
                            📉 {Math.round((option.effect.passiveEarningsMultiplier - 1) * 100)}% pasivas
                          </span>
                        )}
                        {option.effect.damageMultiplier && (
                          <span className="bg-danger/20 text-danger px-2 py-1 rounded-full text-xs font-semibold">
                            🛡️ x{option.effect.damageMultiplier.toFixed(2)} daño recibido
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Indicador de recomendación según estado */}
              {option.id === 'heal_self' && healthPercent < 30 && (
                <div className="absolute top-2 right-2">
                  <span className="bg-success text-white text-xs px-2 py-1 rounded-full font-bold animate-pulse">
                    RECOMENDADO
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Info adicional */}
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>⚡ Tu energía se restablecerá a 0 después de elegir</p>
        </div>
      </div>
    </div>
  );
};
