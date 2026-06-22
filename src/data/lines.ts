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
    id: 'line-1',
    name: 'Tuyến số 1: Ngọc Hồi – Yên Viên',
    nameShort: '1',
    color: '#283593',
    colorGlow: '#5c6bc0',
    stationIds: ['L1-01', 'L1-02', 'L1-03', 'L1-04', 'L1-05', 'L1-06', 'L1-07'],
    totalLength: '38.7 km',
    operatingHours: '5:30 – 23:00',
    frequency: '8-10 phút/chuyến',
    description: 'Tuyến hướng tâm chạy dọc hành lang Bắc - Nam kết nối Ngọc Hồi, Ga Hà Nội và Yên Viên.'
  },
  {
    id: 'line-2',
    name: 'Tuyến số 2: Nội Bài – Thượng Đình',
    nameShort: '2',
    color: '#4CAF50',
    colorGlow: '#81C784',
    stationIds: ['L2-01', 'L2-02', 'L2-03', 'L2-04', 'L2-05', 'L2-06', 'L2-07'],
    totalLength: '35.2 km',
    operatingHours: '5:30 – 23:00',
    frequency: '8-10 phút/chuyến',
    description: 'Tuyến kết nối sân bay Nội Bài với trung tâm thành phố và kết thúc tại Thượng Đình.'
  },
  {
    id: 'line-2a',
    name: 'Tuyến số 2A: Cát Linh – Hà Đông',
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
    name: 'Tuyến số 3: Nhổn – Ga Hà Nội',
    nameShort: '3',
    color: '#E5441B',
    colorGlow: '#ff6b3d',
    stationIds: ['S01','S02','S03','S04','S05','S06','S07','S08','S09','S10','S11','S12','S13','S14'],
    totalLength: '21.0 km',
    operatingHours: '5:30 – 22:00',
    frequency: '10 phút/chuyến',
    description: 'Tuyến metro kết nối Nhổn phía Tây với Ga Hà Nội và mở rộng về phía Hoàng Mai (Yên Sở) ở phía Nam.'
  },
  {
    id: 'line-4',
    name: 'Tuyến số 4: Liên Hà – Mê Linh – Sài Đồng',
    nameShort: '4',
    color: '#FB8C00',
    colorGlow: '#FFB74D',
    stationIds: ['L4-01', 'L4-02', 'L4-03', 'L4-04', 'L4-05', 'L4-06', 'L4-07', 'L4-08', 'L4-09'],
    totalLength: '54.0 km',
    operatingHours: '5:30 – 23:00',
    frequency: '10-12 phút/chuyến',
    description: 'Tuyến vòng tròn kết nối các khu đô thị vệ tinh lớn xung quanh vành đai thành phố.'
  },
  {
    id: 'line-5',
    name: 'Tuyến số 5: Văn Cao – Hòa Lạc',
    nameShort: '5',
    color: '#00ACC1',
    colorGlow: '#4DD0E1',
    stationIds: ['L5-01', 'L5-02', 'L5-03', 'L5-04', 'L5-05', 'L5-06', 'L5-07'],
    totalLength: '38.4 km',
    operatingHours: '5:30 – 23:00',
    frequency: '8-10 phút/chuyến',
    description: 'Tuyến kết nối trung tâm Văn Cao chạy dọc đại lộ Thăng Long hướng Tây đi khu công nghệ cao Hòa Lạc.'
  },
  {
    id: 'line-6',
    name: 'Tuyến số 6: Nội Bài – Phú Diễn – Ngọc Hồi',
    nameShort: '6',
    color: '#E91E63',
    colorGlow: '#F06292',
    stationIds: ['L6-01', 'L6-02', 'L6-03', 'L6-04', 'L6-05'],
    totalLength: '43.0 km',
    operatingHours: '5:30 – 23:00',
    frequency: '10 phút/chuyến',
    description: 'Tuyến kết nối trực tiếp sân bay Nội Bài đi qua phía Tây tới Ngọc Hồi ở phía Nam.'
  },
  {
    id: 'line-7',
    name: 'Tuyến số 7: Mê Linh – Nhổn – Hà Đông',
    nameShort: '7',
    color: '#9C27B0',
    colorGlow: '#BA68C8',
    stationIds: ['L7-01', 'L7-02', 'L7-03', 'L7-04', 'L7-05', 'L7-06', 'L7-07', 'L7-08'],
    totalLength: '28.0 km',
    operatingHours: '5:30 – 23:00',
    frequency: '10 phút/chuyến',
    description: 'Tuyến kết nối hành lang phía Tây chạy qua Mê Linh, Nhổn, Hà Đông đến Đại Áng.'
  },
  {
    id: 'line-8',
    name: 'Tuyến số 8: Sơn Đồng – Mai Dịch – Dương Xá',
    nameShort: '8',
    color: '#795548',
    colorGlow: '#A1887F',
    stationIds: ['L8-01', 'L8-02', 'L8-03', 'L8-04', 'L8-05', 'L8-06'],
    totalLength: '37.0 km',
    operatingHours: '5:30 – 23:00',
    frequency: '10 phút/chuyến',
    description: 'Tuyến chạy theo vành đai 3 kết nối khu vực phía Tây Sơn Đồng với khu đô thị phía Đông Dương Xá.'
  }
];

export function getLineById(id: string): MetroLine | undefined {
  return metroLines.find(l => l.id === id);
}

