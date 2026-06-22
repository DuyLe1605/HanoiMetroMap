'use client';

import { useMemo } from 'react';
import { useMetroStore } from '@/store/useMetroStore';
import { metroLines } from '@/data/lines';
import { getStationsByLine } from '@/data/stations';
import { gpsDistance } from '@/utils/coordinates';

export default function RideOverlay() {
  const isRiding = useMetroStore(s => s.isRiding);
  const rideLineId = useMetroStore(s => s.rideLineId);
  const rideProgress = useMetroStore(s => s.rideProgress);
  const rideSpeed = useMetroStore(s => s.rideSpeed);
  const ridePaused = useMetroStore(s => s.ridePaused);
  const rideCameraMode = useMetroStore(s => s.rideCameraMode);
  const ridePanelHidden = useMetroStore(s => s.ridePanelHidden);
  const stopRide = useMetroStore(s => s.stopRide);
  const setRideSpeed = useMetroStore(s => s.setRideSpeed);
  const toggleRidePause = useMetroStore(s => s.toggleRidePause);
  const toggleRideCameraMode = useMetroStore(s => s.toggleRideCameraMode);
  const toggleRidePanelHidden = useMetroStore(s => s.toggleRidePanelHidden);

  const line = useMemo(() => metroLines.find(l => l.id === rideLineId), [rideLineId]);
  const stations = useMemo(() => rideLineId ? getStationsByLine(rideLineId) : [], [rideLineId]);

  // Calculate distances between stations
  const stationDistances = useMemo(() => {
    const dists: number[] = [0];
    let total = 0;
    for (let i = 1; i < stations.length; i++) {
      const d = gpsDistance(stations[i - 1].lat, stations[i - 1].lng, stations[i].lat, stations[i].lng);
      total += d;
      dists.push(total);
    }
    return { cumulative: dists, total };
  }, [stations]);

  // Current station and next station
  const currentInfo = useMemo(() => {
    if (!stations.length) return { currentIdx: 0, nextIdx: 1, distToNext: 0, elevation: 0 };
    const progressDist = rideProgress * stationDistances.total;
    let currentIdx = 0;
    for (let i = 0; i < stationDistances.cumulative.length - 1; i++) {
      if (progressDist >= stationDistances.cumulative[i]) currentIdx = i;
    }
    const nextIdx = Math.min(currentIdx + 1, stations.length - 1);
    const distToNext = (stationDistances.cumulative[nextIdx] - progressDist) * 1000; // meters
    const elevation = stations[currentIdx]?.elevation || 0;
    return { currentIdx, nextIdx, distToNext: Math.max(0, distToNext), elevation };
  }, [rideProgress, stations, stationDistances]);

  if (!isRiding || !line) return null;

  const speeds = [1, 2, 4, 10];

  return (
    <>
      {/* Compact Floating bottom dock */}
      <div className="ride-dock">
        {/* Left: Play/Pause and speed display */}
        <div className="ride-dock-left">
          <button
            className="ride-dock-btn"
            onClick={toggleRidePause}
            title={ridePaused ? 'Tiếp tục' : 'Tạm dừng'}
            style={{ borderColor: line.color, color: line.color, backgroundColor: `${line.color}15` }}
          >
            {ridePaused ? '▶' : '⏸'}
          </button>
          
          <button
            className="ride-dock-btn"
            onClick={() => {
              const nextSpeed = speeds[(speeds.indexOf(rideSpeed) + 1) % speeds.length];
              setRideSpeed(nextSpeed);
            }}
            title="Tốc độ đi thử"
            style={{ fontSize: '0.7rem', fontWeight: 800 }}
          >
            {rideSpeed}×
          </button>
        </div>

        {/* Middle: Progress bar and next station status */}
        <div className="ride-dock-middle">
          <div className="ride-dock-status">
            <span className="ride-dock-next">
              Ga tiếp theo: <span style={{ color: line.color }}>{stations[currentInfo.nextIdx]?.name || '—'}</span>
            </span>
            <span className="ride-dock-meta">
              {currentInfo.distToNext > 0 ? `${Math.round(currentInfo.distToNext)}m` : 'Đang tới'} • ↕ {currentInfo.elevation}m • {Math.round(rideProgress * 100)}%
            </span>
          </div>
          <div className="ride-progress-bar">
            <div
              className="ride-progress-fill"
              style={{
                width: `${rideProgress * 100}%`,
                backgroundColor: line.color,
              }}
            />
          </div>
        </div>

        {/* Right: Camera toggle, Timeline toggle, Exit */}
        <div className="ride-dock-right">
          {/* Camera View Mode */}
          <button
            className="ride-dock-btn"
            onClick={toggleRideCameraMode}
            title={rideCameraMode === 'first-person' ? 'Góc nhìn thứ ba' : 'Góc nhìn thứ nhất'}
          >
            {rideCameraMode === 'first-person' ? '🎥' : '🚁'}
          </button>

          {/* Detailed Timeline Toggle */}
          <button
            className={`ride-dock-btn ${!ridePanelHidden ? 'ride-dock-btn--active' : ''}`}
            onClick={toggleRidePanelHidden}
            title="Lộ trình chi tiết"
          >
            📋
          </button>

          {/* Exit Ride */}
          <button
            className="ride-dock-btn ride-dock-btn--exit"
            onClick={stopRide}
            title="Thoát lái thử"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Collapsible right timeline sidebar */}
      <div className={`ride-overlay ${ridePanelHidden ? 'ride-overlay--hidden' : ''}`}>
        <div className="ride-sidebar-header">
          <div className="ride-timeline-title" style={{ color: line.color }}>Lộ trình: {line.name}</div>
          <button className="ride-collapse-btn" onClick={toggleRidePanelHidden} title="Thu nhỏ">
            ✕
          </button>
        </div>

        <div className="ride-timeline-scroll">
          <div className="ride-stations-timeline">
            <div 
              className="ride-timeline-line" 
              style={{ 
                background: `linear-gradient(to bottom, ${line.color}, ${line.color}40)` 
              }} 
            />
            
            {stations.map((s, i) => {
              const passed = (stationDistances.cumulative[i] / stationDistances.total) <= rideProgress;
              const isCurrent = i === currentInfo.currentIdx;
              const isNext = i === currentInfo.nextIdx;
              return (
                <div key={s.id} className={`ride-timeline-item ${isCurrent ? 'ride-timeline-item--current' : ''}`}>
                  <div
                    className={`ride-timeline-dot ${passed ? 'ride-timeline-dot--passed' : ''} ${isCurrent ? 'ride-timeline-dot--current' : ''}`}
                    style={{ 
                      borderColor: line.color,
                      backgroundColor: passed ? line.color : '#111524'
                    }}
                  />
                  <div className="ride-timeline-content">
                    <span className={`ride-timeline-name ${isCurrent ? 'ride-timeline-name--current' : ''} ${isNext ? 'ride-timeline-name--next' : ''}`}>
                      {s.name}
                    </span>
                    {isCurrent && (
                      <span className="ride-timeline-badge" style={{ backgroundColor: line.color }}>
                        Đang qua
                      </span>
                    )}
                    {isNext && (
                      <span className="ride-timeline-badge ride-timeline-badge--next">
                        Sắp tới
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

