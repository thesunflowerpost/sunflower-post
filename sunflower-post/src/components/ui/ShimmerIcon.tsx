'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface ShimmerIconProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ShimmerIcon({ children, onClick, className = '' }: ShimmerIconProps) {
  const [isShimmering, setIsShimmering] = useState(false);

  const handleClick = () => {
    setIsShimmering(true);
    onClick?.();
    setTimeout(() => setIsShimmering(false), 600);
  };

  return (
    <motion.div
      className={`relative inline-block cursor-pointer ${className}`}
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
      animate={
        isShimmering
          ? {
              filter: [
                'brightness(1)',
                'brightness(1.4)',
                'brightness(1)',
              ],
            }
          : {}
      }
      transition={{ duration: 0.6 }}
    >
      {children}
      {isShimmering && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0, x: '-100%' }}
          animate={{
            opacity: [0, 1, 0],
            x: ['100%', '-100%'],
          }}
          transition={{ duration: 0.6 }}
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent)',
          }}
        />
      )}
    </motion.div>
  );
}
