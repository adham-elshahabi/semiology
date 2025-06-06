import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import RegionMesh from './RegionMesh';
import ControlsOverlay from './ControlsOverlay';
import TooltipOverlay from './TooltipOverlay';

export default function BrainRegionViewer() {
  const [selectedRegionName, setSelectedRegionName] = useState(null);
  const [hoveredRegionName, setHoveredRegionName] = useState(null);
  const [search, setSearch] = useState('');
  const [regionsData, setRegionsData] = useState([]);
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const [showSubcortical, setShowSubcortical] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [mousePos, setMousePos] = useState(null);

  const cameraRef = useRef();
  const controlsRef = useRef();

  useEffect(() => {
    document.title = 'Semiology Atlas';
    fetch('data/regions_whole_brain.json')
      .then(res => res.json())
      .then(setRegionsData);
  }, []);

  const selectedRegion = regionsData.find(r => r.name === selectedRegionName);
  const hoveredRegion = regionsData.find(r => r.name === hoveredRegionName);

  const filteredRegions = regionsData.filter(region =>
    region.label.toLowerCase().includes(search.toLowerCase())
  );

  const toggleLeft = () => setShowLeft(prev => !prev);
  const toggleRight = () => setShowRight(prev => !prev);
  const toggleSubcortical = () => setShowSubcortical(prev => !prev);
  const toggleTheme = () => setDarkMode(prev => !prev);

  const backgroundColor = darkMode ? '#111' : '#f8f8f8';
  const textColor = darkMode ? '#f0f0f0' : '#111';
  const panelBg = darkMode ? '#222' : '#eee';
  const borderColor = darkMode ? '#555' : '#ccc';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        backgroundColor
      }}
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      <div style={{
        padding: '0.5rem 1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: textColor
      }}>
        <h1 style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Semiology Atlas</h1>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', flex: 1, overflow: 'hidden' }}>
        {/* 3D Viewer */}
        <div style={{ flex: 1.2, position: 'relative' }}>
          <ControlsOverlay
            cameraRef={cameraRef}
            toggleLeft={toggleLeft}
            toggleRight={toggleRight}
            toggleSubcortical={toggleSubcortical}
            toggleTheme={toggleTheme}
            resetView={() => {
              setResetTrigger(prev => prev + 1);
              setSelectedRegionName(null);
              setHoveredRegionName(null);
            }}
          />
          <Canvas
            style={{ width: '100%', height: '100%' }}
            camera={{ position: [0, 0, 300], fov: 45 }}
            onCreated={({ camera }) => (cameraRef.current = camera)}
          >
            <ambientLight intensity={2.0} />
            <directionalLight position={[0, 100, 100]} intensity={1.8} />
            <pointLight position={[50, 50, 100]} intensity={1.0} />
            <OrbitControls ref={controlsRef} />
            {regionsData.map((region) => {
              const isLH = region.name.startsWith('lh_');
              const isRH = region.name.startsWith('rh_');
              const isSubcortical = region.name.startsWith('Left_') || region.name.startsWith('Right_');
              const isCortical = isLH || isRH;
              const isVisible =
                (isLH && showLeft) ||
                (isRH && showRight) ||
                (isSubcortical && showSubcortical) ||
                (!isCortical && !isSubcortical);

              const isSelected =
                selectedRegionName === null
                  ? null
                  : selectedRegionName === region.name;

              return (
                <RegionMesh
                  key={region.name}
                  region={region}
                  isSelected={isSelected}
                  isHovered={hoveredRegionName === region.name}
                  onHover={setHoveredRegionName}
                  onClick={setSelectedRegionName}
                  visible={isVisible}
                  resetTrigger={resetTrigger}
                />
              );
            })}
          </Canvas>
          <TooltipOverlay label={hoveredRegion?.label} position={mousePos} />
        </div>

        {/* Right Panel */}
        <div style={{ flex: 0.8, display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ backgroundColor: panelBg, borderRadius: '1rem', padding: '1rem', margin: '1rem', overflowY: 'auto', flex: '1 1 50%', color: textColor }}>
            <h2 style={{ marginTop: 0 }}>Regions</h2>
            <input
              type="text"
              placeholder="Search region..."
              style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', border: `1px solid ${borderColor}`, borderRadius: '0.5rem', backgroundColor, color: textColor }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {filteredRegions.map((region, index) => (
                <li
                  key={index}
                  onClick={() => setSelectedRegionName(region.name)}
                  style={{
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    backgroundColor: selectedRegionName === region.name ? '#5555aa' : 'transparent',
                    marginBottom: '0.25rem',
                  }}
                  onMouseEnter={() => setHoveredRegionName(region.name)}
                  onMouseLeave={() => setHoveredRegionName(null)}
                >
                  {region.label}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ backgroundColor: panelBg, borderRadius: '1rem', padding: '1.5rem', margin: '1rem', overflowY: 'auto', flex: '1 1 50%', color: textColor }}>
            <h2 style={{ marginTop: 0 }}>Semiology</h2>
            {selectedRegion ? (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>{selectedRegion.label}</h3>
                <p><strong>Function:</strong> {selectedRegion.function || '—'}</p>
                <p><strong>Semiology:</strong> {selectedRegion.semiology || '—'}</p>
                {Array.isArray(selectedRegion.references) && selectedRegion.references.length > 0 && (
                  <div>
                    <p><strong>References:</strong></p>
                    <ul style={{ paddingLeft: '1rem', color: '#7abaff' }}>
                      {selectedRegion.references.map((ref, i) => (
                        <li key={i}>{ref}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {Array.isArray(selectedRegion.videos) && selectedRegion.videos.length > 0 && (
                  <div style={{ marginTop: '1rem' }}>
                    <p><strong>Videos:</strong></p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      {selectedRegion.videos.map((video, i) => (
                        <iframe
                          key={i}
                          style={{ width: '100%', aspectRatio: '16/9', borderRadius: '0.5rem' }}
                          src={video.replace('watch?v=', 'embed/')}
                          title={`Video ${i + 1}`}
                          allowFullScreen
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p style={{ color: '#888' }}>Select a region to see details.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}