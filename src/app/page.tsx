'use client';

import dynamic from 'next/dynamic';
import Header from '@/components/ui/Header';
import LineSelector from '@/components/ui/LineSelector';
import FareCalculator from '@/components/ui/FareCalculator';
import RideOverlay from '@/components/ui/RideOverlay';

// Dynamic import MetroScene to avoid SSR issues with Three.js
const MetroScene = dynamic(() => import('@/components/3d/MetroScene'), {
  ssr: false,
  loading: () => (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-spinner" />
        <h2>Đang tải bản đồ Metro...</h2>
        <p>Hanoi Metro 3D Map</p>
      </div>
    </div>
  ),
});

export default function HomePage() {
  return (
    <main className="app-container">
      <Header />

      <div className="scene-container">
        <MetroScene />
      </div>

      <FareCalculator />
      <RideOverlay />
      <LineSelector />
    </main>
  );
}
