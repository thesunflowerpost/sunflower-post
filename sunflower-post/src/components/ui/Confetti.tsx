'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ConfettiProps {
  trigger: boolean;
  type?: 'celebration' | 'milestone' | 'level-up' | 'streak';
  duration?: number;
}

const confettiEmojis = {
  celebration: ['🌻', '✨', '💛', '🌟', '☀️'],
  milestone: ['🎉', '🌻', '⭐', '💫', '🏆'],
  'level-up': ['🔥', '⬆️', '🌟', '💪', '✨'],
  streak: ['🔥', '🌻', '☀️', '💛', '✨'],
};

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
  delay: number;
}

export function Confetti({ trigger, type = 'celebration', duration = 2000 }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShow(true);

      // Generate particles
      const emojis = confettiEmojis[type];
      const newParticles = Array.from({ length: 20 }, (_, i) => ({
        id: Date.now() + i,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        x: Math.random() * 100 - 50, // -50 to 50
        y: -Math.random() * 100 - 50, // -50 to -150
        rotation: Math.random() * 720 - 360, // -360 to 360
        delay: Math.random() * 0.3,
      }));

      setParticles(newParticles);

      // Clear after duration
      setTimeout(() => {
        setShow(false);
        setParticles([]);
      }, duration);
    }
  }, [trigger, type, duration]);

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              className="absolute text-2xl"
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 0,
                rotate: 0,
              }}
              animate={{
                x: particle.x,
                y: particle.y,
                opacity: [1, 1, 0],
                scale: [0, 1.2, 0.8],
                rotate: particle.rotation,
              }}
              transition={{
                duration: duration / 1000,
                delay: particle.delay,
                ease: 'easeOut',
              }}
            >
              {particle.emoji}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
