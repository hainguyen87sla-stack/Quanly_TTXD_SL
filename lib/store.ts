import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, existsSync, readFileSync, writeFileSync, chmodSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { randomBytes, randomUUID, createCipheriv, createDecipheriv, createHash, timingSafeEqual } from 'node:crypto';
import type { PermitInput, ReportInput, Permit, CitizenReport } from './types';
let database: DatabaseSync | undefined;
export const dataDirectory = () => process.env.TTXD_DATA_DIR || join(process.cwd(), 'data');
function privateFile(name: string, make: () => Buffer): Buffer {
  const dir = dataDirectory(); mkdirSync(dir, { recursive: true, mode: 0o700 }); chmodSync(dir, 0o700);
  const path = join(dir, name);
  if (!existsSync(path)) {
    if (name === 'secret.key' && existsSync(join(dir,'ttxd.sqlite')) && statSync(join(dir,'ttxd.sqlite')).size > 0) throw new Error('Missing encryption key for existing database. Restore matching key.');
    try { writeFileSync(path, make(), { mode: 0o600, flag: 'wx' }); } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error; }
  }
  chmodSync(path, 0o600); return readFileSync(path);
}
function db() {
  if (!database) {
    privateFile('secret.key', () => randomBytes(32));
    privateFile('access-code.txt', () => Buffer.from(randomBytes(24).toString('base64url') + '\n'));
    const path = join(dataDirectory(), 'ttxd.sqlite');
    privateFile('ttxd.sqlite', () => Buffer.alloc(0));
    database = new DatabaseSync(path);
    database.exec(`PRAGMA journal_mode=DELETE; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
      CREATE TABLE IF NOT EXISTS permits(id TEXT PRIMARY KEY, duplicate_key TEXT NOT NULL UNIQUE, payload TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS reports(id TEXT PRIMARY KEY, payload TEXT NOT NULL);
      CREATE TABLE IF NOT EXISTS sessions(hash TEXT PRIMARY KEY, csrf TEXT NOT NULL, expires INTEGER NOT NULL);`);
  } return database;
}
const digest = (s: string) => createHash('sha256').update(s).digest('hex');
export function encrypt(value: string) {
  const iv = randomBytes(12); const cipher = createCipheriv('aes-256-gcm', privateFile('secret.key', () => randomBytes(32)), iv);
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  return [iv, cipher.getAuthTag(), encrypted].map(b => b.toString('base64')).join('.');
}
export function decrypt(value: string) {
  const [iv, tag, body] = value.split('.').map(v => Buffer.from(v, 'base64'));
  const cipher = createDecipheriv('aes-256-gcm', privateFile('secret.key', () => randomBytes(32)), iv); cipher.setAuthTag(tag);
  return Buffer.concat([cipher.update(body), cipher.final()]).toString('utf8');
}
export function verifyAccessCode(value: string) {
  db(); const expected = digest(privateFile('access-code.txt', () => Buffer.from(randomBytes(24).toString('base64url')+'\n')).toString().trim());
  return timingSafeEqual(Buffer.from(digest(value)), Buffer.from(expected));
}
export function createSession() {
  const token = randomBytes(32).toString('base64url'), csrf = randomBytes(32).toString('base64url');
  db().prepare('DELETE FROM sessions WHERE expires < ?').run(Date.now());
  db().prepare('INSERT INTO sessions VALUES(?,?,?)').run(digest(token), csrf, Date.now()+8*60*60*1000);
  return { token, csrf };
}
export function findSession(token: string) {
  return db().prepare('SELECT csrf, expires FROM sessions WHERE hash=? AND expires>?').get(digest(token), Date.now()) as {csrf:string;expires:number}|undefined;
}
export function deleteSession(token: string) { db().prepare('DELETE FROM sessions WHERE hash=?').run(digest(token)); }
export function insertPermit(input: PermitInput): Permit {
  const record: Permit = {...input,id:randomUUID(),createdAt:new Date().toISOString(),status:'active'};
  const duplicate = [input.issuingAuthority.trim().toLocaleLowerCase('vi'),input.permitNumber.trim().toLocaleLowerCase('vi'),input.issueDate.slice(0,4)].join('|');
  db().prepare('INSERT INTO permits VALUES(?,?,?)').run(record.id,digest(duplicate),JSON.stringify({version:1,ciphertext:encrypt(JSON.stringify(record))})); return record;
}
export function insertReport(input: ReportInput): CitizenReport {
  const record: CitizenReport = {...input,id:randomUUID(),publicCode:'PA-'+randomBytes(6).toString('hex').toUpperCase(),createdAt:new Date().toISOString(),status:'received'};
  db().prepare('INSERT INTO reports VALUES(?,?)').run(record.id,JSON.stringify({version:1,ciphertext:encrypt(JSON.stringify(record))})); return record;
}
function decodePayload<T>(payload:string):T {
  const envelope=JSON.parse(payload);
  if(envelope.version !== 1 || typeof envelope.ciphertext !== 'string') throw new Error('Unsupported encrypted payload format.');
  return JSON.parse(decrypt(envelope.ciphertext)) as T;
}
export function listRecords() {
  const permits = db().prepare('SELECT payload FROM permits ORDER BY rowid DESC').all().map(row => {return decodePayload<Permit>(row.payload as string);});
  const reports = db().prepare('SELECT payload FROM reports ORDER BY rowid DESC').all().map(row => {return decodePayload<CitizenReport>(row.payload as string);});
  return {permits,reports};
}
