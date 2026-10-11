import test from 'node:test';
import assert from 'node:assert/strict';
import {pointInRing, pointInPolygon, pointInGeometry} from '../lib/geometry';
import {readFileSync} from 'node:fs';
const outer=[[0,0],[10,0],[10,10],[0,10],[0,0]];
const hole=[[3,3],[7,3],[7,7],[3,7],[3,3]];
test('ring interior, outside, vertex and edge',()=>{
 assert.equal(pointInRing({lng:1,lat:1},outer),true);
 assert.equal(pointInRing({lng:-1,lat:1},outer),false);
 assert.equal(pointInRing({lng:0,lat:0},outer),true);
 assert.equal(pointInRing({lng:10,lat:5},outer),true);
});
test('polygon excludes hole interior and hole boundary',()=>{
 assert.equal(pointInPolygon({lng:2,lat:5},[outer,hole]),true);
 assert.equal(pointInPolygon({lng:5,lat:5},[outer,hole]),false);
 assert.equal(pointInPolygon({lng:3,lat:5},[outer,hole]),false);
 assert.equal(pointInPolygon({lng:0,lat:5},[outer,hole]),true);
});
test('multipolygon includes disjoint island',()=>{
 const island=outer.map(([x,y])=>[x+20,y]);
 const geometry={type:'MultiPolygon' as const,coordinates:[[outer,hole],[island]]};
 assert.equal(pointInGeometry({lng:25,lat:5},geometry),true);
 assert.equal(pointInGeometry({lng:15,lat:5},geometry),false);
});
test('geodata and commune directory contain exactly 75 unique matching codes',()=>{
 const communes=JSON.parse(readFileSync(new URL('../lib/communes.json',import.meta.url),'utf8')) as {code:string;name:string}[];
 assert.equal(communes.length,75);
 assert.equal(new Set(communes.map(c=>c.code)).size,75);
 const full=JSON.parse(readFileSync(new URL('../geodata/sonla.full.geojson',import.meta.url),'utf8'));
 const display=JSON.parse(readFileSync(new URL('../public/data/sonla-communes.geojson',import.meta.url),'utf8'));
 assert.equal(full.features.length,75);assert.equal(display.features.length,75);
 const propertyCode=(f:{properties:Record<string,string>})=>f.properties.code || f.properties.communeCode || f.properties.ma;
 assert.deepEqual(full.features.map(propertyCode).sort(),communes.map(c=>c.code).sort());
 assert.deepEqual(display.features.map(propertyCode).sort(),communes.map(c=>c.code).sort());
});
