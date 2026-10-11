import type { Metadata } from 'next';
import './globals.css';
import 'maplibre-gl/dist/maplibre-gl.css';
export const metadata: Metadata = {
  title: 'Quản lý trật tự xây dựng · Sơn La',
  description: 'Bản đầu quản lý GPXD và phản ánh trên bản đồ tỉnh Sơn La.',
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="vi"><body>{children}</body></html>;
}
