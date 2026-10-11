import type { Position } from './types';
export type Geometry = { type: 'Polygon'; coordinates: number[][][] } | { type: 'MultiPolygon'; coordinates: number[][][][] };
export type BoundaryFeature = { type: 'Feature'; properties: { communeCode: string; name: string; type: string }; geometry: Geometry };
export type BoundaryCollection = { type: 'FeatureCollection'; features: BoundaryFeature[] };

function onSegment(x: number, y: number, a: number[], b: number[]) {
  const cross = (x - a[0]) * (b[1] - a[1]) - (y - a[1]) * (b[0] - a[0]);
  return Math.abs(cross) < 1e-12 && x >= Math.min(a[0], b[0]) - 1e-12 && x <= Math.max(a[0], b[0]) + 1e-12 && y >= Math.min(a[1], b[1]) - 1e-12 && y <= Math.max(a[1], b[1]) + 1e-12;
}

/** GeoJSON order is [longitude, latitude]. Ring edges count as inside. */
export function pointInRing(point: Position, ring: number[][]): boolean {
  if (!Number.isFinite(point.lng) || !Number.isFinite(point.lat) || ring.length < 4) return false;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[j], b = ring[i];
    if (onSegment(point.lng, point.lat, a, b)) return true;
    if ((a[1] > point.lat) !== (b[1] > point.lat) && point.lng < (b[0] - a[0]) * (point.lat - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}

export function pointInPolygon(point: Position, rings: number[][][]): boolean {
  return rings.length > 0 && pointInRing(point, rings[0]) && !rings.slice(1).some((ring) => pointInRing(point, ring));
}

export function pointInGeometry(point: Position, geometry: Geometry): boolean {
  if (geometry.type === 'Polygon') return pointInPolygon(point, geometry.coordinates as number[][][]);
  return (geometry.coordinates as number[][][][]).some((rings) => pointInPolygon(point, rings));
}

export function geometryBounds(geometry: Geometry): [[number, number], [number, number]] {
  let west = Infinity, south = Infinity, east = -Infinity, north = -Infinity;
  const visit = (value: unknown) => {
    if (!Array.isArray(value)) return;
    if (typeof value[0] === 'number') {
      west = Math.min(west, value[0]); south = Math.min(south, value[1]);
      east = Math.max(east, value[0]); north = Math.max(north, value[1]);
    }
    else value.forEach(visit);
  };
  visit(geometry.coordinates);
  return [[west, south], [east, north]];
}
