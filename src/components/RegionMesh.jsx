import React, { useEffect, useRef } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export default function RegionMesh({
  region,
  isSelected,
  isHovered,
  onHover,
  onClick,
  visible,
  resetTrigger,
  opacity = 1.0  // <- NEW
}) {
  const { scene } = useGLTF(`data/${region.name}.glb`);
  const meshRef = useRef();

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.visible = visible;
        child.material = child.material.clone();
        child.material.transparent = true;

        // Final opacity logic:
        // Hover always shows full opacity
        child.material.opacity = isHovered ? 1.0 : opacity;

        // Color logic
        child.material.color.set(isHovered ? '#ffff66' : '#cccccc');
        child.userData.regionName = region.name;
      }
    });
  }, [scene, isSelected, isHovered, visible, resetTrigger, opacity]);

  useEffect(() => {
    if (resetTrigger !== null) {
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.opacity = 1.0;
          child.material.transparent = true;
          child.material.needsUpdate = true;
        }
      });
    }
  }, [resetTrigger]);

  if (!visible) return null;

  return (
    <primitive
      object={scene}
      ref={meshRef}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(region.name);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        onHover(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(region.name);
      }}
    />
  );
}
