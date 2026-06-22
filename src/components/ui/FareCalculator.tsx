'use client';

import { useMetroStore } from '@/store/useMetroStore';
import { getStationById } from '@/data/stations';
import { calculateFare, formatPrice } from '@/data/fares';

export default function FareCalculator() {
  const fromStationId = useMetroStore(s => s.fromStationId);
  const toStationId = useMetroStore(s => s.toStationId);
  const clearFareSelection = useMetroStore(s => s.clearFareSelection);
  const isRiding = useMetroStore(s => s.isRiding);

  if (isRiding) return null;

  const fromStation = fromStationId ? getStationById(fromStationId) : null;
  const toStation = toStationId ? getStationById(toStationId) : null;
  const fare = fromStationId && toStationId ? calculateFare(fromStationId, toStationId) : null;

  if (!fromStation && !toStation) return null;

  return (
    <div className="fare-panel">
      <div className="fare-panel-header">
        <h3>💰 Tra cứu giá vé</h3>
        <button className="fare-close-btn" onClick={clearFareSelection}>✕</button>
      </div>

      <div className="fare-stations">
        <div className="fare-station">
          <div className="fare-station-label">Điểm đi</div>
          <div className={`fare-station-name ${fromStation ? 'fare-station-name--active' : ''}`}>
            {fromStation ? (
              <>
                <span className="fare-station-code">{fromStation.id}</span>
                {fromStation.name}
              </>
            ) : (
              'Chọn ga trên bản đồ...'
            )}
          </div>
        </div>

        <div className="fare-arrow">→</div>

        <div className="fare-station">
          <div className="fare-station-label">Điểm đến</div>
          <div className={`fare-station-name ${toStation ? 'fare-station-name--active' : ''}`}>
            {toStation ? (
              <>
                <span className="fare-station-code">{toStation.id}</span>
                {toStation.name}
              </>
            ) : (
              'Chọn ga trên bản đồ...'
            )}
          </div>
        </div>
      </div>

      {fare && (
        <div className="fare-result">
          <div className="fare-price-row">
            <div className="fare-price-item">
              <div className="fare-price-label">Tiền mặt</div>
              <div className="fare-price-value fare-price-cash">{formatPrice(fare.cashPrice)}</div>
            </div>
            <div className="fare-price-item">
              <div className="fare-price-label">Thẻ / App</div>
              <div className="fare-price-value fare-price-card">{formatPrice(fare.cardPrice)}</div>
            </div>
          </div>
          <div className="fare-meta">
            <span>📍 {fare.stops} ga</span>
            <span>⏱️ ~{fare.estimatedMinutes} phút</span>
          </div>
        </div>
      )}
    </div>
  );
}
