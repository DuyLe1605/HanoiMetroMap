'use client';

import dynamic from 'next/dynamic';
import Header from '@/components/ui/Header';
import BottomToolbar from '@/components/ui/BottomToolbar';
import FareCalculator from '@/components/ui/FareCalculator';
import RideOverlay from '@/components/ui/RideOverlay';
import InfoDialog from '@/components/ui/InfoDialog';

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
      <div className="scene-container">
        <MetroScene />
      </div>

      <Header />
      <FareCalculator />
      <RideOverlay />
      <BottomToolbar />
      <InfoDialog />
    </main>
  );
}
