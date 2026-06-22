'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { gpsTo3D } from '@/utils/coordinates';
import { redRiver, toLichRiver, westLake, hoanKiemLake, majorRoads } from '@/utils/coordinates';

function RiverMesh({ feature }: { feature: { coordinates: [number, number][]; style: { color: string; width: number; opacity: number } } }) {
  const points = useMemo(() => {
    return feature.coordinates.map(([lat, lng]) => {
      const [x, , z] = gpsTo3D(lat, lng);
      return new THREE.Vector3(x, 0.01, z);
    });
  }, [feature.coordinates]);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const tubeGeom = useMemo(() => new THREE.TubeGeometry(curve, 64, feature.style.width * 0.15, 8, false), [curve, feature.style.width]);

  return (
    <mesh geometry={tubeGeom}>
      <meshStandardMaterial
        color={feature.style.color}
        transparent
        opacity={feature.style.opacity}
        roughness={0.3}
      />
    </mesh>
  );
}

function LakeMesh({ feature }: { feature: { coordinates: [number, number][]; style: { color: string; opacity: number } } }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    feature.coordinates.forEach(([lat, lng], i) => {
      const [x, , z] = gpsTo3D(lat, lng);
      if (i === 0) s.moveTo(x, z);
      else s.lineTo(x, z);
    });
    s.closePath();
    return s;
  }, [feature.coordinates]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <shapeGeometry args={[shape]} />
      <meshStandardMaterial
        color={feature.style.color}
        transparent
        opacity={feature.style.opacity}
        roughness={0.2}
        metalness={0.3}
      />
    </mesh>
  );
}

function RoadLine({ feature }: { feature: { coordinates: [number, number][]; style: { color: string; width: number; opacity: number } } }) {
  const points = useMemo(() => {
    return feature.coordinates.map(([lat, lng]) => {
      const [x, , z] = gpsTo3D(lat, lng);
      return new THREE.Vector3(x, 0.005, z);
    });
  }, [feature.coordinates]);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const tubeGeom = useMemo(() => new THREE.TubeGeometry(curve, 32, feature.style.width * 0.08, 4, false), [curve, feature.style.width]);

  return (
    <mesh geometry={tubeGeom}>
      <meshStandardMaterial
        color={feature.style.color}
        transparent
        opacity={feature.style.opacity}
      />
    </mesh>
  );
}

// Grid lines for background
function GridLines() {
  const gridLines = useMemo(() => {
    const lines: THREE.Vector3[][] = [];
    for (let i = -80; i <= 80; i += 8) {
      lines.push([new THREE.Vector3(i, 0, -80), new THREE.Vector3(i, 0, 80)]);
      lines.push([new THREE.Vector3(-80, 0, i), new THREE.Vector3(80, 0, i)]);
    }
    return lines;
  }, []);

  return (
    <>
      {gridLines.map((pts, i) => (
        <line key={i}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array(pts.flatMap(p => [p.x, p.y, p.z])), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#0f1528" transparent opacity={0.3} />
        </line>
      ))}
    </>
  );
}

export default function MapGround() {
  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#080c18" roughness={1} />
      </mesh>

      {/* Grid */}
      <GridLines />

      {/* Rivers */}
      <RiverMesh feature={redRiver} />
      <RiverMesh feature={toLichRiver} />

      {/* Lakes */}
      <LakeMesh feature={westLake} />
      <LakeMesh feature={hoanKiemLake} />

      {/* Major Roads */}
      {majorRoads.map((road, i) => (
        <RoadLine key={i} feature={road} />
      ))}
    </group>
  );
}
