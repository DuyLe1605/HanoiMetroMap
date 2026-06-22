'use client';

import { useMetroStore } from '@/store/useMetroStore';
import { metroLines } from '@/data/lines';

export default function LineSelector() {
  const selectedLineId = useMetroStore(s => s.selectedLineId);
  const setSelectedLine = useMetroStore(s => s.setSelectedLine);
  const startRide = useMetroStore(s => s.startRide);
  const isRiding = useMetroStore(s => s.isRiding);

  return (
    <div className="line-selector">
      <div className="line-selector-title">Chọn tuyến đường sắt</div>
      <div className="line-selector-cards">
        {metroLines.map(line => {
          const isActive = selectedLineId === line.id;
          return (
            <div
              key={line.id}
              className={`line-card ${isActive ? 'line-card--active' : ''}`}
              style={{
                '--line-color': line.color,
                '--line-glow': line.colorGlow,
              } as React.CSSProperties}
              onClick={() => !isRiding && setSelectedLine(line.id)}
            >
              <div className="line-card-header">
                <div className="line-badge" style={{ backgroundColor: line.color }}>
                  {line.nameShort}
                </div>
                <div className="line-info">
                  <div className="line-name">{line.name}</div>
                  <div className="line-meta">
                    {line.totalLength} · {line.stationIds.length} ga · {line.frequency}
                  </div>
                </div>
              </div>
              <div className="line-card-desc">{line.description}</div>
              <div className="line-card-footer">
                <span className="line-hours">🕐 {line.operatingHours}</span>
                <button
                  className="ride-btn"
                  style={{ backgroundColor: line.color }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isRiding) startRide(line.id);
                  }}
                  disabled={isRiding}
                >
                  🚆 Đi thử
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
