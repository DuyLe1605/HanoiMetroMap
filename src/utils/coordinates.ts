// Convert GPS coordinates to 3D world coordinates
// Uses a simplified Mercator projection centered on Hanoi

// Center point (approximately center of all metro stations)
const CENTER_LAT = 21.00;
const CENTER_LNG = 105.79;

// Scale factor to convert degrees to 3D units
const SCALE = 800;

/**
 * Convert GPS (lat, lng) to 3D coordinates (x, y, z)
 * x = east/west, z = north/south, y = elevation
 */
export function gpsTo3D(lat: number, lng: number, elevation: number = 0): [number, number, number] {
  const x = (lng - CENTER_LNG) * SCALE * Math.cos((CENTER_LAT * Math.PI) / 180);
  const z = -(lat - CENTER_LAT) * SCALE; // negative because z goes "into" screen
  const y = elevation;
  return [x, y, z];
}

/**
 * Calculate distance between two GPS points in km (Haversine)
 */
export function gpsDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Map feature data for stylized Hanoi map
export interface MapFeature {
  type: 'river' | 'lake' | 'road';
  name: string;
  coordinates: [number, number][]; // [lat, lng] pairs
  style: { color: string; width: number; opacity: number };
}

// Simplified Red River (Sông Hồng) path through Hanoi
export const redRiver: MapFeature = {
  type: 'river',
  name: 'Sông Hồng',
  coordinates: [
    [21.12, 105.76],
    [21.10, 105.79],
    [21.08, 105.82],
    [21.06, 105.85],
    [21.05, 105.86],
    [21.04, 105.865],
    [21.03, 105.87],
    [21.02, 105.865],
    [21.01, 105.86],
    [20.99, 105.855],
    [20.97, 105.85],
    [20.95, 105.845],
    [20.93, 105.84],
  ],
  style: { color: '#1a4a7a', width: 4, opacity: 0.6 }
};

// Tô Lịch River
export const toLichRiver: MapFeature = {
  type: 'river',
  name: 'Sông Tô Lịch',
  coordinates: [
    [21.04, 105.80],
    [21.03, 105.805],
    [21.02, 105.81],
    [21.01, 105.81],
    [21.00, 105.808],
    [20.99, 105.805],
    [20.98, 105.80],
    [20.97, 105.795],
  ],
  style: { color: '#1a3a5c', width: 1.5, opacity: 0.4 }
};

// Simplified West Lake (Hồ Tây)
export const westLake: MapFeature = {
  type: 'lake',
  name: 'Hồ Tây',
  coordinates: [
    [21.065, 105.815],
    [21.07, 105.82],
    [21.075, 105.83],
    [21.07, 105.84],
    [21.06, 105.845],
    [21.05, 105.84],
    [21.045, 105.83],
    [21.05, 105.82],
    [21.055, 105.815],
    [21.065, 105.815],
  ],
  style: { color: '#0d2847', width: 1, opacity: 0.5 }
};

// Hoàn Kiếm Lake
export const hoanKiemLake: MapFeature = {
  type: 'lake',
  name: 'Hồ Hoàn Kiếm',
  coordinates: [
    [21.0285, 105.852],
    [21.030, 105.853],
    [21.031, 105.854],
    [21.030, 105.856],
    [21.028, 105.856],
    [21.027, 105.855],
    [21.027, 105.853],
    [21.0285, 105.852],
  ],
  style: { color: '#0d2847', width: 1, opacity: 0.5 }
};

// Major roads (simplified polylines)
export const majorRoads: MapFeature[] = [
  {
    type: 'road', name: 'Vành Đai 3',
    coordinates: [
      [21.06, 105.74], [21.04, 105.76], [21.02, 105.78],
      [21.00, 105.80], [20.98, 105.81], [20.96, 105.83],
    ],
    style: { color: '#1a2040', width: 1.2, opacity: 0.3 }
  },
  {
    type: 'road', name: 'Đường Nguyễn Trãi',
    coordinates: [
      [21.01, 105.82], [21.00, 105.81], [20.99, 105.805],
      [20.98, 105.795], [20.97, 105.785], [20.96, 105.77],
      [20.95, 105.755], [20.94, 105.745],
    ],
    style: { color: '#1a2040', width: 1, opacity: 0.25 }
  },
  {
    type: 'road', name: 'QL32 / Hồ Tùng Mậu / Xuân Thủy',
    coordinates: [
      [21.055, 105.73], [21.05, 105.74], [21.045, 105.755],
      [21.04, 105.77], [21.035, 105.79], [21.03, 105.80],
    ],
    style: { color: '#1a2040', width: 1, opacity: 0.25 }
  },
];

export const allMapFeatures: MapFeature[] = [
  redRiver, toLichRiver, westLake, hoanKiemLake, ...majorRoads,
];
