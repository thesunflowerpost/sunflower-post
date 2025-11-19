'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface LoadingStateProps {
  context?:
    | 'general'
    | 'lounge'
    | 'hope-bank'
    | 'book-club'
    | 'music-room'
    | 'journal'
    | 'posting'
    | 'saving';
  size?: 'sm' | 'md' | 'lg';
}

const loadingPhrases = {
  general: [
    'Gathering sunshine…',
    'Opening the sunflower…',
    'Warming up the space…',
    'Sprinkling some light…',
  ],
  lounge: [
    'Setting up the cushions…',
    'Brewing the tea…',
    'Fluffing the pillows…',
    'Warming the lounge…',
  ],
  'hope-bank': [
    'Collecting stories of light…',
    'Gathering hope…',
    'Finding the sunshine…',
    'Opening the vault of warmth…',
  ],
  'book-club': [
    'Turning the pages…',
    'Finding your bookmark…',
    'Opening the book…',
    'Settling into the story…',
  ],
  'music-room': [
    'Tuning the vibes…',
    'Cueing the playlist…',
    'Finding the rhythm…',
    'Adjusting the frequencies…',
  ],
  journal: [
    'Opening your journal…',
    'Preparing the pages…',
    'Finding a quiet moment…',
    'Settling into reflection…',
  ],
  posting: [
    'Planting your words…',
    'Sharing your light…',
    'Sending warmth…',
    'Making space for you…',
  ],
  saving: [
    'Tucking this away…',
    'Saving to your shelf…',
    'Bookmarking this moment…',
    'Keeping this close…',
  ],
};

export function LoadingState({ context = 'general', size = 'md' }: LoadingStateProps) {
  const [phrase, setPhrase] = useState('');

  useEffect(() => {
    const phrases = loadingPhrases[context];
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    setPhrase(randomPhrase);
  }, [context]);

  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const dotSizes = {
    sm: 'h-1.5 w-1.5',
    md: 'h-2 w-2',
    lg: 'h-2.5 w-2.5',
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      {/* Animated dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={`${dotSizes[size]} rounded-full bg-yellow-400`}
            animate={{
              y: ['0%', '-50%', '0%'],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Loading phrase */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${sizeStyles[size]} text-yellow-900/70 font-medium`}
      >
        {phrase}
      </motion.p>
    </div>
  );
}
