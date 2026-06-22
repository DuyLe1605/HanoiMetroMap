'use client';

import { Canvas } from '@react-three/fiber';
import MapGround from './MapGround';
import MetroLine3D from './MetroLine3D';
import StationMarker from './StationMarker';
import TrainModel from './TrainModel';
import CameraController, { MapOrbitControls } from './CameraController';
import { metroLines } from '@/data/lines';
import { allStations } from '@/data/stations';
import { useMetroStore } from '@/store/useMetroStore';

const getTheme = (style: 'voyager' | 'dark-matter' | 'satellite' | 'vector') => {
  switch (style) {
    case 'voyager':
      return {
        background: '#e8ecef',
        fogNear: 250,
        fogFar: 850,
        ambient: 0.65,
        directional: 0.75,
      };
    case 'satellite':
      return {
        background: '#04060a',
        fogNear: 300,
        fogFar: 900,
        ambient: 0.5,
        directional: 0.7,
      };
    case 'vector':
      return {
        background: '#0a0e17',
        fogNear: 250,
        fogFar: 800,
        ambient: 0.45,
        directional: 0.65,
      };
    case 'dark-matter':
    default:
      return {
        background: '#0b0f19',
        fogNear: 250,
        fogFar: 800,
        ambient: 0.4,
        directional: 0.6,
      };
  }
};

export default function MetroScene() {
  const mapStyle = useMetroStore(s => s.mapStyle);
  const theme = getTheme(mapStyle);

  return (
    <Canvas
      camera={{ position: [5, 45, 35], fov: 45, near: 0.1, far: 1500 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true, alpha: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = 2;
        gl.toneMappingExposure = 1.2;
      }}
    >
      <color attach="background" args={[theme.background]} />

      {/* Lighting — dynamic intensities based on map style */}
      <ambientLight intensity={theme.ambient} color={mapStyle === 'voyager' ? '#ffffff' : '#8892b8'} />
      <directionalLight position={[20, 50, 10]} intensity={theme.directional} color={mapStyle === 'voyager' ? '#ffffff' : '#c0d0ff'} />
      
      {/* Ground scatter light — disable or adjust for Voyager light theme */}
      {mapStyle !== 'voyager' && (
        <>
          <pointLight position={[0, 25, 0]} intensity={0.4} color="#4f8cff" />
          <pointLight position={[0, 0, -10]} intensity={0.15} color="#1a2545" distance={80} />
          <pointLight position={[-20, 0, 10]} intensity={0.15} color="#1a2545" distance={80} />
        </>
      )}
      {mapStyle === 'voyager' && (
        <pointLight position={[0, 30, 0]} intensity={0.3} color="#ffffff" />
      )}

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

      {/* Dynamic Fog — matches active map style theme */}
      <fog attach="fog" args={[theme.background, theme.fogNear, theme.fogFar]} />
    </Canvas>
  );
}
