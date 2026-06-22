'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useMetroStore } from '@/store/useMetroStore';
import { getStationsByLine } from '@/data/stations';
import { gpsTo3D } from '@/utils/coordinates';

const ELEV_SCALE = 0.6;

// Same intermediate-point logic as MetroLine3D for matching path
function getDetailedPath(lineId: string): THREE.Vector3[] {
  const stations = getStationsByLine(lineId);
  const points: THREE.Vector3[] = [];

  for (let i = 0; i < stations.length; i++) {
    const s = stations[i];
    const [x, , z] = gpsTo3D(s.lat, s.lng);
    const y = s.elevation * ELEV_SCALE;
    points.push(new THREE.Vector3(x, y, z));

    if (i < stations.length - 1) {
      const ns = stations[i + 1];
      const [nx, , nz] = gpsTo3D(ns.lat, ns.lng);
      const ny = ns.elevation * ELEV_SCALE;

      const steps = 3;
      for (let j = 1; j <= steps; j++) {
        const t = j / (steps + 1);
        const mx = x + (nx - x) * t;
        const mz = z + (nz - z) * t;
        const my = y + (ny - y) * t + Math.sin(t * Math.PI) * 0.3;
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

export default function TrainModel() {
  const trainRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const isRiding = useMetroStore(s => s.isRiding);
  const rideLineId = useMetroStore(s => s.rideLineId);
  const rideProgress = useMetroStore(s => s.rideProgress);
  const rideSpeed = useMetroStore(s => s.rideSpeed);
  const ridePaused = useMetroStore(s => s.ridePaused);
  const setRideProgress = useMetroStore(s => s.setRideProgress);
  const stopRide = useMetroStore(s => s.stopRide);

  const trainColor = rideLineId === 'line-2a' ? '#00B14F' : '#E5441B';

  // Use same detailed path as MetroLine3D
  const curve = useMemo(() => {
    if (!rideLineId) return null;
    const points = getDetailedPath(rideLineId);
    return points.length >= 2
      ? new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.3)
      : null;
  }, [rideLineId]);

  useFrame((_, delta) => {
    if (!isRiding || !curve || !trainRef.current || ridePaused) return;

    const newProgress = rideProgress + delta * 0.015 * rideSpeed; // Slower for longer path

    if (newProgress >= 1) { stopRide(); return; }
    setRideProgress(newProgress);

    const point = curve.getPointAt(newProgress);
    const tangent = curve.getTangentAt(newProgress);
    trainRef.current.position.copy(point);

    const lookAt = point.clone().add(tangent);
    trainRef.current.lookAt(lookAt);

    if (lightRef.current) {
      lightRef.current.position.copy(point);
      lightRef.current.position.y += 2;
    }
  });

  if (!isRiding || !curve) return null;

  return (
    <>
      <group ref={trainRef}>
        {/* Car 1 */}
        <mesh>
          <boxGeometry args={[0.5, 0.35, 1.8]} />
          <meshStandardMaterial color={trainColor} emissive={trainColor} emissiveIntensity={0.6} metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.46, 0.06, 1.75]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.6} roughness={0.2} />
        </mesh>
        {[0.3, -0.3].map((xPos) => (
          <mesh key={xPos} position={[xPos, 0.05, 0]}>
            <boxGeometry args={[0.02, 0.16, 1.3]} />
            <meshStandardMaterial color="#80d8ff" emissive="#80d8ff" emissiveIntensity={0.8} transparent opacity={0.9} />
          </mesh>
        ))}
        {[0.15, -0.15].map((xPos) => (
          <mesh key={xPos} position={[xPos, 0, 0.92]}>
            <sphereGeometry args={[0.06, 8, 8]} />
            <meshStandardMaterial color="#ffffff" emissive="#ffffcc" emissiveIntensity={3} />
          </mesh>
        ))}
        <pointLight position={[0, 0.2, 1.3]} color="#ffffdd" intensity={5} distance={8} />

        {/* Car 2 */}
        <mesh position={[0, 0, -2.1]}>
          <boxGeometry args={[0.5, 0.35, 1.8]} />
          <meshStandardMaterial color={trainColor} emissive={trainColor} emissiveIntensity={0.4} metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0.22, -2.1]}>
          <boxGeometry args={[0.46, 0.06, 1.75]} />
          <meshStandardMaterial color="#c0c0c0" metalness={0.6} roughness={0.2} />
        </mesh>
      </group>
      <pointLight ref={lightRef} color={trainColor} intensity={4} distance={15} />
    </>
  );
}
