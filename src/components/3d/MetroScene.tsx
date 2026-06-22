'use client';

import { Canvas } from '@react-three/fiber';
import MapGround from './MapGround';
import MetroLine3D from './MetroLine3D';
import StationMarker from './StationMarker';
import TrainModel from './TrainModel';
import CameraController, { MapOrbitControls } from './CameraController';
import { metroLines } from '@/data/lines';
import { allStations } from '@/data/stations';

export default function MetroScene() {
  return (
    <Canvas
      camera={{ position: [5, 45, 35], fov: 45, near: 0.1, far: 500 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.setClearColor('#070b15');
        gl.toneMapping = 2;
        gl.toneMappingExposure = 1.2;
      }}
    >
      {/* Lighting — slightly brighter to see terrain */}
      <ambientLight intensity={0.4} color="#8892b8" />
      <directionalLight position={[20, 40, 10]} intensity={0.6} color="#c0d0ff" />
      <pointLight position={[0, 25, 0]} intensity={0.4} color="#4f8cff" />
      {/* Ground scatter light */}
      <pointLight position={[0, 0, -10]} intensity={0.15} color="#1a2545" distance={80} />
      <pointLight position={[-20, 0, 10]} intensity={0.15} color="#1a2545" distance={80} />

      <MapOrbitControls />
      <CameraController />

      <MapGround />

      {metroLines.map(line => (
        <MetroLine3D
          key={line.id}
          lineId={line.id}
          color={line.color}
          colorGlow={line.colorGlow}
        />
      ))}

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

      <TrainModel />

      {/* Fog — longer distance for elevated view */}
      <fog attach="fog" args={['#070b15', 70, 180]} />
    </Canvas>
  );
}
