'use client';

import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { getStationsByLine } from '@/data/stations';
import { gpsTo3D } from '@/utils/coordinates';
import { useMetroStore } from '@/store/useMetroStore';

const ELEV_SCALE = 0.6;

// Add intermediate waypoints between stations for more realistic path length
function getDetailedPath(lineId: string): THREE.Vector3[] {
  const stations = getStationsByLine(lineId);
  const points: THREE.Vector3[] = [];

  for (let i = 0; i < stations.length; i++) {
    const s = stations[i];
    const [x, , z] = gpsTo3D(s.lat, s.lng);
    const y = s.elevation * ELEV_SCALE;
    points.push(new THREE.Vector3(x, y, z));

    // Add 2-3 intermediate points between stations for longer, more realistic paths
    if (i < stations.length - 1) {
      const ns = stations[i + 1];
      const [nx, , nz] = gpsTo3D(ns.lat, ns.lng);
      const ny = ns.elevation * ELEV_SCALE;

      // Create gentle curves between stations
      const steps = 3;
      for (let j = 1; j <= steps; j++) {
        const t = j / (steps + 1);
        const mx = x + (nx - x) * t;
        const mz = z + (nz - z) * t;
        // Slight elevation variation (realistic rail gentle slopes)
        const my = y + (ny - y) * t + Math.sin(t * Math.PI) * 0.3;
        // Add slight lateral curve for realistic path
        const perpX = -(nz - z);
        const perpZ = (nx - x);
        const len = Math.sqrt(perpX * perpX + perpZ * perpZ);
        const curveFactor = Math.sin(t * Math.PI) * (0.3 + Math.random() * 0.2) * (i % 2 === 0 ? 1 : -1);
        points.push(new THREE.Vector3(
          mx + (perpX / len) * curveFactor,
          my,
          mz + (perpZ / len) * curveFactor
        ));
      }
    }
  }

  return points;
}

interface MetroLine3DProps {
  lineId: string;
  color: string;
  colorGlow: string;
}

export default function MetroLine3D({ lineId, color, colorGlow }: MetroLine3DProps) {
  const glowRef = useRef<THREE.Mesh>(null);
  const selectedLineId = useMetroStore(s => s.selectedLineId);
  const isRiding = useMetroStore(s => s.isRiding);
  const rideLineId = useMetroStore(s => s.rideLineId);

  const isSelected = selectedLineId === lineId || selectedLineId === null;
  const isHighlighted = selectedLineId === lineId;
  const isRidingOther = isRiding && rideLineId !== lineId;

  const stations = useMemo(() => getStationsByLine(lineId), [lineId]);
  const detailedPoints = useMemo(() => getDetailedPath(lineId), [lineId]);

  const constructionStartIdx = useMemo(() => {
    const idx = stations.findIndex(s => s.status === 'construction');
    return idx === -1 ? stations.length : idx;
  }, [stations]);

  // Split into active and construction segments
  const { activeGeom, constructionGeom, glowGeom, pillarPositions } = useMemo(() => {
    // Active = all points up to construction start
    const stationPointCount = 4; // 1 station + 3 intermediates
    const activeEndIdx = constructionStartIdx * stationPointCount;
    const activePoints = detailedPoints.slice(0, Math.min(activeEndIdx, detailedPoints.length));
    const constructionPoints = detailedPoints.slice(Math.max(0, activeEndIdx - stationPointCount));

    const ac = activePoints.length >= 2
      ? new THREE.CatmullRomCurve3(activePoints, false, 'catmullrom', 0.3)
      : null;

    const cc = constructionPoints.length >= 2
      ? new THREE.CatmullRomCurve3(constructionPoints, false, 'catmullrom', 0.3)
      : null;

    // Thin tubes
    const ag = ac ? new THREE.TubeGeometry(ac, 200, 0.08, 6, false) : null;
    const cg = cc ? new THREE.TubeGeometry(cc, 80, 0.06, 6, false) : null;
    const gg = ac ? new THREE.TubeGeometry(ac, 200, 0.18, 6, false) : null;

    // Support pillars — every few points on the active curve
    const pillars: THREE.Vector3[] = [];
    if (ac) {
      for (let t = 0; t < 1; t += 0.04) {
        const pt = ac.getPointAt(t);
        if (pt.y > 0.3) { // Only where elevated
          pillars.push(pt.clone());
        }
      }
    }

    return { activeGeom: ag, constructionGeom: cg, glowGeom: gg, pillarPositions: pillars };
  }, [detailedPoints, constructionStartIdx]);

  useFrame(({ clock }) => {
    if (glowRef.current) {
      const mat = glowRef.current.material as THREE.MeshStandardMaterial;
      mat.opacity = isHighlighted
        ? 0.25 + Math.sin(clock.elapsedTime * 3) * 0.15
        : 0.06;
    }
  });

  // During ride, dim other lines but keep visible
  const lineOpacity = isRidingOther ? 0.15 : isSelected ? 1 : 0.12;

  return (
    <group>
      {/* Active segment */}
      {activeGeom && (
        <>
          <mesh geometry={activeGeom}>
            <meshStandardMaterial
              color={color}
              emissive={color}
              emissiveIntensity={isHighlighted ? 0.8 : 0.4}
              transparent
              opacity={lineOpacity}
              roughness={0.3}
              metalness={0.5}
            />
          </mesh>
          {glowGeom && (
            <mesh ref={glowRef} geometry={glowGeom}>
              <meshStandardMaterial
                color={colorGlow}
                emissive={colorGlow}
                emissiveIntensity={1}
                transparent
                opacity={0.06}
                side={THREE.BackSide}
                depthWrite={false}
              />
            </mesh>
          )}
        </>
      )}

      {/* Construction segment */}
      {constructionGeom && (
        <mesh geometry={constructionGeom}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.15}
            transparent
            opacity={isRidingOther ? 0.05 : (isSelected ? 0.25 : 0.06)}
            roughness={0.5}
          />
        </mesh>
      )}

      {/* Elevated track support pillars */}
      {!isRidingOther && pillarPositions.map((pos, i) => (
        <mesh key={i} position={[pos.x, pos.y / 2, pos.z]}>
          <cylinderGeometry args={[0.03, 0.04, pos.y, 4]} />
          <meshStandardMaterial
            color="#1a2030"
            transparent
            opacity={isSelected ? 0.5 : 0.15}
            roughness={0.8}
          />
        </mesh>
      ))}
    </group>
  );
}
