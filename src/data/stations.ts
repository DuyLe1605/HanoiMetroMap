export interface Station {
  id: string;
  name: string;
  lineId: string;
  lat: number;
  lng: number;
  elevation: number; // meters above sea level
  status: 'active' | 'construction';
  description: string;
  address: string;
}

// Tuyến 2A: Cát Linh – Hà Đông (12 ga trên cao)
// Elevation based on Hanoi terrain: Cát Linh area ~8-10m, goes up toward Hà Đông ~12-15m, Yên Nghĩa ~10m
export const line2aStations: Station[] = [
  {
    id: 'C01', name: 'Cát Linh', lineId: 'line-2a',
    lat: 21.02806, lng: 105.82722, elevation: 8,
    status: 'active',
    description: 'Ga đầu mối tuyến 2A, kết nối với tuyến 3',
    address: 'Ngã tư Cát Linh - Giảng Võ, Đống Đa'
  },
  {
    id: 'C02', name: 'La Thành', lineId: 'line-2a',
    lat: 21.02028, lng: 105.82528, elevation: 9,
    status: 'active',
    description: 'Gần khu vực Hào Nam, Láng Hạ',
    address: 'Đường Hào Nam, Đống Đa'
  },
  {
    id: 'C03', name: 'Thái Hà', lineId: 'line-2a',
    lat: 21.01444, lng: 105.81944, elevation: 9,
    status: 'active',
    description: 'Gần ngã tư Hoàng Cầu - Thái Hà',
    address: 'Đường Thái Hà, Đống Đa'
  },
  {
    id: 'C04', name: 'Láng', lineId: 'line-2a',
    lat: 21.01250, lng: 105.81194, elevation: 7,
    status: 'active',
    description: 'Gần sông Tô Lịch, đường Láng',
    address: 'Đường Láng, Đống Đa'
  },
  {
    id: 'C05', name: 'Thượng Đình', lineId: 'line-2a',
    lat: 21.00444, lng: 105.80806, elevation: 8,
    status: 'active',
    description: 'Khu vực Nguyễn Trãi, Thượng Đình',
    address: 'Đường Nguyễn Trãi, Thanh Xuân'
  },
  {
    id: 'C06', name: 'Vành Đai 3', lineId: 'line-2a',
    lat: 20.99222, lng: 105.80444, elevation: 10,
    status: 'active',
    description: 'Gần nút giao Vành Đai 3',
    address: 'Ngã tư Nguyễn Trãi - Vành Đai 3, Thanh Xuân'
  },
  {
    id: 'C07', name: 'Phùng Khoang', lineId: 'line-2a',
    lat: 20.98500, lng: 105.79417, elevation: 11,
    status: 'active',
    description: 'Khu vực Phùng Khoang, Nguyễn Trãi',
    address: 'Đường Nguyễn Trãi, Nam Từ Liêm'
  },
  {
    id: 'C08', name: 'Văn Quán', lineId: 'line-2a',
    lat: 20.97778, lng: 105.78472, elevation: 12,
    status: 'active',
    description: 'Gần khu đô thị Văn Quán',
    address: 'Đường Nguyễn Trãi, Hà Đông'
  },
  {
    id: 'C09', name: 'Hà Đông', lineId: 'line-2a',
    lat: 20.97028, lng: 105.77500, elevation: 14,
    status: 'active',
    description: 'Trung tâm quận Hà Đông',
    address: 'Đường Trần Phú, Hà Đông'
  },
  {
    id: 'C10', name: 'La Khê', lineId: 'line-2a',
    lat: 20.96389, lng: 105.76667, elevation: 13,
    status: 'active',
    description: 'Gần khu đô thị La Khê',
    address: 'Đường Quang Trung, Hà Đông'
  },
  {
    id: 'C11', name: 'Văn Khê', lineId: 'line-2a',
    lat: 20.95556, lng: 105.75611, elevation: 11,
    status: 'active',
    description: 'Khu đô thị Văn Khê',
    address: 'Đường Quang Trung, Hà Đông'
  },
  {
    id: 'C12', name: 'Yên Nghĩa', lineId: 'line-2a',
    lat: 20.94972, lng: 105.74833, elevation: 10,
    status: 'active',
    description: 'Ga cuối tuyến 2A, gần bến xe Yên Nghĩa',
    address: 'Bến xe Yên Nghĩa, Hà Đông'
  },
];

