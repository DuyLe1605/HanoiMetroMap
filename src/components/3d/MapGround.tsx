'use client';

import { useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { gpsTo3D } from '@/utils/coordinates';
import { redRiver, toLichRiver, westLake, hoanKiemLake, majorRoads } from '@/utils/coordinates';
import { useMetroStore } from '@/store/useMetroStore';
import { Html } from '@react-three/drei';

// District area data — polygons with realistic colors (not just black)
const districts = [
  { name: 'Đống Đa', color: '#1a2233', coords: [[21.035,105.82],[21.035,105.845],[21.015,105.845],[21.005,105.82],[21.015,105.805],[21.035,105.82]] },
  { name: 'Ba Đình', color: '#1c2436', coords: [[21.055,105.81],[21.055,105.84],[21.035,105.845],[21.035,105.82],[21.04,105.81],[21.055,105.81]] },
  { name: 'Cầu Giấy', color: '#182030', coords: [[21.045,105.78],[21.045,105.81],[21.035,105.82],[21.015,105.805],[21.02,105.78],[21.045,105.78]] },
  { name: 'Thanh Xuân', color: '#161e2e', coords: [[21.015,105.805],[21.005,105.82],[20.985,105.82],[20.98,105.80],[20.99,105.79],[21.015,105.805]] },
  { name: 'Hà Đông', color: '#141c2a', coords: [[20.985,105.795],[20.98,105.80],[20.955,105.79],[20.94,105.75],[20.95,105.745],[20.985,105.76],[20.985,105.795]] },
  { name: 'Nam Từ Liêm', color: '#182030', coords: [[21.04,105.76],[21.04,105.78],[21.02,105.78],[20.99,105.79],[20.985,105.76],[21.02,105.74],[21.04,105.76]] },
  { name: 'Bắc Từ Liêm', color: '#161e2e', coords: [[21.065,105.72],[21.065,105.78],[21.04,105.78],[21.04,105.76],[21.02,105.74],[21.04,105.72],[21.065,105.72]] },
  { name: 'Hoàn Kiếm', color: '#1e2840', coords: [[21.035,105.845],[21.035,105.86],[21.02,105.86],[21.015,105.845],[21.035,105.845]] },
  { name: 'Tây Hồ', color: '#1a2436', coords: [[21.08,105.81],[21.08,105.85],[21.055,105.84],[21.055,105.81],[21.08,105.81]] },
  { name: 'Long Biên', color: '#152030', coords: [[21.06,105.86],[21.06,105.90],[21.04,105.90],[21.035,105.86],[21.055,105.84],[21.06,105.86]] },
];

// Slippy map tile helpers for inverse Mercator projections
function tile2lng(x: number, z: number): number {
  return (x / Math.pow(2, z)) * 360 - 180;
}

function tile2lat(y: number, z: number): number {
  const n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z);
  return (180 / Math.PI) * Math.atan(Math.sinh(n));
}

// Denser street grid for realistic city texture
const streetGrid: [number, number][][] = [
  // Horizontal streets
  [[21.06, 105.72], [21.06, 105.90]],
  [[21.055, 105.72], [21.055, 105.90]],
  [[21.05, 105.72], [21.05, 105.90]],
  [[21.045, 105.72], [21.045, 105.90]],
  [[21.04, 105.72], [21.04, 105.90]],
  [[21.035, 105.72], [21.035, 105.90]],
  [[21.03, 105.72], [21.03, 105.90]],
  [[21.025, 105.74], [21.025, 105.88]],
  [[21.02, 105.72], [21.02, 105.90]],
  [[21.015, 105.74], [21.015, 105.88]],
  [[21.01, 105.74], [21.01, 105.88]],
  [[21.005, 105.76], [21.005, 105.86]],
  [[21.00, 105.76], [21.00, 105.86]],
  [[20.995, 105.76], [20.995, 105.85]],
  [[20.99, 105.76], [20.99, 105.85]],
  [[20.985, 105.76], [20.985, 105.84]],
  [[20.98, 105.76], [20.98, 105.84]],
  [[20.975, 105.74], [20.975, 105.82]],
  [[20.97, 105.74], [20.97, 105.82]],
  [[20.965, 105.74], [20.965, 105.80]],
  [[20.96, 105.74], [20.96, 105.80]],
  [[20.955, 105.74], [20.955, 105.78]],
  [[20.95, 105.74], [20.95, 105.78]],
  // Vertical streets
  [[20.93, 105.74], [21.08, 105.74]],
  [[20.93, 105.75], [21.08, 105.75]],
  [[20.93, 105.76], [21.08, 105.76]],
  [[20.94, 105.77], [21.08, 105.77]],
  [[20.94, 105.78], [21.08, 105.78]],
  [[20.96, 105.79], [21.08, 105.79]],
  [[20.96, 105.80], [21.08, 105.80]],
  [[20.98, 105.81], [21.08, 105.81]],
  [[20.98, 105.82], [21.08, 105.82]],
  [[21.00, 105.83], [21.08, 105.83]],
  [[21.00, 105.84], [21.08, 105.84]],
  [[21.01, 105.85], [21.08, 105.85]],
  [[21.01, 105.86], [21.08, 105.86]],
  [[21.02, 105.87], [21.06, 105.87]],
  [[21.02, 105.88], [21.06, 105.88]],
];

