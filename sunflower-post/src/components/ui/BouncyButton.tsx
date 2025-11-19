'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BouncyButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'pill';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
}

export function BouncyButton({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  type = 'button',
  disabled = false,
}: BouncyButtonProps) {
  const baseStyles = 'font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-yellow-400 hover:bg-yellow-500 text-yellow-900 shadow-sm hover:shadow-md',
    secondary: 'border-2 border-yellow-200 bg-white hover:bg-yellow-50 text-yellow-900',
    ghost: 'bg-transparent hover:bg-yellow-50 text-yellow-900',
    pill: 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-yellow-900 shadow-sm hover:shadow-md',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-base rounded-xl',
    lg: 'px-6 py-3.5 text-lg rounded-2xl',
  };

  return (
    <motion.button
      whileTap={{ scale: 0.97 }} // 3% bounce on press
      whileHover={{ scale: 1.02 }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 17,
      }}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