// Tuyến 3: Nhổn – Ga Hà Nội (12 ga: 8 trên cao + 4 ngầm)
// Nhổn area ~10-12m, goes through university area ~9m, then drops underground near center ~6m
export const line3Stations: Station[] = [
  {
    id: 'S01', name: 'Nhổn', lineId: 'line-3',
    lat: 21.05259, lng: 105.73523, elevation: 12,
    status: 'active',
    description: 'Ga đầu tuyến 3, depot Nhổn',
    address: 'Quốc lộ 32, Bắc Từ Liêm'
  },
  {
    id: 'S02', name: 'Minh Khai', lineId: 'line-3',
    lat: 21.04806, lng: 105.74472, elevation: 11,
    status: 'active',
    description: 'Phường Tây Tựu, Bắc Từ Liêm',
    address: 'Đường Cầu Diễn, Bắc Từ Liêm'
  },
  {
    id: 'S03', name: 'Phú Diễn', lineId: 'line-3',
    lat: 21.04389, lng: 105.75528, elevation: 10,
    status: 'active',
    description: 'Phường Phú Diễn, Bắc Từ Liêm',
    address: 'Đường Cầu Diễn, Bắc Từ Liêm'
  },
  {
    id: 'S04', name: 'Cầu Diễn', lineId: 'line-3',
    lat: 21.04111, lng: 105.76278, elevation: 9,
    status: 'active',
    description: 'Ngã tư Cầu Diễn',
    address: 'Đường Cầu Diễn, Nam Từ Liêm'
  },
  {
    id: 'S05', name: 'Lê Đức Thọ', lineId: 'line-3',
    lat: 21.03806, lng: 105.77306, elevation: 9,
    status: 'active',
    description: 'Gần ngã tư Lê Đức Thọ - Hồ Tùng Mậu',
    address: 'Đường Hồ Tùng Mậu, Nam Từ Liêm'
  },
  {
    id: 'S06', name: 'Đại học Quốc gia', lineId: 'line-3',
    lat: 21.03667, lng: 105.78278, elevation: 8,
    status: 'active',
    description: 'Gần Đại học Quốc gia Hà Nội',
    address: 'Đường Hồ Tùng Mậu, Cầu Giấy'
  },
  {
    id: 'S07', name: 'Chùa Hà', lineId: 'line-3',
    lat: 21.03500, lng: 105.79800, elevation: 8,
    status: 'active',
    description: 'Gần Chùa Hà, đường Xuân Thủy',
    address: 'Đường Xuân Thủy, Cầu Giấy'
  },
  {
    id: 'S08', name: 'Cầu Giấy', lineId: 'line-3',
    lat: 21.02944, lng: 105.80333, elevation: 7,
    status: 'active',
    description: 'Ga cuối đoạn trên cao, quận Cầu Giấy',
    address: 'Đường Cầu Giấy, Cầu Giấy'
  },
  {
    id: 'S09', name: 'Kim Mã', lineId: 'line-3',
    lat: 21.03056, lng: 105.81417, elevation: 5,
    status: 'construction',
    description: 'Ga ngầm đang xây dựng, khu Kim Mã',
    address: 'Đường Kim Mã, Ba Đình'
  },
  {
    id: 'S10', name: 'Cát Linh', lineId: 'line-3',
    lat: 21.02806, lng: 105.82722, elevation: 5,
    status: 'construction',
    description: 'Ga ngầm, điểm trung chuyển với tuyến 2A',
    address: 'Đường Cát Linh, Đống Đa'
  },
  {
    id: 'S11', name: 'Văn Miếu', lineId: 'line-3',
    lat: 21.02667, lng: 105.83639, elevation: 6,
    status: 'construction',
    description: 'Ga ngầm gần Văn Miếu - Quốc Tử Giám',
    address: 'Đường Tôn Đức Thắng, Đống Đa'
  },
  {
    id: 'S12', name: 'Ga Hà Nội', lineId: 'line-3',
    lat: 21.02500, lng: 105.84100, elevation: 6,
    status: 'construction',
    description: 'Ga cuối tuyến 3, kết nối ga đường sắt quốc gia',
    address: 'Đường Lê Duẩn, Hoàn Kiếm'
  },
  {
    id: 'S13', name: 'Kim Liên', lineId: 'line-3',
    lat: 21.0116, lng: 105.8427, elevation: 6,
    status: 'construction',
    description: 'Ga trung chuyển tương lai kết nối tuyến số 1',
    address: 'Đường Giải Phóng, Hai Bà Trưng'
  },
  {
    id: 'S14', name: 'Hoàng Mai', lineId: 'line-3',
    lat: 20.9754, lng: 105.8655, elevation: 8,
    status: 'construction',
    description: 'Ga cuối đoạn kéo dài tuyến số 3',
    address: 'Phường Yên Sở, Hoàng Mai'
  }
];