function DistrictFill({ name, color, coords, showMesh = true }: { name: string; color: string; coords: [number, number][]; showMesh?: boolean }) {
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
      {showMesh && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
          <shapeGeometry args={[shape]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      )}
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
            <lineBasicMaterial color="#222d42" transparent opacity={0.35} />
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

const TILE_TEMPLATES = {
  voyager: 'https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
  'dark-matter': 'https://basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
  satellite: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
};

const textureLoader = new THREE.TextureLoader();

interface TileProps {
  x: number;
  y: number;
  zoom: number;
  mapStyle: 'voyager' | 'dark-matter' | 'satellite';
  width: number;
  height: number;
  centerX: number;
  centerZ: number;
}

function Tile({ x, y, zoom, mapStyle, width, height, centerX, centerZ }: TileProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    let isMounted = true;
    setTexture(null);
    setOpacity(0);

    const url = TILE_TEMPLATES[mapStyle]
      .replace(/{z}/g, zoom.toString())
      .replace(/{x}/g, x.toString())
      .replace(/{y}/g, y.toString());

    textureLoader.load(
      url,
      (tex) => {
        if (isMounted) {
          tex.colorSpace = THREE.SRGBColorSpace;
          setTexture(tex);
          
          // Animate opacity fade-in for smooth transition
          let op = 0;
          const interval = setInterval(() => {
            op += 0.08;
            if (op >= 0.95) {
              setOpacity(0.95);
              clearInterval(interval);
            } else {
              setOpacity(op);
            }
          }, 20);
          return () => clearInterval(interval);
        }
      },
      undefined,
      (err) => {
        console.warn('Failed to load map tile:', url, err);
      }
    );

    return () => {
      isMounted = false;
      if (texture) texture.dispose();
    };
  }, [x, y, zoom, mapStyle]);

  if (!texture) return null;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[centerX, -0.06, centerZ]}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent opacity={opacity} depthWrite={true} />
    </mesh>
  );
}

function TileMap({ mapStyle }: { mapStyle: 'voyager' | 'dark-matter' | 'satellite' }) {
  const zoom = 12;
  const xStart = 3249;
  const xEnd = 3254;
  const yStart = 1801;
  const yEnd = 1804;

  const tiles = useMemo(() => {
    const list = [];
    for (let x = xStart; x <= xEnd; x++) {
      for (let y = yStart; y <= yEnd; y++) {
        // Compute geographic corners
        const latTop = tile2lat(y, zoom);
        const lngLeft = tile2lng(x, zoom);
        const latBottom = tile2lat(y + 1, zoom);
        const lngRight = tile2lng(x + 1, zoom);

        // Convert corners to 3D units using the exact same gpsTo3D projection
        const [p1x, , p1z] = gpsTo3D(latTop, lngLeft);
        const [p2x, , p2z] = gpsTo3D(latBottom, lngRight);

        const width = p2x - p1x;
        const height = p2z - p1z;
        const centerX = (p1x + p2x) / 2;
        const centerZ = (p1z + p2z) / 2;

        list.push({
          x,
          y,
          width,
          height,
          centerX,
          centerZ,
        });
      }
    }
    return list;
  }, []);

  return (
    <group>
      {tiles.map((tile) => (
        <Tile
          key={`${tile.x}-${tile.y}`}
          x={tile.x}
          y={tile.y}
          zoom={zoom}
          mapStyle={mapStyle}
          width={tile.width}
          height={tile.height}
          centerX={tile.centerX}
          centerZ={tile.centerZ}
        />
      ))}
    </group>
  );
}

export default function MapGround() {
  const mapStyle = useMetroStore((s) => s.mapStyle);
  const baseColor = mapStyle === 'voyager' ? '#e8ecef' : '#0b0f19';

  return (
    <group>
      {/* Base ground — matching active theme style */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.2, 0]}>
        <planeGeometry args={[2500, 2500]} />
        <meshStandardMaterial color={baseColor} roughness={1} />
      </mesh>

      {/* Render detailed tile maps for Voyager, Dark Matter, or Satellite styles */}
      {mapStyle !== 'vector' && <TileMap mapStyle={mapStyle} />}

      {/* Always show district names and vector highlights for satellite/vector to provide context */}
      {(mapStyle === 'vector' || mapStyle === 'satellite') && (
        <>
          {districts.map((d) => (
            <DistrictFill
              key={d.name}
              name={d.name}
              color={d.color}
              coords={d.coords as [number, number][]}
              showMesh={false}
            />
          ))}
        </>
      )}

      {/* Show rivers, lakes, roads only in standard vector mode */}
      {mapStyle === 'vector' && (
        <>
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
