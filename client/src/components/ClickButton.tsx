/**
 * Componente: ClickButton
 *
 * Botón principal para ganar dinero al hacer clic
 * Muestra animaciones y partículas de feedback
 */

import React, { useRef, useState, useCallback } from 'react';

interface ClickButtonProps {
  onClick: () => void;
  clickPower: number;
  disabled?: boolean;
}

/**
 * Componente del botón de clic principal
 */
export const ClickButton: React.FC<ClickButtonProps> = ({
  onClick,
  clickPower,
  disabled = false,
}) => {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; value: number }>>([]);

  /**
   * Maneja el clic en el botón
   */
  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    onClick();

    // Crear partícula de texto flotante
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newParticle = {
        id: Date.now() + Math.random(),
        x,
        y,
        value: clickPower,
      };

      setParticles(prev => [...prev, newParticle]);

      // Eliminar partícula después de la animación
      setTimeout(() => {
        setParticles(prev => prev.filter(p => p.id !== newParticle.id));
      }, 800);
    }
  }, [onClick, clickPower, disabled]);

  return (
    <div
      ref={buttonRef}
      onClick={handleClick}
      className={`
        relative overflow-hidden
        bg-gradient-to-br from-money to-yellow-500
        hover:from-yellow-400 hover:to-yellow-600
        rounded-3xl shadow-2xl
        cursor-pointer select-none
        transition-all duration-200
        transform hover:scale-105 active:scale-95
        ${disabled ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
      `}
      style={{
        width: '280px',
        height: '280px',
      }}
    >
      {/* Patrón de fondo */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #fff 2px, transparent 2px)',
          backgroundSize: '20px 20px',
        }}
      />

      {/* Contenido del botón */}
      <div className="relative h-full flex flex-col items-center justify-center p-6 text-center">
        {/* Icono de gato */}
        <div className="text-7xl mb-3 animate-bounce-slow">🐾</div>

        {/* Texto principal */}
        <div className="text-2xl font-black text-white drop-shadow-lg mb-1">
          ¡CLIC AQUÍ!
        </div>

        {/* Poder de clic */}
        <div className="text-white font-bold drop-shadow-md">
          +{clickPower} 💰 por clic
        </div>

        {/* Indicador de deshabilitado */}
        {disabled && (
          <div className="mt-2 text-sm text-white/80">
            Esperando oponente...
          </div>
        )}
      </div>

      {/* Partículas de clic */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="click-particle"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
          }}
        >
          +{particle.value} 💰
        </div>
      ))}

      {/* Efecto de brillo en el borde */}
      <div className="absolute inset-0 rounded-3xl ring-4 ring-white/30 animate-pulse-fast" />
    </div>
  );
};
