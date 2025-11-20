'use client';

import { useState, useEffect } from 'react';
import type { ReactionId } from '@/config/reactions';
import { getReactionsForRoom } from '@/config/reactions';
import { Sunburst } from './Sunburst';

export interface ReactionBarProps {
  roomId: string;
  postId: string | number;
  // Optional: if you want to control the state externally
  reactions?: Record<ReactionId, boolean>;
  onReactionToggle?: (reactionId: ReactionId, active: boolean) => void;
  // Display options
  showLabels?: boolean;
  showCounts?: boolean;
  // Optional: override allowed reactions for this specific bar
  allowedReactions?: ReactionId[];
}

/**
 * ReactionBar - Dopamine-safe reaction system
 *
 * Key principles:
 * - Reactions are for care, not counts
 * - Only the user sees what they've sent
 * - Emojis are primary; labels are optional
 * - Subtle, warm animations (no loud gamification)
 * - Room-specific reaction sets
 *
 * Usage:
 * <ReactionBar roomId="lounge" postId={post.id} />
 * <ReactionBar roomId="musicRoom" postId={post.id} />
 */
export function ReactionBar({
  roomId,
  postId,
  reactions: externalReactions,
  onReactionToggle,
  showLabels = false,
  showCounts = false,
  allowedReactions,
}: ReactionBarProps) {
  // Internal state if not controlled externally
  const [internalReactions, setInternalReactions] = useState<
    Record<ReactionId, boolean>
  >({} as Record<ReactionId, boolean>);

  // Get allowed reactions for this room
  const roomReactionDefs = allowedReactions
    ? allowedReactions.map((id) => ({ id }))
    : getReactionsForRoom(roomId);

  const reactionIds = roomReactionDefs.map((def) => def.id || (def as any));

  // Use external state if provided, otherwise use internal
  const activeReactions = externalReactions || internalReactions;

  const handleToggle = (reactionId: ReactionId, active: boolean) => {
    if (onReactionToggle) {
      onReactionToggle(reactionId, active);
    } else {
      // Update internal state
      setInternalReactions((prev) => ({
        ...prev,
        [reactionId]: active,
      }));
    }
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap gap-1.5">
        {reactionIds.map((reactionId) => (
          <Sunburst
            key={reactionId}
            reactionId={reactionId}
            isActive={activeReactions[reactionId] || false}
            onToggle={(active) => handleToggle(reactionId, active)}
            showLabel={showLabels}
            showCount={showCounts}
          />
        ))}
      </div>
      <p className="text-[8px] text-[#C0A987] italic">
        Reactions are for care, not counts. Only you see what you&apos;ve sent.
      </p>
    </div>
  );
}
