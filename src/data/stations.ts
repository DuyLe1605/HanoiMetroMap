export interface Station {
  id: string;
  name: string;
  lineId: string;
  lat: number;
  lng: number;
  status: 'active' | 'construction';
  description: string;
  address: string;
}

// Tuyến 2A: Cát Linh – Hà Đông (12 ga trên cao)
export const line2aStations: Station[] = [
  {
    id: 'C01', name: 'Cát Linh', lineId: 'line-2a',
    lat: 21.02806, lng: 105.82722, status: 'active',
    description: 'Ga đầu mối tuyến 2A, kết nối với tuyến 3',
    address: 'Ngã tư Cát Linh - Giảng Võ, Đống Đa'
  },
  {
    id: 'C02', name: 'La Thành', lineId: 'line-2a',
    lat: 21.02028, lng: 105.82528, status: 'active',
    description: 'Gần khu vực Hào Nam, Láng Hạ',
    address: 'Đường Hào Nam, Đống Đa'
  },
  {
    id: 'C03', name: 'Thái Hà', lineId: 'line-2a',
    lat: 21.01444, lng: 105.81944, status: 'active',
    description: 'Gần ngã tư Hoàng Cầu - Thái Hà',
    address: 'Đường Thái Hà, Đống Đa'
  },
  {
    id: 'C04', name: 'Láng', lineId: 'line-2a',
    lat: 21.01250, lng: 105.81194, status: 'active',
    description: 'Gần sông Tô Lịch, đường Láng',
    address: 'Đường Láng, Đống Đa'
  },
  {
    id: 'C05', name: 'Thượng Đình', lineId: 'line-2a',
    lat: 21.00444, lng: 105.80806, status: 'active',
    description: 'Khu vực Nguyễn Trãi, Thượng Đình',
    address: 'Đường Nguyễn Trãi, Thanh Xuân'
  },
  {
    id: 'C06', name: 'Vành Đai 3', lineId: 'line-2a',
    lat: 20.99222, lng: 105.80444, status: 'active',
    description: 'Gần nút giao Vành Đai 3',
    address: 'Ngã tư Nguyễn Trãi - Vành Đai 3, Thanh Xuân'
  },
  {
    id: 'C07', name: 'Phùng Khoang', lineId: 'line-2a',
    lat: 20.98500, lng: 105.79417, status: 'active',
    description: 'Khu vực Phùng Khoang, Nguyễn Trãi',
    address: 'Đường Nguyễn Trãi, Nam Từ Liêm'
  },
  {
    id: 'C08', name: 'Văn Quán', lineId: 'line-2a',
    lat: 20.97778, lng: 105.78472, status: 'active',
    description: 'Gần khu đô thị Văn Quán',
    address: 'Đường Nguyễn Trãi, Hà Đông'
  },
  {
    id: 'C09', name: 'Hà Đông', lineId: 'line-2a',
    lat: 20.97028, lng: 105.77500, status: 'active',
    description: 'Trung tâm quận Hà Đông',
    address: 'Đường Trần Phú, Hà Đông'
  },
  {
    id: 'C10', name: 'La Khê', lineId: 'line-2a',
    lat: 20.96389, lng: 105.76667, status: 'active',
    description: 'Gần khu đô thị La Khê',
    address: 'Đường Quang Trung, Hà Đông'
  },
  {
    id: 'C11', name: 'Văn Khê', lineId: 'line-2a',
    lat: 20.95556, lng: 105.75611, status: 'active',
    description: 'Khu đô thị Văn Khê',
    address: 'Đường Quang Trung, Hà Đông'
  },
  {
    id: 'C12', name: 'Yên Nghĩa', lineId: 'line-2a',
    lat: 20.94972, lng: 105.74833, status: 'active',
    description: 'Ga cuối tuyến 2A, gần bến xe Yên Nghĩa',
    address: 'Bến xe Yên Nghĩa, Hà Đông'
  },
];

