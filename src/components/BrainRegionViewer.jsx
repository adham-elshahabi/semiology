import React, { useState, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import RegionMesh from './RegionMesh';
import ControlsOverlay from './ControlsOverlay';
import TooltipOverlay from './TooltipOverlay';

export default function BrainRegionViewer() {
  const [selectedRegionName, setSelectedRegionName] = useState(null);
  const [hoveredRegionName, setHoveredRegionName] = useState(null);
  const [search, setSearch] = useState('');
  const [semiologyInput, setSemiologyInput] = useState('');
  const [semiologyKeywords, setSemiologyKeywords] = useState([]);
  const [regionsData, setRegionsData] = useState([]);
  const [keywordMap, setKeywordMap] = useState({});
  const [filteredKeywords, setFilteredKeywords] = useState([]);
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const [showSubcortical, setShowSubcortical] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [mousePos, setMousePos] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const cameraRef = useRef();
  const controlsRef = useRef();

  useEffect(() => {
    document.title = 'Semiology Atlas';
    Promise.all([
      fetch('data/regions_whole_brain.json').then(res => res.json()),
      fetch('data/semiology_keyword_map_clean.json').then(res => res.json())
    ]).then(([regions, map]) => {
      setRegionsData(regions);
      setKeywordMap(map);
      setFilteredKeywords(Object.keys(map).sort());
      setIsLoading(false);
    });
  }, []);

  const selectedRegion = regionsData.find(r => r.name === selectedRegionName);
  const hoveredRegion = regionsData.find(r => r.name === hoveredRegionName);

  const involvedRegionNames = new Set();
  semiologyKeywords.forEach(k => {
    if (keywordMap[k]) keywordMap[k].forEach(r => involvedRegionNames.add(r));
  });

  const filteredRegions = regionsData.filter(region => {
    const matchSearch = region.label.toLowerCase().includes(search.toLowerCase());
    const matchKeyword = semiologyKeywords.length === 0 || involvedRegionNames.has(region.name);
    return matchSearch && matchKeyword;
  });

  const filteredKeywordOptions = filteredKeywords.filter(k =>
    k.toLowerCase().includes(semiologyInput.toLowerCase()) && !semiologyKeywords.includes(k)
  );

  const toggleLeft = () => setShowLeft(prev => !prev);
  const toggleRight = () => setShowRight(prev => !prev);
  const toggleSubcortical = () => setShowSubcortical(prev => !prev);
  const toggleTheme = () => setDarkMode(prev => !prev);

  const backgroundColor = darkMode ? '#111' : '#f8f8f8';
  const textColor = darkMode ? '#f0f0f0' : '#111';
  const panelBg = darkMode ? '#222' : '#eee';
  const borderColor = darkMode ? '#555' : '#ccc';

  const handleKeywordClick = (k) => {
    if (!semiologyKeywords.includes(k)) {
      setSemiologyKeywords([...semiologyKeywords, k]);
    }
    setSemiologyInput('');
    setSelectedRegionName(null);
  };

  const removeKeyword = (k) => {
    setSemiologyKeywords(semiologyKeywords.filter(x => x !== k));
  };

  const clearKeywords = () => {
    setSemiologyKeywords([]);
  };

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

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <div style={{ flex: 1.2, position: 'relative', display: 'flex', flexDirection: 'column' }}>
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
              setSemiologyKeywords([]);
            }}
          />
          <div style={{ flex: 1 }}>
            {isLoading ? (
              <div style={{ color: textColor, textAlign: 'center', marginTop: '2rem' }}>Loading...</div>
            ) : (
              <Canvas
                style={{ width: '100%', height: '100%' }}
                camera={{ position: [0, 0, 300], fov: 45 }}
                onCreated={({ camera }) => (cameraRef.current = camera)}
              >
                <ambientLight intensity={2.0} />
                <directionalLight position={[0, 100, 100]} intensity={1.8} />
                <directionalLight position={[-100, -100, 0]} intensity={1.5} />
                <pointLight position={[0, 0, 300]} intensity={2.0} />
                <Environment preset="sunset" />
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

                  const isSelected = selectedRegionName === region.name;
                  const isHighlighted = involvedRegionNames.has(region.name);
                  const opacity =
                    semiologyKeywords.length > 0
                      ? isHighlighted ? 1.0 : 0.1
                      : selectedRegionName === null ? 1.0 : isSelected ? 1.0 : 0.1;

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
                      highlight={isHighlighted}
                      opacity={opacity}
                    />
                  );
                })}
              </Canvas>
            )}
            <TooltipOverlay label={hoveredRegion?.label} position={mousePos} />
          </div>

          <div style={{ backgroundColor: panelBg, padding: '1rem', height: '150px', overflowY: 'auto' }}>
            <h3 style={{ color: textColor, marginTop: 0 }}>Semiology Keywords</h3>
            <input
              type="text"
              placeholder="Search keywords..."
              value={semiologyInput}
              onChange={(e) => setSemiologyInput(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: `1px solid ${borderColor}`, borderRadius: '0.5rem', backgroundColor, color: textColor }}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
              {filteredKeywordOptions.map((k, i) => (
                <div
                  key={i}
                  onClick={() => handleKeywordClick(k)}
                  style={{ cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', backgroundColor: '#333', color: '#fff' }}
                >
                  {k}
                </div>
              ))}
            </div>
          </div>
        </div>

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
            <button onClick={() => setSemiologyKeywords([])} style={{ marginBottom: '1rem', padding: '0.3rem 0.6rem', fontSize: '0.85rem', backgroundColor: '#888', color: '#fff', border: 'none', borderRadius: '0.5rem' }}>Show All</button>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {filteredRegions.map((region, index) => (
                <li
                  key={index}
                  onClick={() => setSelectedRegionName(region.name)}
                  style={{
                    cursor: 'pointer',
                    padding: '0.5rem',
                    borderRadius: '0.5rem',
                    marginBottom: '0.25rem',
                    backgroundColor: selectedRegionName === region.name ? '#5555aa' : involvedRegionNames.has(region.name) ? '#333' : 'transparent',
                    borderLeft: involvedRegionNames.has(region.name) ? '4px solid #7abaff' : '4px solid transparent'
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
            {semiologyKeywords.length > 0 && (
              <div style={{ marginBottom: '1rem', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {semiologyKeywords.map((k, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#444', borderRadius: '0.5rem', color: '#fff', fontSize: '0.85rem', padding: '0.2rem 0.5rem' }}>
                    <span>{k}</span>
                    <span onClick={() => removeKeyword(k)} style={{ cursor: 'pointer', marginLeft: '0.5rem' }}>✕</span>
                  </div>
                ))}
                <button onClick={clearKeywords} style={{ padding: '0.3rem 0.6rem', fontSize: '0.85rem', backgroundColor: '#888', color: '#fff', border: 'none', borderRadius: '0.5rem' }}>Clear</button>
              </div>
            )}
            {semiologyKeywords.length === 0 && selectedRegion ? (
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>{selectedRegion.label}</h3>
                <p><strong>Function:</strong> {selectedRegion.function || '—'}</p>
                <p><strong>Semiology:</strong> {selectedRegion.semiology || '—'}</p>
              </div>
            ) : semiologyKeywords.length === 0 ? (
              <p style={{ color: '#888' }}>Select a region to see details or choose keywords to filter.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
