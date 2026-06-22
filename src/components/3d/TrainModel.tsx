'use client';

import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useMetroStore } from '@/store/useMetroStore';
import { getStationsByLine } from '@/data/stations';
import { gpsTo3D } from '@/utils/coordinates';

export default function TrainModel() {
  const trainRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const isRiding = useMetroStore(s => s.isRiding);
  const rideLineId = useMetroStore(s => s.rideLineId);
  const rideProgress = useMetroStore(s => s.rideProgress);
  const rideSpeed = useMetroStore(s => s.rideSpeed);
  const setRideProgress = useMetroStore(s => s.setRideProgress);
  const stopRide = useMetroStore(s => s.stopRide);

  const trainColor = rideLineId === 'line-2a' ? '#00B14F' : '#E5441B';

  // Build curve for current ride line
  const curve = useMemo(() => {
    if (!rideLineId) return null;
    const stations = getStationsByLine(rideLineId);
    const points = stations.map(s => {
      const [x, , z] = gpsTo3D(s.lat, s.lng);
      return new THREE.Vector3(x, 0.5, z);
    });
    return points.length >= 2
      ? new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5)
      : null;
  }, [rideLineId]);

  // Animate train along curve
  useFrame((_, delta) => {
    if (!isRiding || !curve || !trainRef.current) return;

    const newProgress = rideProgress + delta * 0.03 * rideSpeed;

    if (newProgress >= 1) {
      stopRide();
      return;
    }

    setRideProgress(newProgress);

    const point = curve.getPointAt(newProgress);
    const tangent = curve.getTangentAt(newProgress);

    trainRef.current.position.copy(point);
    trainRef.current.position.y = 0.8;

    // Orient train along curve
    const lookAt = point.clone().add(tangent);
    lookAt.y = 0.8;
    trainRef.current.lookAt(lookAt);

    if (lightRef.current) {
      lightRef.current.position.copy(point);
      lightRef.current.position.y = 1.5;
    }
  });

  if (!isRiding) return null;

  return (
    <>
      <group ref={trainRef}>
        {/* Train body */}
        <mesh>
          <boxGeometry args={[0.5, 0.35, 1.4]} />
          <meshStandardMaterial
            color={trainColor}
            emissive={trainColor}
            emissiveIntensity={0.6}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
        {/* Roof */}
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.46, 0.08, 1.35]} />
          <meshStandardMaterial color="#e0e0e0" metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Windows */}
        <mesh position={[0.26, 0.05, 0]}>
          <boxGeometry args={[0.02, 0.15, 1.1]} />
          <meshStandardMaterial
            color="#80d0ff"
            emissive="#80d0ff"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
        <mesh position={[-0.26, 0.05, 0]}>
          <boxGeometry args={[0.02, 0.15, 1.1]} />
          <meshStandardMaterial
            color="#80d0ff"
            emissive="#80d0ff"
            emissiveIntensity={0.5}
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* Headlights */}
        <mesh position={[0.15, 0, 0.72]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffaa"
            emissiveIntensity={2}
          />
        </mesh>
        <mesh position={[-0.15, 0, 0.72]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffaa"
            emissiveIntensity={2}
          />
        </mesh>
      </group>
      {/* Point light following train */}
      <pointLight ref={lightRef} color={trainColor} intensity={3} distance={10} />
    </>
  );
}
