'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import MapGround from './MapGround';
import MetroLine3D from './MetroLine3D';
import StationMarker from './StationMarker';
import TrainModel from './TrainModel';
import CameraController from './CameraController';
import { metroLines } from '@/data/lines';
import { allStations } from '@/data/stations';
import { useMetroStore } from '@/store/useMetroStore';

export default function MetroScene() {
  const isRiding = useMetroStore(s => s.isRiding);

  return (
    <Canvas
      camera={{ position: [5, 50, 30], fov: 45, near: 0.1, far: 500 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.setClearColor('#060a14');
        gl.toneMapping = 2; // ACESFilmic
        gl.toneMappingExposure = 1.2;
      }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.3} color="#8892b8" />
      <directionalLight position={[20, 40, 10]} intensity={0.5} color="#c0d0ff" />
      <pointLight position={[0, 20, 0]} intensity={0.3} color="#4f8cff" />

      {/* Camera */}
      <CameraController />
      {!isRiding && (
        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          maxPolarAngle={Math.PI / 2.2}
          minDistance={5}
          maxDistance={80}
          zoomSpeed={0.8}
          panSpeed={0.5}
        />
      )}

      {/* Map */}
      <MapGround />

      {/* Metro Lines */}
      {metroLines.map(line => (
        <MetroLine3D
          key={line.id}
          lineId={line.id}
          color={line.color}
          colorGlow={line.colorGlow}
        />
      ))}

      {/* Station Markers */}
      {allStations.map(station => {
        const line = metroLines.find(l => l.id === station.lineId);
        return (
          <StationMarker
            key={station.id}
            station={station}
            lineColor={line?.color || '#ffffff'}
          />
        );
      })}

      {/* Train for test ride */}
      <TrainModel />

      {/* Fog for depth */}
      <fog attach="fog" args={['#060a14', 60, 120]} />
    </Canvas>
  );
}
