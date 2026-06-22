'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { gpsTo3D } from '@/utils/coordinates';
import { redRiver, toLichRiver, westLake, hoanKiemLake, majorRoads } from '@/utils/coordinates';
import { useMetroStore } from '@/store/useMetroStore';
import { Html } from '@react-three/drei';

// District area data — polygons for visual terrain blocks
const districts = [
  { name: 'Đống Đa', color: '#0d1520', coords: [[21.035,105.82],[21.035,105.845],[21.015,105.845],[21.005,105.82],[21.015,105.805],[21.035,105.82]] },
  { name: 'Ba Đình', color: '#0e1722', coords: [[21.055,105.81],[21.055,105.84],[21.035,105.845],[21.035,105.82],[21.04,105.81],[21.055,105.81]] },
  { name: 'Cầu Giấy', color: '#0c1420', coords: [[21.045,105.78],[21.045,105.81],[21.035,105.82],[21.015,105.805],[21.02,105.78],[21.045,105.78]] },
  { name: 'Thanh Xuân', color: '#0b131e', coords: [[21.015,105.805],[21.005,105.82],[20.985,105.82],[20.98,105.80],[20.99,105.79],[21.015,105.805]] },
  { name: 'Hà Đông', color: '#0a121c', coords: [[20.985,105.795],[20.98,105.80],[20.955,105.79],[20.94,105.75],[20.95,105.745],[20.985,105.76],[20.985,105.795]] },
  { name: 'Nam Từ Liêm', color: '#0c1520', coords: [[21.04,105.76],[21.04,105.78],[21.02,105.78],[20.99,105.79],[20.985,105.76],[21.02,105.74],[21.04,105.76]] },
  { name: 'Bắc Từ Liêm', color: '#0b1420', coords: [[21.065,105.72],[21.065,105.78],[21.04,105.78],[21.04,105.76],[21.02,105.74],[21.04,105.72],[21.065,105.72]] },
  { name: 'Hoàn Kiếm', color: '#0f1825', coords: [[21.035,105.845],[21.035,105.86],[21.02,105.86],[21.015,105.845],[21.035,105.845]] },
  { name: 'Tây Hồ', color: '#0d1622', coords: [[21.08,105.81],[21.08,105.85],[21.055,105.84],[21.055,105.81],[21.08,105.81]] },
  { name: 'Long Biên', color: '#0a1320', coords: [[21.06,105.86],[21.06,105.90],[21.04,105.90],[21.035,105.86],[21.055,105.84],[21.06,105.86]] },
];

// Street grid for visual texture
const streetGrid: [number, number][][] = [
  // Horizontal streets
  [[21.06, 105.72], [21.06, 105.90]],
  [[21.05, 105.72], [21.05, 105.90]],
  [[21.04, 105.72], [21.04, 105.90]],
  [[21.03, 105.72], [21.03, 105.90]],
  [[21.02, 105.72], [21.02, 105.90]],
  [[21.01, 105.74], [21.01, 105.88]],
  [[21.00, 105.76], [21.00, 105.86]],
  [[20.99, 105.76], [20.99, 105.85]],
  [[20.98, 105.76], [20.98, 105.84]],
  [[20.97, 105.74], [20.97, 105.82]],
  [[20.96, 105.74], [20.96, 105.80]],
  [[20.95, 105.74], [20.95, 105.78]],
  // Vertical streets
  [[20.93, 105.74], [21.08, 105.74]],
  [[20.93, 105.76], [21.08, 105.76]],
  [[20.94, 105.78], [21.08, 105.78]],
  [[20.96, 105.80], [21.08, 105.80]],
  [[20.98, 105.82], [21.08, 105.82]],
  [[21.00, 105.84], [21.08, 105.84]],
  [[21.01, 105.86], [21.08, 105.86]],
  [[21.02, 105.88], [21.06, 105.88]],
];

