'use client';

import { useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Station } from '@/data/stations';
import { gpsTo3D } from '@/utils/coordinates';
import { useMetroStore } from '@/store/useMetroStore';

interface StationMarkerProps {
  station: Station;
  lineColor: string;
}

export default function StationMarker({ station, lineColor }: StationMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  const selectedLineId = useMetroStore(s => s.selectedLineId);
  const hoveredStationId = useMetroStore(s => s.hoveredStationId);
  const setHoveredStation = useMetroStore(s => s.setHoveredStation);
  const fromStationId = useMetroStore(s => s.fromStationId);
  const toStationId = useMetroStore(s => s.toStationId);
  const selectionMode = useMetroStore(s => s.selectionMode);
  const setFromStation = useMetroStore(s => s.setFromStation);
  const setToStation = useMetroStore(s => s.setToStation);
  const setSelectionMode = useMetroStore(s => s.setSelectionMode);
  const isRiding = useMetroStore(s => s.isRiding);

  const isVisible = selectedLineId === null || selectedLineId === station.lineId;
  const isFrom = fromStationId === station.id;
  const isTo = toStationId === station.id;
  const isHovered = hoveredStationId === station.id || hovered;
  const isConstruction = station.status === 'construction';

  const position = gpsTo3D(station.lat, station.lng, 0.5);

  const markerColor = isFrom ? '#00ff88' : isTo ? '#ff4466' : isConstruction ? '#555b6e' : lineColor;

  // Animate hover
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const targetScale = isHovered ? 1.6 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.elapsedTime * 1.5;
      const mat = ringRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = isHovered ? 0.6 + Math.sin(clock.elapsedTime * 4) * 0.3 : 0;
    }
  });

  const handleClick = useCallback(() => {
    if (isRiding) return;
    if (selectionMode === 'from' || (!fromStationId && !selectionMode)) {
      setFromStation(station.id);
    } else if (selectionMode === 'to' || (fromStationId && !toStationId)) {
      if (station.id !== fromStationId) {
        setToStation(station.id);
      }
    } else {
      // Reset and start new selection
      setFromStation(station.id);
    }
  }, [isRiding, selectionMode, fromStationId, toStationId, station.id, setFromStation, setToStation, setSelectionMode]);

  return (
    <group position={position}>
      {/* Station marker */}
      <mesh
        ref={meshRef}
        onPointerEnter={(e) => {
          e.stopPropagation();
          setHovered(true);
          setHoveredStation(station.id);
          document.body.style.cursor = 'pointer';
        }}
        onPointerLeave={() => {
          setHovered(false);
          setHoveredStation(null);
          document.body.style.cursor = 'default';
        }}
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        <sphereGeometry args={[0.35, 16, 16]} />
        <meshStandardMaterial
          color={markerColor}
          emissive={markerColor}
          emissiveIntensity={isHovered ? 1.2 : 0.5}
          transparent
          opacity={isVisible ? 1 : 0.1}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>

      {/* Pulse ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.7, 32]} />
        <meshStandardMaterial
          color={markerColor}
          emissive={markerColor}
          emissiveIntensity={1}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* From/To indicator */}
      {(isFrom || isTo) && (
        <mesh position={[0, 0.8, 0]}>
          <coneGeometry args={[0.2, 0.4, 4]} />
          <meshStandardMaterial
            color={isFrom ? '#00ff88' : '#ff4466'}
            emissive={isFrom ? '#00ff88' : '#ff4466'}
            emissiveIntensity={1}
          />
        </mesh>
      )}

      {/* Tooltip on hover */}
      {isHovered && !isRiding && isVisible && (
        <Html
          position={[0, 1.5, 0]}
          center
          zIndexRange={[100, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div className="station-tooltip">
            <div className="tooltip-header">
              <span className="station-code" style={{ backgroundColor: lineColor }}>{station.id}</span>
              <span className="station-name">{station.name}</span>
            </div>
            {isConstruction && (
              <div className="tooltip-construction">🚧 Đang xây dựng</div>
            )}
            <div className="tooltip-address">{station.address}</div>
            <div className="tooltip-desc">{station.description}</div>
            <div className="tooltip-hint">
              {!fromStationId ? 'Click để chọn điểm đi' :
               !toStationId ? 'Click để chọn điểm đến' :
               'Click để chọn lại'}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
