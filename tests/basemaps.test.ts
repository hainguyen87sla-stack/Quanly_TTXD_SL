import test from 'node:test';
import assert from 'node:assert/strict';

test('basemap sources and official Google session/attribution requests use synthetic credentials only', async (t) => {
 const originalFetch=globalThis.fetch;
 const originalKey=process.env.NEXT_PUBLIC_GOOGLE_MAPS_TILE_API_KEY;
 process.env.NEXT_PUBLIC_GOOGLE_MAPS_TILE_API_KEY='qa-synthetic-key';
 const basemaps=await import('../lib/basemaps');
 const signal=new AbortController().signal;
 const calls:{url:string;init?:RequestInit}[]=[];
 let response:()=>Response=()=>Response.json({});
 globalThis.fetch=async(input,init)=>{calls.push({url:String(input),init});return response();};
 try {
  await t.test('available free sources resolve without requesting a Google session',async()=>{
   assert.equal((await basemaps.resolveBasemap('street',signal)).source,basemaps.STREET_SOURCE);
   assert.equal((await basemaps.resolveBasemap('satellite',signal)).source,basemaps.SATELLITE_SOURCE);
   assert.equal(calls.length,0);
   assert.match(basemaps.SATELLITE_SOURCE.tiles![0],/World_Imagery.*\{z\}\/\{y\}\/\{x\}/);
   assert.match(basemaps.STREET_SOURCE.attribution!,/OpenStreetMap/);
   assert.match(basemaps.SATELLITE_SOURCE.attribution!,/Esri/);
  });
  await t.test('failed or malformed Google sessions do not produce a tile source',async()=>{
   response=()=>new Response('',{status:403});
   await assert.rejects(basemaps.resolveBasemap('google-road',signal),/Chưa mở được nền Google/);
   response=()=>Response.json({session:'qa-invalid',expiry:'invalid',tileWidth:256});
   await assert.rejects(basemaps.resolveBasemap('google-road',signal),/không hợp lệ/);
   response=()=>Response.json({session:'qa-invalid',expiry:String(Date.now()/1000+3600),tileWidth:512});
   await assert.rejects(basemaps.resolveBasemap('google-road',signal),/không hợp lệ/);
  });
  await t.test('roadmap uses official sessions, refreshes expiration, and reuses a valid session',async()=>{
   calls.length=0;
   response=()=>Response.json({session:'qa-expired',expiry:'0',tileWidth:256});
   await basemaps.resolveBasemap('google-road',signal);
   response=()=>Response.json({session:'qa-road-valid',expiry:String(Math.floor(Date.now()/1000)+3600),tileWidth:256});
   const resolved=await basemaps.resolveBasemap('google-road',signal);
   assert.equal(calls.length,2);
   const url=new URL(calls[1].url);assert.equal(url.origin,'https://tile.googleapis.com');assert.equal(url.pathname,'/v1/createSession');assert.equal(url.searchParams.get('key'),'qa-synthetic-key');
   assert.equal(calls[1].init?.method,'POST');assert.equal(calls[1].init?.signal,signal);
   assert.deepEqual(JSON.parse(String(calls[1].init?.body)),{mapType:'roadmap',language:'vi-VN',region:'VN'});
   assert.equal(resolved.session,'qa-road-valid');assert.equal(resolved.source.tileSize,256);
   assert.match(resolved.source.tiles![0],/\/v1\/2dtiles\/\{z\}\/\{x\}\/\{y\}\?session=qa-road-valid&key=qa-synthetic-key$/);
   await basemaps.resolveBasemap('google-road',signal);assert.equal(calls.length,2,'valid roadmap session reused');
  });
  await t.test('satellite session includes road labels and remains distinct from roadmap',async()=>{
   calls.length=0;
   response=()=>Response.json({session:'qa-satellite',expiry:String(Math.floor(Date.now()/1000)+3600),tileWidth:256});
   const resolved=await basemaps.resolveBasemap('google-satellite',signal);
   assert.equal(calls.length,1);assert.equal(resolved.session,'qa-satellite');
   assert.deepEqual(JSON.parse(String(calls[0].init?.body)),{mapType:'satellite',language:'vi-VN',region:'VN',layerTypes:['layerRoadmap']});
  });
  await t.test('viewport attribution follows the exact viewport and rejects missing copyright',async()=>{
   calls.length=0;const viewport={zoom:13,north:21.5,south:21.1,east:104.2,west:103.8};
   response=()=>Response.json({copyright:'QA Synthetic Provider'});
   assert.equal(await basemaps.googleCopyright('qa-satellite',viewport,signal),'QA Synthetic Provider');
   const url=new URL(calls[0].url);assert.equal(url.origin,'https://tile.googleapis.com');assert.equal(url.pathname,'/tile/v1/viewport');assert.equal(url.searchParams.get('session'),'qa-satellite');
   for(const [key,value] of Object.entries(viewport))assert.equal(url.searchParams.get(key),String(value));
   response=()=>Response.json({});await assert.rejects(basemaps.googleCopyright('qa-satellite',viewport,signal),/Thiếu thông tin nguồn/);
   response=()=>new Response('',{status:403});await assert.rejects(basemaps.googleCopyright('qa-satellite',viewport,signal),/Không tải được thông tin nguồn/);
  });
 } finally {
  globalThis.fetch=originalFetch;
  if(originalKey===undefined)delete process.env.NEXT_PUBLIC_GOOGLE_MAPS_TILE_API_KEY;else process.env.NEXT_PUBLIC_GOOGLE_MAPS_TILE_API_KEY=originalKey;
 }
});
