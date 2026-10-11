import { readFileSync } from 'node:fs';
import path from 'node:path';
import { pointInGeometry, geometryBounds, type BoundaryCollection } from './geometry';
import type { Position, Commune } from './types';

let cached: BoundaryCollection | undefined;
let indexed: { feature: BoundaryCollection['features'][number]; bounds: [[number, number], [number, number]] }[] | undefined;
function boundaries() {
  if (!cached) cached = JSON.parse(readFileSync(path.join(process.cwd(), 'geodata/sonla.full.geojson'), 'utf8')) as BoundaryCollection;
  return cached;
}

/** Uses full geometry. Multiple hits on a shared edge require human verification. */
export function resolveCommune(point: Position): Commune | null {
  if (!indexed) indexed = boundaries().features.map((feature) => ({ feature, bounds: geometryBounds(feature.geometry) }));
  const matches = indexed.filter(({ feature, bounds }) => {
    const [[west, south], [east, north]] = bounds;
    return point.lng >= west && point.lng <= east && point.lat >= south && point.lat <= north && pointInGeometry(point, feature.geometry);
  });
  if (matches.length !== 1) return null;
  const p = matches[0].feature.properties;
  return { code: p.communeCode, name: p.name, type: p.type };
}
