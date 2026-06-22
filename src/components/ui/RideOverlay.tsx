'use client';

import { useMemo } from 'react';
import { useMetroStore } from '@/store/useMetroStore';
import { getStationsByLine } from '@/data/stations';

export default function RideOverlay() {
  const isRiding = useMetroStore(s => s.isRiding);
  const rideProgress = useMetroStore(s => s.rideProgress);
  const rideLineId = useMetroStore(s => s.rideLineId);
  const rideSpeed = useMetroStore(s => s.rideSpeed);
  const stopRide = useMetroStore(s => s.stopRide);
  const setRideSpeed = useMetroStore(s => s.setRideSpeed);

  const stations = useMemo(() => {
    if (!rideLineId) return [];
    return getStationsByLine(rideLineId);
  }, [rideLineId]);

  const currentStationIndex = useMemo(() => {
    return Math.min(
      Math.floor(rideProgress * stations.length),
      stations.length - 1
    );
  }, [rideProgress, stations.length]);

  const currentStation = stations[currentStationIndex];
  const nextStation = stations[currentStationIndex + 1];

  if (!isRiding || !rideLineId) return null;

  const lineColor = rideLineId === 'line-2a' ? '#00B14F' : '#E5441B';
  const percentComplete = Math.round(rideProgress * 100);

  return (
    <div className="ride-overlay">
      <div className="ride-header" style={{ borderColor: lineColor }}>
        <div className="ride-title">
          🚆 Đang đi thử tuyến {rideLineId === 'line-2a' ? '2A' : '3'}
        </div>
        <button className="ride-stop-btn" onClick={stopRide}>
          ⏹ Dừng
        </button>
      </div>

      {/* Progress bar */}
      <div className="ride-progress-container">
        <div className="ride-progress-bar">
          <div
            className="ride-progress-fill"
            style={{
              width: `${percentComplete}%`,
              backgroundColor: lineColor,
              boxShadow: `0 0 10px ${lineColor}`,
            }}
          />
        </div>
        <div className="ride-progress-text">{percentComplete}%</div>
      </div>

      {/* Current station info */}
      <div className="ride-station-info">
        <div className="ride-current">
          <span className="ride-label">Ga hiện tại:</span>
          <span className="ride-station-name" style={{ color: lineColor }}>
            {currentStation?.name || '—'}
          </span>
        </div>
        {nextStation && (
          <div className="ride-next">
            <span className="ride-label">Ga tiếp theo:</span>
            <span className="ride-station-name">{nextStation.name}</span>
          </div>
        )}
      </div>

      {/* Speed controls */}
      <div className="ride-speed">
        <span className="ride-label">Tốc độ:</span>
        <div className="ride-speed-btns">
          {[1, 2, 4].map(speed => (
            <button
              key={speed}
              className={`speed-btn ${rideSpeed === speed ? 'speed-btn--active' : ''}`}
              style={rideSpeed === speed ? { backgroundColor: lineColor } : {}}
              onClick={() => setRideSpeed(speed)}
            >
              ×{speed}
            </button>
          ))}
        </div>
      </div>

      {/* Station progress dots */}
      <div className="ride-stations-dots">
        {stations.map((s, i) => {
          const isPassed = i <= currentStationIndex;
          return (
            <div key={s.id} className="ride-dot-wrapper">
              <div
                className={`ride-dot ${isPassed ? 'ride-dot--passed' : ''}`}
                style={isPassed ? { backgroundColor: lineColor, boxShadow: `0 0 6px ${lineColor}` } : {}}
              />
              <span className={`ride-dot-label ${i === currentStationIndex ? 'ride-dot-label--current' : ''}`}>
                {s.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
