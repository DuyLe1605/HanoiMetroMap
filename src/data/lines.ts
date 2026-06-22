export interface MetroLine {
  id: string;
  name: string;
  nameShort: string;
  color: string;
  colorGlow: string;
  stationIds: string[];
  totalLength: string;
  operatingHours: string;
  frequency: string;
  description: string;
}

export const metroLines: MetroLine[] = [
  {
    id: 'line-2a',
    name: 'Cát Linh – Hà Đông',
    nameShort: '2A',
    color: '#00B14F',
    colorGlow: '#00ff6a',
    stationIds: ['C01','C02','C03','C04','C05','C06','C07','C08','C09','C10','C11','C12'],
    totalLength: '13.1 km',
    operatingHours: '5:30 – 22:30',
    frequency: '10 phút/chuyến',
    description: 'Tuyến đường sắt trên cao đầu tiên của Hà Nội, chạy dọc trục Nguyễn Trãi từ Cát Linh đến Yên Nghĩa.'
  },
  {
    id: 'line-3',
    name: 'Nhổn – Ga Hà Nội',
    nameShort: '3',
    color: '#E5441B',
    colorGlow: '#ff6b3d',
    stationIds: ['S01','S02','S03','S04','S05','S06','S07','S08','S09','S10','S11','S12'],
    totalLength: '12.5 km',
    operatingHours: '5:30 – 22:00',
    frequency: '10 phút/chuyến',
    description: 'Tuyến metro thứ 2 của Hà Nội, đoạn trên cao từ Nhổn đến Cầu Giấy đã vận hành, đoạn ngầm đang xây dựng.'
  }
];

export function getLineById(id: string): MetroLine | undefined {
  return metroLines.find(l => l.id === id);
}
