import type { RasterSourceSpecification } from 'maplibre-gl';

export type BasemapId = 'street' | 'satellite' | 'google-road' | 'google-satellite' | 'google-hybrid';
export const GOOGLE_MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_TILE_API_KEY?.trim() || '';
export const BASEMAPS: { id: BasemapId; label: string; google?: boolean }[] = [
  { id: 'google-hybrid', label: 'Vệ tinh Google Hybrid' },
  { id: 'street', label: 'Đường phố' },
  { id: 'satellite', label: 'Vệ tinh' },
  { id: 'google-road', label: 'Google đường phố', google: true },
  { id: 'google-satellite', label: 'Google vệ tinh', google: true },
];
export const STREET_SOURCE: RasterSourceSpecification = {
  type: 'raster', tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
  tileSize: 256, maxzoom: 19,
  attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
};
export const SATELLITE_SOURCE: RasterSourceSpecification = {
  type: 'raster', tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
  tileSize: 256, maxzoom: 19,
  attribution: 'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community',
};
// Same imagery and POI layer as the Thao Nguyen reference application.
export const GOOGLE_HYBRID_SOURCE: RasterSourceSpecification = {
  type: 'raster', tileSize: 256, maxzoom: 20,
  tiles: ['https://mt0.google.com/vt/lyrs=y&hl=vi&x={x}&y={y}&z={z}'],
  attribution: '© Google Maps',
};
export const REFERENCE_SOURCES: { id: string; source: RasterSourceSpecification }[] = [
  { id: 'reference-roads', source: { type: 'raster', tileSize: 256, maxzoom: 23,
    tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}'],
    attribution: 'Roads: Esri, HERE, Garmin, © OpenStreetMap contributors' } },
  { id: 'reference-places', source: { type: 'raster', tileSize: 256, maxzoom: 23,
    tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}'],
    attribution: 'Places: Esri, HERE, Garmin, © OpenStreetMap contributors, and the GIS user community' } },
];
type GoogleSession = { session: string; expiry: string; tileWidth: number };
const sessions = new Map<BasemapId, GoogleSession>();
export async function resolveBasemap(id: BasemapId, signal: AbortSignal): Promise<{ source: RasterSourceSpecification; session?: string }> {
  if (id === 'google-hybrid') return { source: GOOGLE_HYBRID_SOURCE };
  if (id === 'street') return { source: STREET_SOURCE };
  if (id === 'satellite') return { source: SATELLITE_SOURCE };
  if (!GOOGLE_MAPS_KEY) throw new Error('Chưa cấu hình khóa Google Maps. Hãy chọn nền đường phố hoặc vệ tinh.');
  let session = sessions.get(id);
  if (!session || Number(session.expiry) * 1000 <= Date.now() + 60_000) {
    const response = await fetch(`https://tile.googleapis.com/v1/createSession?key=${encodeURIComponent(GOOGLE_MAPS_KEY)}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal,
      referrerPolicy: 'strict-origin-when-cross-origin',
      body: JSON.stringify({ mapType: id === 'google-road' ? 'roadmap' : 'satellite', language: 'vi-VN', region: 'VN', ...(id === 'google-satellite' ? { layerTypes: ['layerRoadmap'] } : {}) }),
    });
    if (!response.ok) throw new Error('Chưa mở được nền Google. Kiểm tra khóa API, hạn mức và kết nối mạng.');
    const result = await response.json() as GoogleSession;
    if (!result.session || !Number.isFinite(Number(result.expiry)) || result.tileWidth !== 256) throw new Error('Google trả về cấu hình bản đồ không hợp lệ.');
    session = result; sessions.set(id, session);
  }
  return { session: session.session, source: { type: 'raster', tileSize: session.tileWidth, maxzoom: 22,
    tiles: [`https://tile.googleapis.com/v1/2dtiles/{z}/{x}/{y}?session=${encodeURIComponent(session.session)}&key=${encodeURIComponent(GOOGLE_MAPS_KEY)}`] } };
}
export async function googleCopyright(session: string, viewport: { zoom: number; north: number; south: number; east: number; west: number }, signal: AbortSignal): Promise<string> {
  const params = new URLSearchParams({ key: GOOGLE_MAPS_KEY, session });
  for (const [key, value] of Object.entries(viewport)) params.set(key, String(value));
  const response = await fetch(`https://tile.googleapis.com/tile/v1/viewport?${params}`, { signal, referrerPolicy: 'strict-origin-when-cross-origin' });
  if (!response.ok) throw new Error('Không tải được thông tin nguồn bản đồ Google.');
  const data = await response.json() as { copyright?: string };
  if (!data.copyright) throw new Error('Thiếu thông tin nguồn bản đồ Google.');
  return data.copyright;
}