// Tuyến 1: Ngọc Hồi – Yên Viên
export const line1Stations: Station[] = [
  {
    id: 'L1-01', name: 'Ngọc Hồi', lineId: 'line-1',
    lat: 20.9400, lng: 105.8400, elevation: 8,
    status: 'construction',
    description: 'Ga đầu mối phía Nam, kết nối đường sắt quốc gia',
    address: 'Ngọc Hồi, Thanh Trì'
  },
  {
    id: 'L1-02', name: 'Văn Điển', lineId: 'line-1',
    lat: 20.9600, lng: 105.8410, elevation: 8,
    status: 'construction',
    description: 'Ga khu vực Văn Điển',
    address: 'Thị trấn Văn Điển, Thanh Trì'
  },
  {
    id: 'L1-03', name: 'Giáp Bát', lineId: 'line-1',
    lat: 20.9850, lng: 105.8415, elevation: 8,
    status: 'construction',
    description: 'Ga kết nối Bến xe Giáp Bát',
    address: 'Đường Giải Phóng, Hoàng Mai'
  },
  {
    id: 'L1-04', name: 'Ga Hà Nội', lineId: 'line-1',
    lat: 21.02500, lng: 105.84100, elevation: 6,
    status: 'construction',
    description: 'Ga trung tâm trung chuyển kết nối tuyến số 3',
    address: 'Đường Lê Duẩn, Hoàn Kiếm'
  },
  {
    id: 'L1-05', name: 'Long Biên', lineId: 'line-1',
    lat: 21.0430, lng: 105.8500, elevation: 7,
    status: 'construction',
    description: 'Ga khu vực cầu Long Biên',
    address: 'Đường Trần Nhật Duật, Hoàn Kiếm'
  },
  {
    id: 'L1-06', name: 'Gia Lâm', lineId: 'line-1',
    lat: 21.0530, lng: 105.8750, elevation: 8,
    status: 'construction',
    description: 'Ga kết nối đường sắt Hà Nội - Hải Phòng',
    address: 'Phường Gia Thụy, Long Biên'
  },
  {
    id: 'L1-07', name: 'Yên Viên', lineId: 'line-1',
    lat: 21.0800, lng: 105.9000, elevation: 8,
    status: 'construction',
    description: 'Ga đầu mối phía Đông Bắc',
    address: 'Thị trấn Yên Viên, Gia Lâm'
  }
];

// Tuyến 2: Nội Bài – Thượng Đình
export const line2Stations: Station[] = [
  {
    id: 'L2-01', name: 'Sân bay Nội Bài', lineId: 'line-2',
    lat: 21.2200, lng: 105.8000, elevation: 12,
    status: 'construction',
    description: 'Ga kết nối Nhà ga hành khách T1/T2 Nội Bài',
    address: 'Sân bay Nội Bài, Sóc Sơn'
  },
  {
    id: 'L2-02', name: 'Vân Nội', lineId: 'line-2',
    lat: 21.1400, lng: 105.8010, elevation: 10,
    status: 'construction',
    description: 'Ga khu vực Vân Nội, Đông Anh',
    address: 'Xã Vân Nội, Đông Anh'
  },
  {
    id: 'L2-03', name: 'Vĩnh Ngọc', lineId: 'line-2',
    lat: 21.0950, lng: 105.8020, elevation: 8,
    status: 'construction',
    description: 'Ga đầu cầu Nhật Tân phía Bắc',
    address: 'Xã Vĩnh Ngọc, Đông Anh'
  },
  {
    id: 'L2-04', name: 'Nam Thăng Long', lineId: 'line-2',
    lat: 21.0800, lng: 105.7950, elevation: 8,
    status: 'construction',
    description: 'Ga kết nối khu đô thị Ciputra',
    address: 'KĐT Ciputra, Bắc Từ Liêm'
  },
  {
    id: 'L2-05', name: 'Bưởi', lineId: 'line-2',
    lat: 21.0450, lng: 105.8030, elevation: 8,
    status: 'construction',
    description: 'Ga khu vực Vành đai 2, dốc Bưởi',
    address: 'Đường Bưởi, Ba Đình'
  },
  {
    id: 'L2-06', name: 'Cát Linh', lineId: 'line-2',
    lat: 21.02806, lng: 105.82722, elevation: 8,
    status: 'construction',
    description: 'Ga trung chuyển kết nối tuyến số 2A & 3',
    address: 'Cát Linh, Đống Đa'
  },
  {
    id: 'L2-07', name: 'Thượng Đình', lineId: 'line-2',
    lat: 21.0044, lng: 105.8080, elevation: 8,
    status: 'construction',
    description: 'Ga kết nối tuyến số 2A & 4',
    address: 'Đường Nguyễn Trãi, Thanh Xuân'
  }
];

