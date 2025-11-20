'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import type { ReactionId, ReactionDefinition } from '@/config/reactions';
import { getReaction } from '@/config/reactions';

interface SunburstProps {
  reactionId: ReactionId;
  onToggle?: (active: boolean) => void;
  isActive?: boolean;
  showCount?: boolean;
  count?: number;
  showLabel?: boolean;
  customLabel?: string;
  customTooltip?: string;
}

/**
 * Legacy type support for backward compatibility
 * @deprecated Use reactionId instead
 */
interface LegacySunburstProps {
  type?: 'sunburst' | 'fire' | 'heart' | 'unity' | 'vibe';
  onToggle?: (active: boolean) => void;
  isActive?: boolean;
  showCount?: boolean;
  count?: number;
  showLabel?: boolean;
  customLabel?: string;
}

// Map legacy types to new ReactionIds
const legacyTypeMap: Record<string, ReactionId> = {
  sunburst: 'sunburst',
  fire: 'thisSlaps',
  heart: 'heart',
  unity: 'withYou',
  vibe: 'vibes',
};

export function Sunburst(
  props: SunburstProps | LegacySunburstProps
) {
  // Handle both new and legacy prop formats
  const reactionId = 'reactionId' in props
    ? props.reactionId
    : legacyTypeMap[props.type || 'sunburst'];

  const {
    onToggle,
    isActive = false,
    showCount = false,
    count = 0,
    showLabel = false,
    customLabel,
  } = props;

  // customTooltip is only available in new SunburstProps
  const customTooltip = 'customTooltip' in props ? props.customTooltip : undefined;

  const [localActive, setLocalActive] = useState(isActive);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number }>>([]);

  // Get reaction config from centralized config
  const reactionDef = getReaction(reactionId);
  const config = {
    emoji: reactionDef.emoji,
    label: reactionDef.label,
    tooltip: reactionDef.tooltip,
    color: reactionDef.color || 'text-gray-500',
    bgColor: reactionDef.bgColor || 'bg-gray-50',
    borderColor: reactionDef.borderColor || 'border-gray-200',
  };

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

  const displayLabel = customLabel || config.label;
  const displayTooltip = customTooltip || config.tooltip || displayLabel;

  return (
    <motion.button
      onClick={handleClick}
      className={`
        relative flex items-center gap-1 px-2 py-1 rounded-full border transition-all
        ${active ? `${config.bgColor} ${config.borderColor}` : 'bg-white border-gray-200'}
        hover:scale-105
      `}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      title={displayTooltip}
      aria-label={displayTooltip}
    >
      {/* Main emoji with expansion animation */}
      <motion.span
        className="text-sm"
        animate={active ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {config.emoji}
      </motion.span>

      {/* Label (optional) */}
      {showLabel && (
        <span className={`text-xs font-medium ${active ? config.color : 'text-gray-600'}`}>
          {displayLabel}
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
            <span className="text-xs">{reactionId === 'sunburst' ? '✨' : config.emoji}</span>
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
