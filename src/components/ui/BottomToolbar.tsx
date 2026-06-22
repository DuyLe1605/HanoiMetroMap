'use client';

import { useMetroStore } from '@/store/useMetroStore';
import { metroLines } from '@/data/lines';

export default function BottomToolbar() {
  const selectedLineId = useMetroStore(s => s.selectedLineId);
  const setSelectedLine = useMetroStore(s => s.setSelectedLine);
  const isRiding = useMetroStore(s => s.isRiding);
  const startRide = useMetroStore(s => s.startRide);
  const showStationNames = useMetroStore(s => s.showStationNames);
  const toggleStationNames = useMetroStore(s => s.toggleStationNames);
  const terrainFlat = useMetroStore(s => s.terrainFlat);
  const toggleTerrainFlat = useMetroStore(s => s.toggleTerrainFlat);
  const showInfoDialog = useMetroStore(s => s.showInfoDialog);
  const setShowInfoDialog = useMetroStore(s => s.setShowInfoDialog);
  const mapStyle = useMetroStore(s => s.mapStyle);
  const setMapStyle = useMetroStore(s => s.setMapStyle);
  const showFutureNetwork = useMetroStore(s => s.showFutureNetwork);
  const toggleFutureNetwork = useMetroStore(s => s.toggleFutureNetwork);

  if (isRiding) return null;

  const hasSelection = selectedLineId !== null;

  return (
    <div className="bottom-toolbar">
      {/* Top row: function buttons */}
      <div className="toolbar-tabs">
        {/* Ride button — only active when a line is selected */}
        <button
          className={`toolbar-tab toolbar-tab--ride ${hasSelection ? '' : 'toolbar-tab--disabled'}`}
          onClick={() => { if (hasSelection) startRide(selectedLineId); }}
        >
          <span className="tab-icon">🚆</span>
          <span className="tab-label">Đi thử</span>
        </button>

        {/* Terrain toggle — flattens elevation instead of hiding */}
        <button
          className={`toolbar-tab ${terrainFlat ? 'toolbar-tab--active' : ''}`}
          onClick={toggleTerrainFlat}
        >
          <span className="tab-icon">{terrainFlat ? '⏚' : '⛰️'}</span>
          <span className="tab-label">Địa hình</span>
        </button>

        {/* Station names toggle */}
        <button
          className={`toolbar-tab ${showStationNames ? 'toolbar-tab--active' : ''}`}
          onClick={toggleStationNames}
        >
          <span className="tab-icon">🏷️</span>
          <span className="tab-label">Tên ga</span>
        </button>

        {/* Map style selection cycle */}
        <button
          className={`toolbar-tab toolbar-tab--map style-${mapStyle}`}
          onClick={() => {
            const styles: ('voyager' | 'dark-matter' | 'satellite' | 'vector')[] = ['voyager', 'dark-matter', 'satellite', 'vector'];
            const nextIdx = (styles.indexOf(mapStyle) + 1) % styles.length;
            setMapStyle(styles[nextIdx]);
          }}
        >
          <span className="tab-icon">
            {mapStyle === 'voyager' ? '🗺️' : mapStyle === 'dark-matter' ? '🌑' : mapStyle === 'satellite' ? '🛰️' : '📐'}
          </span>
          <span className="tab-label">
            {mapStyle === 'voyager' ? 'Bản đồ sáng' : mapStyle === 'dark-matter' ? 'Bản đồ tối' : mapStyle === 'satellite' ? 'Vệ tinh' : 'Tối giản'}
          </span>
        </button>

        {/* Future planning network toggle */}
        <button
          className={`toolbar-tab ${showFutureNetwork ? 'toolbar-tab--active' : ''}`}
          onClick={toggleFutureNetwork}
        >
          <span className="tab-icon">🔮</span>
          <span className="tab-label">Quy hoạch</span>
        </button>

        {/* Info button */}
        <button
          className="toolbar-tab"
          onClick={() => setShowInfoDialog(true)}
        >
          <span className="tab-icon">ℹ️</span>
          <span className="tab-label">Thông tin</span>
        </button>
      </div>

      {/* Bottom row: line selector circles */}
      <div className="line-circles">
        {(showFutureNetwork 
          ? metroLines 
          : metroLines.filter(l => l.id === 'line-2a' || l.id === 'line-3')
        ).map((line) => {
          const isActive = selectedLineId === line.id;
          return (
            <button
              key={line.id}
              className={`line-circle ${isActive ? 'line-circle--active' : ''}`}
              style={{
                '--lc': line.color,
                backgroundColor: isActive ? 'transparent' : line.color,
                borderColor: isActive ? line.color : 'transparent',
              } as React.CSSProperties}
              onClick={() => setSelectedLine(line.id)}
              title={line.name}
            >
              <span style={{
                color: isActive ? line.color : '#ffffff',
                fontWeight: isActive ? 800 : 700,
              }}>{line.nameShort}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