// Tuyến 4: Liên Hà – Mê Linh – Sài Đồng
export const line4Stations: Station[] = [
  {
    id: 'L4-01', name: 'Mê Linh', lineId: 'line-4',
    lat: 21.1800, lng: 105.7200, elevation: 10,
    status: 'construction',
    description: 'Ga đầu mối khu đô thị Mê Linh',
    address: 'Thị trấn Quang Minh, Mê Linh'
  },
  {
    id: 'L4-02', name: 'Đông Anh', lineId: 'line-4',
    lat: 21.1400, lng: 105.8400, elevation: 10,
    status: 'construction',
    description: 'Ga trung chuyển tương lai kết nối tuyến số 1',
    address: 'Thị trấn Đông Anh, Đông Anh'
  },
  {
    id: 'L4-03', name: 'Sài Đồng', lineId: 'line-4',
    lat: 21.0300, lng: 105.9000, elevation: 8,
    status: 'construction',
    description: 'Ga trung tâm quận Long Biên phía Đông',
    address: 'Sài Đồng, Long Biên'
  },
  {
    id: 'L4-04', name: 'Vĩnh Tuy', lineId: 'line-4',
    lat: 21.0000, lng: 105.8750, elevation: 8,
    status: 'construction',
    description: 'Ga đầu cầu Vĩnh Tuy phía Nam',
    address: 'Vĩnh Tuy, Hai Bà Trưng'
  },
  {
    id: 'L4-05', name: 'Giáp Bát', lineId: 'line-4',
    lat: 20.9850, lng: 105.8415, elevation: 8,
    status: 'construction',
    description: 'Ga trung chuyển kết nối tuyến số 1',
    address: 'Đường Giải Phóng, Hoàng Mai'
  },
  {
    id: 'L4-06', name: 'Thượng Đình', lineId: 'line-4',
    lat: 21.0044, lng: 105.8080, elevation: 8,
    status: 'construction',
    description: 'Ga trung chuyển kết nối tuyến số 2A & 2',
    address: 'Đường Nguyễn Trãi, Thanh Xuân'
  },
  {
    id: 'L4-07', name: 'Láng', lineId: 'line-4',
    lat: 21.0125, lng: 105.8119, elevation: 7,
    status: 'construction',
    description: 'Ga kết nối tuyến số 2A',
    address: 'Đường Láng, Đống Đa'
  },
  {
    id: 'L4-08', name: 'Cổ Nhuế', lineId: 'line-4',
    lat: 21.0750, lng: 105.7800, elevation: 8,
    status: 'construction',
    description: 'Ga khu vực Cổ Nhuế, Bắc Từ Liêm',
    address: 'Cổ Nhuế, Bắc Từ Liêm'
  },
  {
    id: 'L4-09', name: 'Liên Hà', lineId: 'line-4',
    lat: 21.1000, lng: 105.6800, elevation: 10,
    status: 'construction',
    description: 'Ga cuối phía Tây Bắc tuyến số 4',
    address: 'Xã Liên Hà, Đan Phượng'
  }
];

