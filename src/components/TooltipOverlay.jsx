import React from 'react';

export default function TooltipOverlay({ label, position }) {
  if (!label || !position) return null;

  const style = {
    position: 'fixed',
    top: position.y + 10,
    left: position.x + 10,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    color: '#fff',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '0.75rem',
    pointerEvents: 'none',
    zIndex: 1000,
    whiteSpace: 'nowrap',
    transform: 'translate(-50%, -100%)'
  };

  return (
    <div style={style}>
      {label}
    </div>
  );
}