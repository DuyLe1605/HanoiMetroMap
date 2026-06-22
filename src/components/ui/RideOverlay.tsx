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
      {/* Floating HUD when information panel is hidden */}
      {ridePanelHidden && (
        <div className="ride-floating-hud">
          <button
            className="ride-hud-btn"
            onClick={toggleRideCameraMode}
            title={rideCameraMode === 'first-person' ? 'Chuyển sang góc nhìn thứ ba' : 'Chuyển sang góc nhìn thứ nhất'}
            style={{ borderColor: line.color, borderLeftWidth: '3px' }}
          >
            {rideCameraMode === 'first-person' ? '🎥 Góc lái' : '🚁 Góc ngoài'}
          </button>
          <button className="ride-hud-btn" onClick={toggleRidePanelHidden}>
            👁️ Hiện thông tin
          </button>
          <button className="ride-hud-btn ride-hud-btn--exit" onClick={stopRide}>
            ✕ Thoát
          </button>
        </div>
      )}

      {/* Right sidebar overlay — slides out to the right when hidden */}
      <div className={`ride-overlay ${ridePanelHidden ? 'ride-overlay--hidden' : ''}`}>
        {/* Header */}
        <div className="ride-sidebar-header">
          <div className="ride-line-name" style={{ color: line.color }}>
            {line.name}
          </div>
          <button 
            className="ride-collapse-btn" 
            onClick={toggleRidePanelHidden} 
            title="Thu nhỏ thông tin"
          >
            ✕
          </button>
        </div>

        {/* Progress bar */}
        <div className="ride-progress-bar">
          <div
            className="ride-progress-fill"
            style={{
              width: `${rideProgress * 100}%`,
              backgroundColor: line.color,
            }}
          />
        </div>

        {/* Next station + distance info card */}
        <div className="ride-info-card" style={{ borderColor: `${line.color}30` }}>
          <div className="ride-info-title">Ga tiếp theo</div>
          <div className="ride-next-name" style={{ color: line.color }}>
            {stations[currentInfo.nextIdx]?.name || '—'}
          </div>
          <div className="ride-info-details">
            <span className="ride-distance">
              {currentInfo.distToNext > 0 ? `${Math.round(currentInfo.distToNext)}m` : 'Đang tới ga'}
            </span>
            <span className="ride-info-divider">•</span>
            <span className="ride-elevation">↕ {currentInfo.elevation}m</span>
            <span className="ride-info-divider">•</span>
            <span className="ride-progress-pct">{Math.round(rideProgress * 100)}%</span>
          </div>
        </div>

        {/* Control buttons */}
        <div className="ride-controls-section">
          <div className="ride-controls-row">
            {/* Play/Pause */}
            <button
              className="ride-control-btn ride-control-btn--main"
              onClick={toggleRidePause}
              title={ridePaused ? 'Tiếp tục' : 'Tạm dừng'}
              style={{ 
                backgroundColor: `${line.color}15`, 
                borderColor: line.color 
              }}
            >
              {ridePaused ? '▶' : '⏸'}
            </button>

            {/* Camera View Mode */}
            <button
              className="ride-control-btn"
              onClick={toggleRideCameraMode}
              title={rideCameraMode === 'first-person' ? 'Chuyển sang góc ngoài (Theo sau)' : 'Chuyển sang góc lái (Buồng lái)'}
              style={{ 
                borderColor: rideCameraMode === 'first-person' ? line.color : undefined,
                backgroundColor: rideCameraMode === 'first-person' ? `${line.color}15` : undefined
              }}
            >
              {rideCameraMode === 'first-person' ? '🎥' : '🚁'}
            </button>

            {/* Stop / Quit */}
            <button 
              className="ride-control-btn ride-control-btn--exit" 
              onClick={stopRide} 
              title="Dừng đi thử"
            >
              ✕
            </button>
          </div>

          {/* Speed controllers */}
          <div className="ride-speed-row">
            <span className="ride-speed-label">Tốc độ:</span>
            <div className="ride-speed-buttons">
              {speeds.map(sp => (
                <button
                  key={sp}
                  className={`speed-btn ${rideSpeed === sp ? 'speed-btn--active' : ''}`}
                  style={rideSpeed === sp ? { backgroundColor: line.color } : {}}
                  onClick={() => setRideSpeed(sp)}
                >
                  {sp}×
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Vertical Timeline of Stations */}
        <div className="ride-timeline-container">
          <div className="ride-timeline-title">Lộ trình chi tiết</div>
          <div className="ride-timeline-scroll">
            <div className="ride-stations-timeline">
              {/* Connected line behind dots */}
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
      </div>
    </>
  );
}