// Tuyến 5: Văn Cao – Hòa Lạc
export const line5Stations: Station[] = [
  {
    id: 'L5-01', name: 'Văn Cao', lineId: 'line-5',
    lat: 21.0430, lng: 105.8170, elevation: 8,
    status: 'construction',
    description: 'Ga đầu tuyến Văn Cao gần Hồ Tây',
    address: 'Đường Văn Cao, Ba Đình'
  },
  {
    id: 'L5-02', name: 'Ngọc Khánh', lineId: 'line-5',
    lat: 21.0300, lng: 105.8120, elevation: 8,
    status: 'construction',
    description: 'Ga ngầm khu vực hồ Ngọc Khánh',
    address: 'Phố Nguyễn Chí Thanh, Ba Đình'
  },
  {
    id: 'L5-03', name: 'Láng', lineId: 'line-5',
    lat: 21.0125, lng: 105.8119, elevation: 7,
    status: 'construction',
    description: 'Ga kết nối trung chuyển tuyến số 2A',
    address: 'Đường Láng, Đống Đa'
  },
  {
    id: 'L5-04', name: 'Vành đai 3', lineId: 'line-5',
    lat: 20.9922, lng: 105.8044, elevation: 10,
    status: 'construction',
    description: 'Ga kết nối tuyến số 2A & 8',
    address: 'Đường Trần Duy Hưng, Cầu Giấy'
  },
  {
    id: 'L5-05', name: 'An Khánh', lineId: 'line-5',
    lat: 21.0000, lng: 105.7200, elevation: 10,
    status: 'construction',
    description: 'Ga kết nối khu đô thị Nam An Khánh',
    address: 'KĐT An Khánh, Hoài Đức'
  },
  {
    id: 'L5-06', name: 'Quốc Oai', lineId: 'line-5',
    lat: 20.9900, lng: 105.6300, elevation: 12,
    status: 'construction',
    description: 'Ga thị trấn Quốc Oai',
    address: 'Thị trấn Quốc Oai, Quốc Oai'
  },
  {
    id: 'L5-07', name: 'Hòa Lạc', lineId: 'line-5',
    lat: 20.9800, lng: 105.5300, elevation: 15,
    status: 'construction',
    description: 'Ga cuối tuyến số 5, KCN cao Hòa Lạc',
    address: 'Khu công nghệ cao Hòa Lạc, Thạch Thất'
  }
];

// Tuyến 6: Nội Bài – Phú Diễn – Ngọc Hồi
export const line6Stations: Station[] = [
  {
    id: 'L6-01', name: 'Sân bay Nội Bài', lineId: 'line-6',
    lat: 21.2200, lng: 105.8000, elevation: 12,
    status: 'construction',
    description: 'Ga xuất phát sân bay Nội Bài',
    address: 'Sân bay Nội Bài, Sóc Sơn'
  },
  {
    id: 'L6-02', name: 'Hải Bối', lineId: 'line-6',
    lat: 21.1100, lng: 105.7800, elevation: 9,
    status: 'construction',
    description: 'Ga khu vực Hải Bối, Đông Anh',
    address: 'Xã Hải Bối, Đông Anh'
  },
  {
    id: 'L6-03', name: 'Phú Diễn', lineId: 'line-6',
    lat: 21.04389, lng: 105.75528, elevation: 10,
    status: 'construction',
    description: 'Ga trung chuyển kết nối tuyến số 3',
    address: 'Đường Phú Diễn, Bắc Từ Liêm'
  },
  {
    id: 'L6-04', name: 'Mỹ Đình', lineId: 'line-6',
    lat: 21.0250, lng: 105.7700, elevation: 9,
    status: 'construction',
    description: 'Ga gần Sân vận động Quốc gia Mỹ Đình',
    address: 'Đường Lê Đức Thọ, Nam Từ Liêm'
  },
  {
    id: 'L6-05', name: 'Ngọc Hồi', lineId: 'line-6',
    lat: 20.9400, lng: 105.8400, elevation: 8,
    status: 'construction',
    description: 'Ga đầu mối liên kết tuyến số 1',
    address: 'Ga Ngọc Hồi, Thanh Trì'
  }
];

