import { useCallback, useEffect, useMemo, useState } from 'react';
import ProfileCard from './ProfileCard.jsx';
import SwipeControls from './SwipeControls.jsx';

const SWIPE_DURATION_MS = 280;

export default function SwipeDeck({ profiles, onSwipe, disabled = false, onDeckEmpty }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const activeProfile = profiles[index];

  useEffect(() => {
    setIndex(0);
  }, [profiles]);

  const stack = useMemo(() => {
    const remaining = profiles.length - index;
    if (remaining <= 0) {
      return [];
    }

    return [profiles[index], profiles[index + 1], profiles[index + 2]].filter(Boolean);
  }, [profiles, index]);

  const handleAction = useCallback(
    async (side) => {
      if (!activeProfile || isAnimating || disabled) {
        return;
      }

      setDirection(side);
      setIsAnimating(true);

      try {
        await onSwipe(side, activeProfile);
      } finally {
        window.setTimeout(() => {
          setIsAnimating(false);
          setDirection(null);
          setIndex((prev) => {
            const nextIndex = prev + 1;
            if (nextIndex >= profiles.length && typeof onDeckEmpty === 'function') {
              onDeckEmpty();
            }
            return nextIndex;
          });
        }, SWIPE_DURATION_MS);
      }
    },
    [activeProfile, disabled, isAnimating, onSwipe, profiles.length, onDeckEmpty],
  );

  if (!stack.length) {
    return (
      <div className="swipe-deck-empty">
        <h2>No more profiles</h2>
        <p>Check back soon or refresh the deck.</p>
        <button type="button" className="swipe-deck-empty__refresh" onClick={() => window.location.reload()}>
          Reload deck
        </button>
      </div>
    );
  }

  return (
    <div className="swipe-deck">
      <div className={`swipe-deck__stack ${direction ? `is-swiping-${direction}` : ''}`} data-size={stack.length}>
        {stack
          .map((profile, idx) => {
            const variant = idx === 0 ? 'current' : 'next';
            return (
              <div
                key={profile.profile_id ?? `${profile.name}-${idx}`}
                className={`swipe-deck__card-wrapper swipe-deck__card-wrapper--${variant}`}
                style={{ zIndex: stack.length - idx }}
              >
                <ProfileCard profile={profile} variant={variant} />
              </div>
            );
          })
          .reverse()}
      </div>

      <SwipeControls
        onSwipeLeft={() => handleAction('left')}
        onSwipeRight={() => handleAction('right')}
        disabled={disabled || isAnimating || !activeProfile}
      />
    </div>
  );
}
