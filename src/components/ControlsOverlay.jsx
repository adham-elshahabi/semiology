import React from 'react';
import {
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Eye,
  EyeOff,
  Brain,
  Sun,
  Moon,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

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
    const newZoom = cameraRef.current.zoom * factor;
    if (newZoom < 0.2 || newZoom > 5) return;  // limit zoom range
    cameraRef.current.zoom = newZoom;
    cameraRef.current.updateProjectionMatrix();
    cameraRef.current.updateProjectionMatrix();
  };

  const reset = () => {
    if (!cameraRef.current) return;
    cameraRef.current.position.set(0, 0, 300);
    cameraRef.current.zoom = 1;
    cameraRef.current.updateProjectionMatrix();
    resetView();
  };

  const isMobile = window.innerWidth <= 768;
  const baseButtonStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#444',
    color: '#fff',
    border: 'none',
    borderRadius: '0.5rem',
    padding: isMobile ? '0.5rem' : '0.5rem 0.75rem',
    width: isMobile ? '2.5rem' : 'auto',
    height: isMobile ? '2.5rem' : 'auto',
    cursor: 'pointer'
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
      <button title="Zoom In" onClick={() => zoom(1.2)} style={baseButtonStyle}><ZoomIn size={20} /></button>
      <button title="Zoom Out" onClick={() => zoom(0.8)} style={baseButtonStyle}><ZoomOut size={20} /></button>
      <button title="Reset View" onClick={reset} style={baseButtonStyle}><RefreshCw size={20} /></button>
      <button title="Toggle Right Hemisphere" onClick={toggleRight} style={baseButtonStyle}><ArrowRight size={20} /></button>
      <button title="Toggle Left Hemisphere" onClick={toggleLeft} style={baseButtonStyle}><ArrowLeft size={20} /></button>
      <button title="Toggle Subcortical" onClick={toggleSubcortical} style={baseButtonStyle}><Brain size={20} /></button>
      <button title="Toggle Theme" onClick={toggleTheme} style={baseButtonStyle}>{isMobile ? <Moon size={20} /> : <Sun size={20} />}</button>
    </div>
  );
}