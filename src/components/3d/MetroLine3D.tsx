'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getStationsByLine } from '@/data/stations';
import { gpsTo3D } from '@/utils/coordinates';
import { useMetroStore } from '@/store/useMetroStore';

interface MetroLine3DProps {
  lineId: string;
  color: string;
  colorGlow: string;
}

export default function MetroLine3D({ lineId, color, colorGlow }: MetroLine3DProps) {
  const tubeRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const selectedLineId = useMetroStore(s => s.selectedLineId);
  const isRiding = useMetroStore(s => s.isRiding);

  const isSelected = selectedLineId === lineId || selectedLineId === null;
  const isHighlighted = selectedLineId === lineId;

  const stations = useMemo(() => getStationsByLine(lineId), [lineId]);

  // Find the index where construction stations begin
  const constructionStartIdx = useMemo(() => {
    const idx = stations.findIndex(s => s.status === 'construction');
    return idx === -1 ? stations.length : idx;
  }, [stations]);

  // Create curves for active and construction segments
  const { activeCurve, constructionCurve, activeGeom, constructionGeom, glowGeom } = useMemo(() => {
    const activeStations = stations.slice(0, constructionStartIdx);
    const constructionStations = stations.slice(Math.max(0, constructionStartIdx - 1)); // overlap 1 station

    const activePoints = activeStations.map(s => {
      const [x, , z] = gpsTo3D(s.lat, s.lng);
      return new THREE.Vector3(x, 0.5, z);
    });

    const constructionPoints = constructionStations.map(s => {
      const [x, , z] = gpsTo3D(s.lat, s.lng);
      return new THREE.Vector3(x, 0.5, z);
    });

    const ac = activePoints.length >= 2
      ? new THREE.CatmullRomCurve3(activePoints, false, 'catmullrom', 0.5)
      : null;

    const cc = constructionPoints.length >= 2
      ? new THREE.CatmullRomCurve3(constructionPoints, false, 'catmullrom', 0.5)
      : null;

    const ag = ac ? new THREE.TubeGeometry(ac, 100, 0.25, 8, false) : null;
    const cg = cc ? new THREE.TubeGeometry(cc, 60, 0.18, 8, false) : null;
    const gg = ac ? new THREE.TubeGeometry(ac, 100, 0.45, 8, false) : null;

    return {
      activeCurve: ac,
      constructionCurve: cc,
      activeGeom: ag,
      constructionGeom: cg,
      glowGeom: gg,
    };
  }, [stations, constructionStartIdx]);

  // Full curve for test ride (all stations)
  const fullCurve = useMemo(() => {
    const allPoints = stations.map(s => {
      const [x, , z] = gpsTo3D(s.lat, s.lng);
      return new THREE.Vector3(x, 0.5, z);
    });
    return allPoints.length >= 2
      ? new THREE.CatmullRomCurve3(allPoints, false, 'catmullrom', 0.5)
      : null;
  }, [stations]);

  // Animate glow pulse
  useFrame(({ clock }) => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      const pulse = isHighlighted
        ? 0.25 + Math.sin(clock.elapsedTime * 3) * 0.15
        : 0.08;
      mat.opacity = pulse;
    }
  });

  // Store fullCurve on the group for TrainModel to access
  const groupRef = useRef<THREE.Group>(null);
  useMemo(() => {
    if (groupRef.current && fullCurve) {
      (groupRef.current as unknown as { curve: THREE.CatmullRomCurve3 }).curve = fullCurve;
    }
  }, [fullCurve]);

  return (
    <group ref={groupRef} userData={{ lineId, curve: fullCurve }}>
      {/* Active segment */}
      {activeGeom && (
        <>
          <mesh ref={tubeRef} geometry={activeGeom}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isHighlighted ? 0.8 : 0.3}
              transparent
              opacity={isSelected ? 1 : 0.15}
              roughness={0.3}
              metalness={0.5}
            />
          </mesh>
          {/* Glow tube */}
          {glowGeom && (
            <mesh ref={glowRef} geometry={glowGeom}>
              <meshStandardMaterial
                color={colorGlow}
                emissive={colorGlow}
                emissiveIntensity={1}
                transparent
                opacity={0.1}
                side={THREE.BackSide}
                depthWrite={false}
              />
            </mesh>
          )}
        </>
      )}

      {/* Construction segment (dashed style) */}
      {constructionGeom && (
        <mesh geometry={constructionGeom}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.15}
            transparent
            opacity={isSelected ? 0.35 : 0.08}
            roughness={0.5}
          />
        </mesh>
      )}
    </group>
  );
}

// Export fullCurve accessor for TrainModel
export function useLineCurve(lineId: string): THREE.CatmullRomCurve3 | null {
  const stations = getStationsByLine(lineId);
  return useMemo(() => {
    const points = stations.map(s => {
      const [x, , z] = gpsTo3D(s.lat, s.lng);
      return new THREE.Vector3(x, 0.5, z);
    });
    return points.length >= 2
      ? new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5)
      : null;
  }, [stations]);
}
