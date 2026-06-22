'use client';

import { useMetroStore } from '@/store/useMetroStore';

export default function Header() {
  const selectedLineId = useMetroStore(s => s.selectedLineId);
  const setSelectedLine = useMetroStore(s => s.setSelectedLine);
  const isRiding = useMetroStore(s => s.isRiding);

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="header-logo">
          <span className="logo-icon">🚇</span>
          <div className="logo-text">
            <h1>Hanoi Metro Map</h1>
            <p>Bản đồ đường sắt đô thị Hà Nội</p>
          </div>
        </div>
      </div>

      <div className="header-right">
        <div className="header-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#00B14F' }} />
            <span>Tuyến 2A</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: '#E5441B' }} />
            <span>Tuyến 3</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot legend-dot--construction" />
            <span>Đang xây dựng</span>
          </div>
        </div>

        {selectedLineId && !isRiding && (
          <button className="reset-btn" onClick={() => setSelectedLine(null)}>
            Xem toàn cảnh
          </button>
        )}
      </div>
    </header>
  );
}
