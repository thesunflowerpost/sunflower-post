'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface SunburstProps {
  type?: 'sunburst' | 'fire' | 'heart' | 'unity' | 'vibe';
  onToggle?: (active: boolean) => void;
  isActive?: boolean;
  showCount?: boolean;
  count?: number;
  showLabel?: boolean;
  customLabel?: string;
}

const reactionConfig = {
  sunburst: {
    emoji: '🌻',
    label: 'Sunburst',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
  },
  fire: {
    emoji: '🔥',
    label: 'Fire',
    color: 'text-orange-500',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  heart: {
    emoji: '❤️',
    label: 'Heart',
    color: 'text-red-500',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  unity: {
    emoji: '🤝',
    label: 'Unity',
    color: 'text-purple-500',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
  },
  vibe: {
    emoji: '🎧',
    label: 'Vibe',
    color: 'text-blue-500',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
};

export function Sunburst({
  type = 'sunburst',
  onToggle,
  isActive = false,
  showCount = false,
  count = 0,
  showLabel = false,
  customLabel,
}: SunburstProps) {
  const [localActive, setLocalActive] = useState(isActive);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const config = reactionConfig[type];
  const active = isActive ?? localActive;

  const handleClick = () => {
    const newActive = !active;
    setLocalActive(newActive);
    onToggle?.(newActive);

    if (newActive) {
      // Generate particle burst
      const newParticles = Array.from({ length: 6 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.cos((i * Math.PI * 2) / 6) * 30,
        y: Math.sin((i * Math.PI * 2) / 6) * 30,
      }));
      setParticles(newParticles);
      setTimeout(() => setParticles([]), 600);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      className={`
        relative flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 transition-all
        ${active ? `${config.bgColor} ${config.borderColor}` : 'bg-white border-gray-200'}
        hover:scale-105
      `}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {/* Main emoji with expansion animation */}
      <motion.span
        className="text-lg"
        animate={active ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {config.emoji}
      </motion.span>

      {/* Label (optional) */}
      {showLabel && (
        <span className={`text-xs font-medium ${active ? config.color : 'text-gray-600'}`}>
          {customLabel || config.label}
        </span>
      )}

      {/* Count (optional) */}
      {showCount && count > 0 && (
        <span className={`text-sm font-medium ${active ? config.color : 'text-gray-600'}`}>
          {count}
        </span>
      )}

      {/* Particle burst effect */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            animate={{
              opacity: 0,
              x: particle.x,
              y: particle.y,
              scale: 0.3,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <span className="text-xs">{type === 'sunburst' ? '✨' : config.emoji}</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Glow effect when active */}
      {active && (
        <motion.div
          className={`absolute inset-0 rounded-full ${config.bgColor} blur-sm -z-10`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1.2 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
}
