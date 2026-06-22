'use client';

import { useMetroStore } from '@/store/useMetroStore';

export default function Header() {
  const is3D = useMetroStore(s => s.is3D);
  const toggle3D = useMetroStore(s => s.toggle3D);

  return (
    <>
      {/* Logo top-left */}
      <div className="header-logo-minimal">
        <span className="logo-icon-sm">🚇</span>
        <span className="logo-title-sm">Hanoi Metro</span>
      </div>

      {/* Right side: only 3D toggle + North button */}
      <div className="map-controls-right">
        <button
          className={`map-control-btn ${is3D ? 'map-control-btn--active' : ''}`}
          onClick={toggle3D}
          title={is3D ? 'Chuyển sang 2D' : 'Chuyển sang 3D'}
        >
          <span className="control-icon">🧊</span>
          <span className="control-text">3D</span>
        </button>
      </div>
    </>
  );
}
