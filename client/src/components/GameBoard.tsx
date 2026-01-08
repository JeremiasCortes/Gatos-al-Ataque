/**
 * Componente: GameBoard
 *
 * Tablero principal del juego donde ocurre toda la acción
 *
 * Estructura:
 * - Header: Estadísticas de ambos jugadores (vida, recursos)
 * - Centro: Botón de clic principal
 * - Sidebar: Tienda con tabs (Mejoras, Ataques, Items)
 */

import React, { useState, useEffect, useRef } from 'react';
import { PlayerState } from '../types/game.types';
import { PlayerStats } from './PlayerStats';
import { ClickButton } from './ClickButton';
import { Shop } from './Shop';
import { EnergyModal } from './EnergyModal';
import { GameOverModal } from './GameOverModal';
import { GAME_CONFIG } from '../config/gameConfig';

interface GameBoardProps {
  player: PlayerState;
  enemy: PlayerState | null;
  onClick: () => void;
  onBuyFood: (amount: number) => void;
  onBuyUpgrade: (upgradeId: string) => void;
  onBuyAttack: (attackId: string) => void;
  onBuyItem: (itemId: string) => void;
  onUseItem: (itemId: string) => void;
  onEnergyChoice: (choiceId: string) => void;
  onResetGame: () => void;
  gameEnded: boolean;
  isWinner: boolean;
  winnerName: string;
}

/**
 * Componente del tablero de juego
 */
export const GameBoard: React.FC<GameBoardProps> = ({
  player,
  enemy,
  onClick,
  onBuyFood,
  onBuyUpgrade,
  onBuyAttack,
  onBuyItem,
  onUseItem,
  onEnergyChoice,
  onResetGame,
  gameEnded,
  isWinner,
  winnerName,
}) => {
  // Estado del modal de energía
  const [showEnergyModal, setShowEnergyModal] = useState(false);

  // Estado de daño recibido para animación
  const [damageReceived, setDamageReceived] = useState(0);
  const damageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Detectar cuando la energía alcanza el máximo
  useEffect(() => {
    if (player.energy >= GAME_CONFIG.MAX_ENERGY && !gameEnded) {
      setShowEnergyModal(true);
    }
  }, [player.energy, gameEnded]);

  /**
   * Maneja la elección del modal de energía
   */
  const handleEnergyChoice = (choiceId: string) => {
    onEnergyChoice(choiceId);
    setShowEnergyModal(false);
  };

  /**
   * Muestra animación de daño recibido
   */
  const showDamageAnimation = (damage: number) => {
    setDamageReceived(damage);

    if (damageTimeoutRef.current) {
      clearTimeout(damageTimeoutRef.current);
    }

    damageTimeoutRef.current = setTimeout(() => {
      setDamageReceived(0);
    }, 500);
  };

  // Efecto para detectar cambios en la vida del enemigo (cuando nosotros atacamos)
  const prevEnemyHealthRef = useRef(enemy?.health || 0);
  useEffect(() => {
    if (enemy && enemy.health < prevEnemyHealthRef.current) {
      const damage = prevEnemyHealthRef.current - enemy.health;
      // Aquí podríamos añadir una animación de ataque
    }
    prevEnemyHealthRef.current = enemy?.health || 0;
  }, [enemy]);

  return (
    <div className="min-h-screen p-4">
      {/* Header: Stats de ambos jugadores */}
      <div className="max-w-4xl mx-auto mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mi gato */}
          <div className="order-2 md:order-1">
            <PlayerStats player={player} isEnemy={false} />
          </div>

          {/* Enemigo */}
          <div className="order-1 md:order-2">
            {enemy && (
              <PlayerStats
                player={enemy}
                isEnemy={true}
                showDamage={damageReceived > 0}
                damageReceived={damageReceived}
              />
            )}
          </div>
        </div>
      </div>

      {/* Centro: Botón de clic */}
      <div className="flex justify-center mb-6">
        <ClickButton
          onClick={onClick}
          clickPower={player.clickPower}
          disabled={gameEnded || !enemy}
        />
      </div>

      {/* Indicadores de tasas pasivas */}
      <div className="max-w-md mx-auto mb-6">
        <div className="card bg-gradient-to-r from-money/20 to-energy/20">
          <div className="flex justify-around text-center">
            <div>
              <div className="text-2xl font-black text-money">
                +{player.moneyPerSecond}/s
              </div>
              <div className="text-xs text-gray-600">Dinero pasivo</div>
            </div>
            <div>
              <div className="text-2xl font-black text-energy">
                +{player.energyPerSecond}/s
              </div>
              <div className="text-xs text-gray-600">Energía pasiva</div>
            </div>
            {player.damagePerSecond > 0 && (
              <div>
                <div className="text-2xl font-black text-danger">
                  {player.damagePerSecond} DPS
                </div>
                <div className="text-xs text-gray-600">Daño pasivo</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tienda */}
      <div className="max-w-4xl mx-auto">
        <Shop
          player={player}
          onBuyUpgrade={onBuyUpgrade}
          onBuyAttack={onBuyAttack}
          onBuyItem={onBuyItem}
          onUseItem={onUseItem}
          onBuyFood={onBuyFood}
        />
      </div>

      {/* Modal de energía */}
      <EnergyModal
        isOpen={showEnergyModal}
        onChoice={handleEnergyChoice}
        playerHealth={player.health}
        playerMaxHealth={player.maxHealth}
      />

      {/* Modal de fin de juego */}
      <GameOverModal
        isOpen={gameEnded}
        isWinner={isWinner}
        winnerName={winnerName}
        onPlayAgain={onResetGame}
      />
    </div>
  );
};
