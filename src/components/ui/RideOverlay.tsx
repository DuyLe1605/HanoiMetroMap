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
  const stopRide = useMetroStore(s => s.stopRide);
  const setRideSpeed = useMetroStore(s => s.setRideSpeed);
  const toggleRidePause = useMetroStore(s => s.toggleRidePause);

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
      {/* Back button — top left */}
      <button className="ride-back-btn" onClick={stopRide}>
        ← Quay lại bản đồ
      </button>

      {/* Bottom overlay */}
      <div className="ride-overlay">
        {/* Drag handle */}
        <div className="ride-handle" />

        {/* Line name */}
        <div className="ride-line-name" style={{ color: line.color }}>
          {line.name}
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

        {/* Next station + distance info */}
        <div className="ride-info-row">
          <div className="ride-info-left">
            <span className="ride-small-label">Ga tiếp theo </span>
            <span className="ride-next-name" style={{ color: line.color }}>
              {stations[currentInfo.nextIdx]?.name || '—'}
            </span>
            <span className="ride-distance">
              {currentInfo.distToNext > 0 ? ` ${Math.round(currentInfo.distToNext)} m` : ''}
            </span>
          </div>
          <div className="ride-info-right">
            <span className="ride-elevation">↕ {currentInfo.elevation} m</span>
            <span className="ride-progress-pct">{Math.round(rideProgress * 100)}%</span>
          </div>
        </div>

        {/* Controls */}
        <div className="ride-controls">
          {/* Stop */}
          <button className="ride-control-btn" onClick={stopRide} title="Dừng lại">
            ■
          </button>

          {/* Pause / Play */}
          <button
            className="ride-control-btn ride-control-btn--main"
            onClick={toggleRidePause}
            title={ridePaused ? 'Tiếp tục' : 'Tạm dừng'}
          >
            {ridePaused ? '▶' : '⏸'}
          </button>

          {/* Speed buttons */}
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

        {/* Station dots line */}
        <div className="ride-stations-line">
          {stations.map((s, i) => {
            const passed = (stationDistances.cumulative[i] / stationDistances.total) <= rideProgress;
            const isCurrent = i === currentInfo.currentIdx;
            const isNext = i === currentInfo.nextIdx;
            return (
              <div key={s.id} className="ride-station-dot-col">
                <div
                  className={`ride-dot ${passed ? 'ride-dot--passed' : ''} ${isCurrent ? 'ride-dot--current' : ''}`}
                  style={{ backgroundColor: passed ? line.color : undefined }}
                />
                <span className={`ride-dot-label ${isCurrent ? 'ride-dot-label--current' : ''} ${isNext ? 'ride-dot-label--next' : ''}`}>
                  {s.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
