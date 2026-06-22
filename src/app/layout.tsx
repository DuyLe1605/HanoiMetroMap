import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hanoi Metro Map - Bản đồ Metro Hà Nội 3D",
  description: "Mô phỏng 3D tuyến đường sắt đô thị Hà Nội. Xem tuyến Cát Linh - Hà Đông và Nhổn - Ga Hà Nội trên bản đồ tương tác.",
  keywords: "Hanoi Metro, đường sắt đô thị, Cát Linh, Hà Đông, Nhổn, metro Hà Nội, bản đồ 3D",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
