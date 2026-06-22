'use client';

import { useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Station } from '@/data/stations';
import { gpsTo3D } from '@/utils/coordinates';
import { useMetroStore } from '@/store/useMetroStore';

const ELEV_SCALE = 0.6;
const FLAT_ELEV = 0.15;

interface StationMarkerProps {
  station: Station;
  lineColor: string;
}

export default function StationMarker({ station, lineColor }: StationMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const selectedLineId = useMetroStore(s => s.selectedLineId);
  const setHoveredStation = useMetroStore(s => s.setHoveredStation);
  const fromStationId = useMetroStore(s => s.fromStationId);
  const toStationId = useMetroStore(s => s.toStationId);
  const setFromStation = useMetroStore(s => s.setFromStation);
  const setToStation = useMetroStore(s => s.setToStation);
  const isRiding = useMetroStore(s => s.isRiding);
  const rideLineId = useMetroStore(s => s.rideLineId);
  const showStationNames = useMetroStore(s => s.showStationNames);
  const terrainFlat = useMetroStore(s => s.terrainFlat);

  const isSelectedLine = selectedLineId === null || selectedLineId === station.lineId;
  const isRidingThisLine = isRiding && rideLineId === station.lineId;
  const isRidingOther = isRiding && rideLineId !== station.lineId;
  const isFrom = fromStationId === station.id;
  const isTo = toStationId === station.id;
  const isConstruction = station.status === 'construction';

  const [x, , z] = gpsTo3D(station.lat, station.lng);
  const y = terrainFlat ? FLAT_ELEV : station.elevation * ELEV_SCALE;
  const position: [number, number, number] = [x, y, z];

  const markerColor = isFrom ? '#00ff88' : isTo ? '#ff4466' : isConstruction ? '#555b6e' : lineColor;

  // Scale: riding other line = tiny dots, normal = big markers
  const baseScale = isRidingOther ? 0.4 : 1;

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const targetScale = hovered ? baseScale * 1.4 : baseScale;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.12);
    }
    if (outerRef.current) {
      const mat = outerRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = hovered ? 0.5 + Math.sin(clock.elapsedTime * 4) * 0.3 : 0;
    }
  });

  const handleClick = useCallback(() => {
    if (isRiding) return;
    if (!fromStationId) {
      setFromStation(station.id);
    } else if (!toStationId) {
      if (station.id !== fromStationId) setToStation(station.id);
    } else {
      setFromStation(station.id);
    }
  }, [isRiding, fromStationId, toStationId, station.id, setFromStation, setToStation]);

  // Visibility
  const markerOpacity = isRidingOther ? 0.25 : isSelectedLine ? 1 : 0.1;
  const showLabel = showStationNames && !isRidingOther && isSelectedLine;
  const showTooltip = hovered && !isRiding && isSelectedLine;

  return (
    <group position={position}>
      {/* Big circle marker */}
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
        onClick={(e) => { e.stopPropagation(); handleClick(); }}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <circleGeometry args={[0.5, 24]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={hovered ? 0.5 : 0.2}
          transparent
          opacity={markerOpacity}
          roughness={0.3}
        />
      </mesh>

      {/* Colored ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.38, 0.55, 24]} />
        <meshStandardMaterial
          color={markerColor}
          emissive={markerColor}
          emissiveIntensity={hovered ? 1 : 0.5}
          transparent
          opacity={markerOpacity}
        />
      </mesh>

      {/* Hover ring */}
      <mesh ref={outerRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
        <ringGeometry args={[0.6, 0.85, 24]} />
        <meshStandardMaterial
          color={markerColor} emissive={markerColor} emissiveIntensity={1}
          transparent opacity={0} side={THREE.DoubleSide} depthWrite={false}
        />
      </mesh>

      {/* Elevation pole */}
      {y > 0.3 && (
        <mesh position={[0, -y / 2, 0]}>
          <cylinderGeometry args={[0.02, 0.03, y, 4]} />
          <meshStandardMaterial
            color={lineColor} transparent
            opacity={isRidingOther ? 0.15 : (isSelectedLine ? 0.5 : 0.15)}
          />
        </mesh>
      )}

      {/* From/To indicator */}
      {(isFrom || isTo) && !isRiding && (
        <mesh position={[0, 0.8, 0]}>
          <coneGeometry args={[0.25, 0.5, 4]} />
          <meshStandardMaterial
            color={isFrom ? '#00ff88' : '#ff4466'}
            emissive={isFrom ? '#00ff88' : '#ff4466'}
            emissiveIntensity={1.5}
          />
        </mesh>
      )}

      {/* Station name label */}
      {showLabel && (
        <Html
          position={[0, -0.3, -1.0]}
          center
          zIndexRange={[1, 0]}
          style={{ pointerEvents: 'none', userSelect: 'none', zIndex: 1 }}
          occlude={false}
        >
          <div className={`station-label ${hovered ? 'station-label--hovered' : ''} ${isConstruction ? 'station-label--construction' : ''}`}
               style={{ '--label-color': lineColor } as React.CSSProperties}>
            <span className="station-label-text">{station.name}</span>
          </div>
        </Html>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <Html
          position={[0, 2, 0]}
          center
          zIndexRange={[9999, 9990]}
          style={{ pointerEvents: 'none', zIndex: 9999 }}
        >
          <div className="station-tooltip">
            <div className="tooltip-header">
              <span className="station-code" style={{ backgroundColor: lineColor }}>{station.id}</span>
              <span className="station-name">{station.name}</span>
            </div>
            {isConstruction && <div className="tooltip-construction">🚧 Đang xây dựng</div>}
            <div className="tooltip-address">{station.address}</div>
            <div className="tooltip-desc">{station.description}</div>
            <div className="tooltip-meta">📍 Cao độ: {station.elevation}m</div>
            <div className="tooltip-hint">
              {!fromStationId ? '👆 Click chọn điểm đi' :
               !toStationId ? '👆 Click chọn điểm đến' : '👆 Click chọn lại'}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
