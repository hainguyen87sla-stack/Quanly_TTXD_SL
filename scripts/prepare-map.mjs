import { copyFileSync } from 'node:fs';
// MapLibre v6 uses an ES module worker. Keep the worker at the same origin,
// with the exact installed version rather than relying on an external CDN.
for (const name of ['maplibre-gl-worker.mjs', 'maplibre-gl-shared.mjs']) {
  copyFileSync(`node_modules/maplibre-gl/dist/${name}`, `public/${name}`);
}
