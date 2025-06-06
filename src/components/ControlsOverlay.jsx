import React from 'react';
import { btnStyle } from '../styles/buttonStyle';

export default function ControlsOverlay({
  cameraRef,
  toggleLeft,
  toggleRight,
  toggleSubcortical,
  toggleTheme,
  resetView
}) {
  const zoom = (factor) => {
    if (!cameraRef.current) return;
    cameraRef.current.zoom *= factor;
    cameraRef.current.updateProjectionMatrix();
  };

  const reset = () => {
    if (!cameraRef.current) return;

    // Reset camera
    cameraRef.current.position.set(0, 0, 300);
    cameraRef.current.zoom = 1;
    cameraRef.current.updateProjectionMatrix();

    // Notify parent to reset mesh opacities
    resetView();
  };

  return (
    <div style={{
      position: 'absolute',
      top: 10,
      left: 10,
      zIndex: 10,
      backgroundColor: '#00000099',
      padding: '0.5rem',
      borderRadius: '0.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
      maxHeight: '90vh',
      overflowY: 'auto'
    }}>
      <button onClick={() => zoom(1.2)} style={btnStyle}>＋ Zoom In</button>
      <button onClick={() => zoom(0.8)} style={btnStyle}>－ Zoom Out</button>
      <button onClick={reset} style={btnStyle}>⟳ Reset View</button>
      <button onClick={toggleRight} style={btnStyle}>Toggle Rt. Hemisphere</button>
      <button onClick={toggleLeft} style={btnStyle}>Toggle Lt. Hemisphere</button>
      <button onClick={toggleSubcortical} style={btnStyle}>Toggle Subcortical</button>
      <button onClick={toggleTheme} style={btnStyle}>Toggle Theme</button>
    </div>
  );
}