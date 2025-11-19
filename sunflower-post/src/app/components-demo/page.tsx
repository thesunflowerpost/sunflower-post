'use client';

import { useState } from 'react';
import {
  BouncyButton,
  ShimmerIcon,
  LoadingState,
  Sunburst,
  Confetti,
  CelebrationModal,
} from '@/components/ui';

export default function ComponentsDemoPage() {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const triggerCelebration = () => {
    setShowConfetti(true);
    setShowModal(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold text-yellow-900">
          🌻 Sunflower Post Components Demo
        </h1>
        <p className="text-sm text-yellow-800">
          Interactive showcase of all the new dopamine-driven components
        </p>
      </div>

      {/* Bouncy Buttons */}
      <section className="bg-white border border-yellow-200 rounded-3xl p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-yellow-900 mb-2">
            Bouncy Buttons
          </h2>
          <p className="text-sm text-yellow-800 mb-4">
            Buttons that bounce 3% when pressed with spring physics
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <BouncyButton variant="primary" size="lg">
            Primary Large
          </BouncyButton>
          <BouncyButton variant="secondary" size="md">
            Secondary Medium
          </BouncyButton>
          <BouncyButton variant="ghost" size="sm">
            Ghost Small
          </BouncyButton>
          <BouncyButton variant="pill">Pill Variant</BouncyButton>
          <BouncyButton disabled>Disabled</BouncyButton>
        </div>
      </section>

      {/* Shimmer Icons */}
      <section className="bg-white border border-yellow-200 rounded-3xl p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-yellow-900 mb-2">
            Shimmer Icons
          </h2>
          <p className="text-sm text-yellow-800 mb-4">
            Icons that shimmer with light when clicked
          </p>
        </div>
        <div className="flex gap-8 text-4xl">
          <ShimmerIcon>🌻</ShimmerIcon>
          <ShimmerIcon>✨</ShimmerIcon>
          <ShimmerIcon>💛</ShimmerIcon>
          <ShimmerIcon>🔥</ShimmerIcon>
          <ShimmerIcon>❤️</ShimmerIcon>
        </div>
      </section>

      {/* Sunburst Reactions */}
      <section className="bg-white border border-yellow-200 rounded-3xl p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-yellow-900 mb-2">
            Sunburst Reactions
          </h2>
          <p className="text-sm text-yellow-800 mb-4">
            Animated reaction buttons with particle burst effects
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <Sunburst type="sunburst" showLabel />
          <Sunburst type="fire" showLabel />
          <Sunburst type="heart" showLabel />
          <Sunburst type="unity" showLabel />
          <Sunburst type="vibe" showLabel />
        </div>
        <div className="pt-4">
          <p className="text-xs text-yellow-800 mb-3">With custom labels:</p>
          <div className="flex flex-wrap gap-4">
            <Sunburst type="sunburst" showLabel customLabel="Send warmth" />
            <Sunburst type="heart" showLabel customLabel="Gentle support" />
            <Sunburst type="unity" showLabel customLabel="Here with you" />
          </div>
        </div>
      </section>

      {/* Loading States */}
      <section className="bg-white border border-yellow-200 rounded-3xl p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-yellow-900 mb-2">
            Loading States
          </h2>
          <p className="text-sm text-yellow-800 mb-4">
            Themed loading animations with delightful phrases
          </p>
        </div>
        <BouncyButton onClick={simulateLoading} className="mb-4">
          Simulate Loading
        </BouncyButton>
        {isLoading && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-600 mb-2">General:</p>
              <LoadingState context="general" size="sm" />
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-600 mb-2">Lounge:</p>
              <LoadingState context="lounge" size="sm" />
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-600 mb-2">Book Club:</p>
              <LoadingState context="book-club" size="sm" />
            </div>
            <div className="bg-gray-50 rounded-2xl p-4">
              <p className="text-xs text-gray-600 mb-2">Music Room:</p>
              <LoadingState context="music-room" size="sm" />
            </div>
          </div>
        )}
      </section>

      {/* Celebrations */}
      <section className="bg-white border border-yellow-200 rounded-3xl p-8 space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-yellow-900 mb-2">
            Celebrations & Confetti
          </h2>
          <p className="text-sm text-yellow-800 mb-4">
            Milestone celebrations with confetti and animated modals
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <BouncyButton onClick={triggerCelebration}>
            🎉 Trigger Celebration
          </BouncyButton>
          <BouncyButton
            onClick={() => {
              setShowConfetti(true);
              setTimeout(() => setShowConfetti(false), 2000);
            }}
          >
            ✨ Just Confetti
          </BouncyButton>
        </div>
      </section>

      {/* Implementation Guide */}
      <section className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-300 rounded-3xl p-8 space-y-4">
        <h2 className="text-xl font-semibold text-yellow-900">
          How to Use These Components
        </h2>
        <div className="space-y-3 text-sm text-yellow-900">
          <div className="bg-white/60 rounded-xl p-4">
            <code className="text-xs">
              import {'{'} BouncyButton, Sunburst, ... {'}'} from '@/components/ui';
            </code>
          </div>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              <strong>BouncyButton:</strong> Replace all buttons for instant dopamine hits
            </li>
            <li>
              <strong>ShimmerIcon:</strong> Wrap emojis/icons for tap feedback
            </li>
            <li>
              <strong>Sunburst:</strong> Use for reactions and likes with particle effects
            </li>
            <li>
              <strong>LoadingState:</strong> Show during async operations with themed phrases
            </li>
            <li>
              <strong>CelebrationModal:</strong> Trigger on milestones and achievements
            </li>
          </ul>
        </div>
      </section>

      {/* Confetti and Modal */}
      <Confetti trigger={showConfetti} type="celebration" />
      <CelebrationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="You unlocked something special!"
        message="This is what celebrations feel like in Sunflower Post 🌻"
        emoji="🎉"
        type="celebration"
      />
    </div>
  );
}
