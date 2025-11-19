'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Confetti } from './Confetti';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  emoji?: string;
  type?: 'celebration' | 'milestone' | 'level-up' | 'streak';
  autoClose?: boolean;
  autoCloseDuration?: number;
}

export function CelebrationModal({
  isOpen,
  onClose,
  title,
  message,
  emoji = '🌻',
  type = 'celebration',
  autoClose = true,
  autoCloseDuration = 3000,
}: CelebrationModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      if (autoClose) {
        setTimeout(() => {
          onClose();
        }, autoCloseDuration);
      }
    } else {
      setShowConfetti(false);
    }
  }, [isOpen, autoClose, autoCloseDuration, onClose]);

  return (
    <>
      <Confetti trigger={showConfetti} type={type} />
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                }}
                className="bg-white rounded-3xl shadow-2xl p-8 max-w-md mx-4 text-center pointer-events-auto border-4 border-yellow-200"
              >
                {/* Emoji with bounce */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.3, 1] }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-6xl mb-4"
                >
                  {emoji}
                </motion.div>

                {/* Title */}
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-2xl font-bold text-yellow-900 mb-2"
                >
                  {title}
                </motion.h2>

                {/* Message */}
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-yellow-800 mb-6"
                >
                  {message}
                </motion.p>

                {/* Close button (optional) */}
                {!autoClose && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    onClick={onClose}
                    className="px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-full font-medium transition-colors"
                  >
                    Continue
                  </motion.button>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