// Tuyến 3: Nhổn – Ga Hà Nội (12 ga: 8 trên cao + 4 ngầm)
export const line3Stations: Station[] = [
  {
    id: 'S01', name: 'Nhổn', lineId: 'line-3',
    lat: 21.05259, lng: 105.73523, status: 'active',
    description: 'Ga đầu tuyến 3, depot Nhổn',
    address: 'Quốc lộ 32, Bắc Từ Liêm'
  },
  {
    id: 'S02', name: 'Minh Khai', lineId: 'line-3',
    lat: 21.04806, lng: 105.74472, status: 'active',
    description: 'Phường Tây Tựu, Bắc Từ Liêm',
    address: 'Đường Cầu Diễn, Bắc Từ Liêm'
  },
  {
    id: 'S03', name: 'Phú Diễn', lineId: 'line-3',
    lat: 21.04389, lng: 105.75528, status: 'active',
    description: 'Phường Phú Diễn, Bắc Từ Liêm',
    address: 'Đường Cầu Diễn, Bắc Từ Liêm'
  },
  {
    id: 'S04', name: 'Cầu Diễn', lineId: 'line-3',
    lat: 21.04111, lng: 105.76278, status: 'active',
    description: 'Ngã tư Cầu Diễn',
    address: 'Đường Cầu Diễn, Nam Từ Liêm'
  },
  {
    id: 'S05', name: 'Lê Đức Thọ', lineId: 'line-3',
    lat: 21.03806, lng: 105.77306, status: 'active',
    description: 'Gần ngã tư Lê Đức Thọ - Hồ Tùng Mậu',
    address: 'Đường Hồ Tùng Mậu, Nam Từ Liêm'
  },
  {
    id: 'S06', name: 'Đại học Quốc gia', lineId: 'line-3',
    lat: 21.03667, lng: 105.78278, status: 'active',
    description: 'Gần Đại học Quốc gia Hà Nội',
    address: 'Đường Hồ Tùng Mậu, Cầu Giấy'
  },
  {
    id: 'S07', name: 'Chùa Hà', lineId: 'line-3',
    lat: 21.03500, lng: 105.79800, status: 'active',
    description: 'Gần Chùa Hà, đường Xuân Thủy',
    address: 'Đường Xuân Thủy, Cầu Giấy'
  },
  {
    id: 'S08', name: 'Cầu Giấy', lineId: 'line-3',
    lat: 21.02944, lng: 105.80333, status: 'active',
    description: 'Ga cuối đoạn trên cao, quận Cầu Giấy',
    address: 'Đường Cầu Giấy, Cầu Giấy'
  },
  {
    id: 'S09', name: 'Kim Mã', lineId: 'line-3',
    lat: 21.03056, lng: 105.81417, status: 'construction',
    description: 'Ga ngầm đang xây dựng, khu Kim Mã',
    address: 'Đường Kim Mã, Ba Đình'
  },
  {
    id: 'S10', name: 'Cát Linh', lineId: 'line-3',
    lat: 21.02806, lng: 105.82722, status: 'construction',
    description: 'Ga ngầm, điểm trung chuyển với tuyến 2A',
    address: 'Đường Cát Linh, Đống Đa'
  },
  {
    id: 'S11', name: 'Văn Miếu', lineId: 'line-3',
    lat: 21.02667, lng: 105.83639, status: 'construction',
    description: 'Ga ngầm gần Văn Miếu - Quốc Tử Giám',
    address: 'Đường Tôn Đức Thắng, Đống Đa'
  },
  {
    id: 'S12', name: 'Ga Hà Nội', lineId: 'line-3',
    lat: 21.02500, lng: 105.84100, status: 'construction',
    description: 'Ga cuối tuyến 3, kết nối ga đường sắt quốc gia',
    address: 'Đường Lê Duẩn, Hoàn Kiếm'
  },
];

export const allStations: Station[] = [...line2aStations, ...line3Stations];

export function getStationById(id: string): Station | undefined {
  return allStations.find(s => s.id === id);
}

export function getStationsByLine(lineId: string): Station[] {
  return allStations.filter(s => s.lineId === lineId);
}
