'use client';

import { useMetroStore } from '@/store/useMetroStore';
import { metroLines } from '@/data/lines';

export default function InfoDialog() {
  const showInfoDialog = useMetroStore(s => s.showInfoDialog);
  const setShowInfoDialog = useMetroStore(s => s.setShowInfoDialog);

  if (!showInfoDialog) return null;

  return (
    <div className="info-dialog-overlay" onClick={() => setShowInfoDialog(false)}>
      <div className="info-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="info-dialog-header">
          <h2>Về bản đồ này</h2>
          <button className="info-close-btn" onClick={() => setShowInfoDialog(false)}>✕</button>
        </div>

        {/* Scrollable content */}
        <div className="info-dialog-body">
          <section className="info-section">
            <p className="info-desc">
              Bản đồ 3D trực quan hóa hệ thống metro Hà Nội, bao gồm độ sâu/cao và độ dốc dựa trên dữ liệu thực tế. 
              Bạn có thể nhìn thấy mối quan hệ giữa địa hình thành phố và tuyến đường sắt đô thị.
            </p>
            <p className="info-desc info-desc--highlight">
              Tuyến đường và các ga: <strong>đậm = đoạn đang vận hành</strong>, <em>mờ = đoạn đang xây dựng</em>.
            </p>
          </section>

          <section className="info-section">
            <h3 className="info-section-title">📐 Cao độ & Mặt cắt</h3>
            <ul className="info-list">
              <li>Cao độ dựa trên dữ liệu thực tế từ bản vẽ thiết kế, tính theo mực nước biển (TP).</li>
              <li>Độ sâu/cao ga được tính từ mặt đất đến mặt ray.</li>
              <li>Phương đứng được phóng đại ~10 lần để dễ quan sát.</li>
            </ul>
          </section>

          <section className="info-section">
            <h3 className="info-section-title">🚇 Các tuyến</h3>
            <div className="info-lines-grid">
              {metroLines.map(line => (
                <div key={line.id} className="info-line-item">
                  <span className="info-line-badge" style={{ backgroundColor: line.color }}>
                    {line.nameShort}
                  </span>
                  <div className="info-line-details">
                    <span className="info-line-name">{line.name}</span>
                    <span className="info-line-meta">{line.totalLength} · {line.frequency}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="info-section">
            <h3 className="info-section-title">📊 Nguồn dữ liệu</h3>
            <ul className="info-list">
              <li>Bộ Giao thông Vận tải — Tài liệu thiết kế tuyến đường sắt đô thị</li>
              <li>Ban quản lý Dự án Đường sắt (MRB) — Số liệu kỹ thuật</li>
              <li>Hanoi Metro Company — Thông tin vận hành tuyến 2A</li>
              <li>MRB Line 3 — Tài liệu tuyến Nhổn – Ga Hà Nội</li>
              <li>Dữ liệu địa hình Hà Nội — Bản đồ cao độ SRTM/DEM</li>
            </ul>
          </section>

          <section className="info-section">
            <h3 className="info-section-title">ℹ️ Lưu ý</h3>
            <p className="info-desc info-desc--dim">
              Dữ liệu mang tính tham khảo, các giá trị cao độ và vị trí ga có thể có sai lệch so với thực tế.
              Tuyến 3 đoạn ngầm (Kim Mã – Ga Hà Nội) đang xây dựng, dữ liệu dựa trên thiết kế.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