// Tuyến 7: Mê Linh – Nhổn – Hà Đông – Đại Áng
export const line7Stations: Station[] = [
  {
    id: 'L7-01', name: 'Mê Linh', lineId: 'line-7',
    lat: 21.1800, lng: 105.7200, elevation: 10,
    status: 'construction',
    description: 'Ga khởi đầu phía Bắc tuyến số 7',
    address: 'Mê Linh, Mê Linh'
  },
  {
    id: 'L7-02', name: 'Nhổn', lineId: 'line-7',
    lat: 21.05259, lng: 105.73523, elevation: 12,
    status: 'construction',
    description: 'Ga trung chuyển lớn phía Tây kết nối tuyến số 3',
    address: 'Quốc lộ 32, Từ Liêm'
  },
  {
    id: 'L7-03', name: 'Vân Canh', lineId: 'line-7',
    lat: 21.0200, lng: 105.7300, elevation: 11,
    status: 'construction',
    description: 'Ga khu đô thị Vân Canh, Hoài Đức',
    address: 'Vân Canh, Hoài Đức'
  },
  {
    id: 'L7-04', name: 'Tây Mỗ', lineId: 'line-7',
    lat: 21.0050, lng: 105.7500, elevation: 10,
    status: 'construction',
    description: 'Ga kết nối Tây Mỗ, Nam Từ Liêm',
    address: 'Tây Mỗ, Nam Từ Liêm'
  },
  {
    id: 'L7-05', name: 'Dương Nội', lineId: 'line-7',
    lat: 20.9800, lng: 105.7400, elevation: 10,
    status: 'construction',
    description: 'Ga kết nối KĐT Dương Nội, Hà Đông',
    address: 'KĐT Dương Nội, Hà Đông'
  },
  {
    id: 'L7-06', name: 'Hà Đông', lineId: 'line-7',
    lat: 20.97028, lng: 105.77500, elevation: 14,
    status: 'construction',
    description: 'Ga trung tâm quận Hà Đông kết nối tuyến 2A',
    address: 'Đường Quang Trung, Hà Đông'
  },
  {
    id: 'L7-07', name: 'Phú Lương', lineId: 'line-7',
    lat: 20.9400, lng: 105.7900, elevation: 8,
    status: 'construction',
    description: 'Ga khu vực Phú Lương',
    address: 'Phú Lương, Hà Đông'
  },
  {
    id: 'L7-08', name: 'Đại Áng', lineId: 'line-7',
    lat: 20.9200, lng: 105.8100, elevation: 8,
    status: 'construction',
    description: 'Ga cuối phía Nam tuyến số 7',
    address: 'Xã Đại Áng, Thanh Trì'
  }
];

// Tuyến 8: Sơn Đồng – Mai Dịch – Dương Xá
export const line8Stations: Station[] = [
  {
    id: 'L8-01', name: 'Sơn Đồng', lineId: 'line-8',
    lat: 21.0300, lng: 105.7000, elevation: 12,
    status: 'construction',
    description: 'Ga xuất phát phía Tây tuyến số 8',
    address: 'Xã Sơn Đồng, Hoài Đức'
  },
  {
    id: 'L8-02', name: 'Hoài Đức', lineId: 'line-8',
    lat: 21.0300, lng: 105.7200, elevation: 11,
    status: 'construction',
    description: 'Ga trung tâm huyện Hoài Đức',
    address: 'Thị trấn Trạm Trôi, Hoài Đức'
  },
  {
    id: 'L8-03', name: 'Mai Dịch', lineId: 'line-8',
    lat: 21.0370, lng: 105.7780, elevation: 9,
    status: 'construction',
    description: 'Ga kết nối đường vành đai 3 & tuyến số 3',
    address: 'Cầu vượt Mai Dịch, Cầu Giấy'
  },
  {
    id: 'L8-04', name: 'Vành Đai 3', lineId: 'line-8',
    lat: 20.9922, lng: 105.8044, elevation: 10,
    status: 'construction',
    description: 'Ga trung chuyển lớn, kết nối tuyến số 2A & 5',
    address: 'Ngã tư Nguyễn Trãi - Khuất Duy Tiến'
  },
  {
    id: 'L8-05', name: 'Lĩnh Nam', lineId: 'line-8',
    lat: 20.9800, lng: 105.8800, elevation: 8,
    status: 'construction',
    description: 'Ga khu vực Lĩnh Nam, Hoàng Mai',
    address: 'Đường Lĩnh Nam, Hoàng Mai'
  },
  {
    id: 'L8-06', name: 'Dương Xá', lineId: 'line-8',
    lat: 20.9900, lng: 105.9500, elevation: 8,
    status: 'construction',
    description: 'Ga cuối phía Đông, kết nối KĐT Gia Lâm',
    address: 'Xã Dương Xá, Gia Lâm'
  }
];

export const allStations: Station[] = [
  ...line2aStations,
  ...line3Stations,
  ...line1Stations,
  ...line2Stations,
  ...line4Stations,
  ...line5Stations,
  ...line6Stations,
  ...line7Stations,
  ...line8Stations
];

export function getStationById(id: string): Station | undefined {
  return allStations.find(s => s.id === id);
}

export function getStationsByLine(lineId: string): Station[] {
  return allStations.filter(s => s.lineId === lineId);
}

