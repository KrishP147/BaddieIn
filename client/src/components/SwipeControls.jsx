export default function SwipeControls({ onSwipeLeft, onSwipeRight, disabled }) {
  return (
    <div className="swipe-controls">
      <button
        type="button"
        className="swipe-controls__button swipe-controls__button--nope"
        onClick={onSwipeLeft}
        disabled={disabled}
        aria-label="Pass"
      >
        Ⓧ
      </button>
      <button
        type="button"
        className="swipe-controls__button swipe-controls__button--refresh"
        onClick={() => window.location.reload()}
        aria-label="Refresh deck"
      >
        ↻
      </button>
      <button
        type="button"
        className="swipe-controls__button swipe-controls__button--like"
        onClick={onSwipeRight}
        disabled={disabled}
        aria-label="Interested"
      >
        ♥
      </button>
    </div>
  );
}
