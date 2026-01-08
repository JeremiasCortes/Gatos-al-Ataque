/**
 * Componente: GameOverModal
 *
 * Modal que aparece cuando el juego termina
 * Muestra el ganador y opción de jugar de nuevo
 */

import React from 'react';

interface GameOverModalProps {
  isOpen: boolean;
  isWinner: boolean;
  winnerName: string;
  onPlayAgain: () => void;
}

/**
 * Componente del modal de fin de juego
 */
export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  isWinner,
  winnerName,
  onPlayAgain,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content text-center">
        {/* Icono y título */}
        {isWinner ? (
          <>
            <div className="text-8xl mb-4 animate-bounce">🏆</div>
            <h2 className="text-4xl font-black text-gray-800 mb-2">
              ¡¡VICTORIA!!
            </h2>
            <p className="text-xl text-success font-semibold mb-6">
              ¡Has ganado la batalla de gatos!
            </p>

            {/* Confeti (emoji simulado) */}
            <div className="text-4xl mb-6 space-x-2">
              <span className="inline-block animate-bounce" style={{ animationDelay: '0s' }}>🎉</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.1s' }}>🎊</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>🐱</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.3s' }}>🎊</span>
              <span className="inline-block animate-bounce" style={{ animationDelay: '0.4s' }}>🎉</span>
            </div>
          </>
        ) : (
          <>
            <div className="text-8xl mb-4">😿</div>
            <h2 className="text-4xl font-black text-gray-800 mb-2">
              DERROTA
            </h2>
            <p className="text-xl text-danger font-semibold mb-6">
              {winnerName} ha ganado la batalla
            </p>

            {/* Mensaje de ánimo */}
            <div className="text-4xl mb-6 space-x-2">
              <span className="inline-block">💔</span>
              <span className="inline-block">😿</span>
              <span className="inline-block">💔</span>
            </div>
          </>
        )}

        {/* Mensaje adicional */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 mb-6">
          <p className="text-gray-700">
            {isWinner
              ? '¡Eres el gato más temido del vecindario! Tu estrategia fue impecable.'
              : 'No te rindas... ¡entrena más y vuelve a intentarlo!'}
          </p>
        </div>

        {/* Botón para jugar de nuevo */}
        <button
          onClick={onPlayAgain}
          className="btn-primary w-full text-lg py-4"
        >
          🔄 Jugar de Nuevo
        </button>
      </div>
    </div>
  );
};