function DistrictFill({ name, color, coords }: { name: string; color: string; coords: [number, number][] }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    coords.forEach(([lat, lng], i) => {
      const [x, , z] = gpsTo3D(lat, lng);
      if (i === 0) s.moveTo(x, z);
      else s.lineTo(x, z);
    });
    s.closePath();
    return s;
  }, [coords]);

  const center = useMemo(() => {
    let cx = 0, cz = 0;
    coords.forEach(([lat, lng]) => {
      const [x, , z] = gpsTo3D(lat, lng);
      cx += x; cz += z;
    });
    return [cx / coords.length, cz / coords.length] as [number, number];
  }, [coords]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color={color} roughness={1} />
      </mesh>
      {/* District name label */}
      <Html position={[center[0], 0.1, center[1]]} center style={{ pointerEvents: 'none' }}>
        <div className="map-label map-label--district">{name}</div>
      </Html>
    </group>
  );
}

function StreetLines() {
  return (
    <group>
      {streetGrid.map((pts, i) => {
        const p1 = gpsTo3D(pts[0][0], pts[0][1]);
        const p2 = gpsTo3D(pts[1][0], pts[1][1]);
        const positions = new Float32Array([p1[0], 0.005, p1[2], p2[0], 0.005, p2[2]]);
        return (
          <line key={i}>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <lineBasicMaterial color="#141c2a" transparent opacity={0.4} />
          </line>
        );
      })}
    </group>
  );
}

function RiverMesh({ feature }: { feature: { name: string; coordinates: [number, number][]; style: { color: string; width: number; opacity: number } } }) {
  const points = useMemo(() =>
    feature.coordinates.map(([lat, lng]) => {
      const [x, , z] = gpsTo3D(lat, lng);
      return new THREE.Vector3(x, 0.02, z);
    }), [feature.coordinates]);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const tubeGeom = useMemo(() => new THREE.TubeGeometry(curve, 64, feature.style.width * 0.15, 8, false), [curve, feature.style.width]);

  const midPt = points[Math.floor(points.length / 2)];

  return (
    <group>
      <mesh geometry={tubeGeom}>
        <meshStandardMaterial color={feature.style.color} transparent opacity={feature.style.opacity} roughness={0.3} />
      </mesh>
      <Html position={[midPt.x, 0.5, midPt.z]} center style={{ pointerEvents: 'none' }}>
        <div className="map-label map-label--water">{feature.name}</div>
      </Html>
    </group>
  );
}

function LakeMesh({ feature }: { feature: { name: string; coordinates: [number, number][]; style: { color: string; opacity: number } } }) {
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

  const center = useMemo(() => {
    let cx = 0, cz = 0;
    feature.coordinates.forEach(([lat, lng]) => {
      const [x, , z] = gpsTo3D(lat, lng);
      cx += x; cz += z;
    });
    return new THREE.Vector3(cx / feature.coordinates.length, 0.5, cz / feature.coordinates.length);
  }, [feature.coordinates]);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <shapeGeometry args={[shape]} />
        <meshStandardMaterial color={feature.style.color} transparent opacity={feature.style.opacity} roughness={0.2} metalness={0.3} />
      </mesh>
      <Html position={[center.x, center.y, center.z]} center style={{ pointerEvents: 'none' }}>
        <div className="map-label map-label--water">{feature.name}</div>
      </Html>
    </group>
  );
}

function RoadLine({ feature }: { feature: { coordinates: [number, number][]; style: { color: string; width: number; opacity: number } } }) {
  const points = useMemo(() =>
    feature.coordinates.map(([lat, lng]) => {
      const [x, , z] = gpsTo3D(lat, lng);
      return new THREE.Vector3(x, 0.01, z);
    }), [feature.coordinates]);

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);
  const tubeGeom = useMemo(() => new THREE.TubeGeometry(curve, 32, feature.style.width * 0.08, 4, false), [curve, feature.style.width]);

  return (
    <mesh geometry={tubeGeom}>
      <meshStandardMaterial color={feature.style.color} transparent opacity={feature.style.opacity} />
    </mesh>
  );
}

export default function MapGround() {
  const showMapFeatures = useMetroStore(s => s.showMapFeatures);

  return (
    <group>
      {/* Base ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
        <planeGeometry args={[250, 250]} />
        <meshStandardMaterial color="#070b15" roughness={1} />
      </mesh>

      {showMapFeatures && (
        <>
          {/* District fill areas — creates visible terrain blocks */}
          {districts.map(d => (
            <DistrictFill key={d.name} name={d.name} color={d.color} coords={d.coords as [number, number][]} />
          ))}

          {/* Street grid for visual texture */}
          <StreetLines />

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
        </>
      )}
    </group>
  );
}
