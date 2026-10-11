import communes from './communes.json';
import type { Position, Commune } from './types';
import { pointInGeometry, geometryBounds, type BoundaryCollection } from './geometry';
let cached: BoundaryCollection | null = null;

/** Call once when the map loads; geometry here is for display and suggestion only. */
export function setDisplayBoundaries(data: BoundaryCollection) { cached = data; }
export function resolveCommune(point: Position): Commune | null {
  if (!cached) return null;
  const matches = cached.features.filter((feature) => pointInGeometry(point, feature.geometry));
  return matches.length === 1 ? communes.find((c) => c.code === matches[0].properties.communeCode) ?? null : null;
}
export function getCommuneBounds(code: string): [[number, number], [number, number]] | null {
  const feature = cached?.features.find((f) => f.properties.communeCode === code);
  return feature ? geometryBounds(feature.geometry) : null;
}
export { pointInRing, pointInPolygon, pointInGeometry } from './geometry';
