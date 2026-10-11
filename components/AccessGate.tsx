'use client';
import { useEffect, useState } from 'react';
import { ShieldCheck, MapPin, LockKeyhole } from 'lucide-react';
import Workspace from './Workspace';
import type { ApiResult, SessionInfo } from '@/lib/types';

export default function AccessGate() {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/session', { cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        const result: ApiResult<SessionInfo> = await response.json();
        if (!response.ok || 'error' in result) throw new Error('error' in result ? result.error : 'Không kiểm tra được phiên truy cập.');
        setSession(result.data);
      }).catch((reason: Error) => { if (reason.name !== 'AbortError') setError(reason.message); });
    return () => controller.abort();
  }, []);

  async function login(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true); setError('');
    try {
      const response = await fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ accessCode: code.trim() }) });
      const result: ApiResult<SessionInfo> = await response.json();
      if (!response.ok || 'error' in result) throw new Error('error' in result ? result.error : 'Không mở được phiên truy cập.');
      setCode(''); setSession(result.data);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Không kết nối được. Vui lòng thử lại.'); }
    finally { setBusy(false); }
  }

  if (session?.authenticated && session.csrfToken) return <Workspace csrfToken={session.csrfToken} />;
  return <main className="access-screen" style={{ minHeight: '100dvh', display: 'grid', placeItems: 'center', background: '#edf2f8', padding: 24 }}>
    <section className="access-card" style={{ maxWidth: 460, width: '100%', padding: 36, borderRadius: 18, background: 'white', boxShadow: '0 12px 48px #1d3a6e14' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#1d3a6e', marginBottom: 28 }}><ShieldCheck size={40} /><div><strong>QUẢN LÝ TRẬT TỰ XÂY DỰNG</strong><div style={{ fontSize: 14, marginTop: 4 }}>Tỉnh Sơn La · Bản đầu tại máy</div></div></div>
      <h1 style={{ fontSize: 27, marginBottom: 12 }}>Không gian quản lý toàn tỉnh</h1>
      <p style={{ color: '#64748b', lineHeight: 1.6 }}>Nhập giấy phép xây dựng, ghi nhận phản ánh và theo dõi vị trí trên bản đồ 75 xã, phường.</p>
      <form onSubmit={login} style={{ marginTop: 28 }}>
        <label htmlFor="access-code" style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}><LockKeyhole size={16} style={{ verticalAlign: 'middle', marginRight: 7 }} />Mã truy cập</label>
        <input id="access-code" name="accessCode" type="password" autoComplete="current-password" required value={code} onChange={(event) => setCode(event.target.value)} disabled={busy || (!session && !error)} style={{ width: '100%', padding: 13, border: '1px solid #cbd5e1', borderRadius: 8 }} />
        <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, marginTop: 10 }}>Mã riêng của bản tại máy được lưu trong tệp <code>data/access-code.txt</code> tại thư mục “Quan ly TTXD-tinh”.</p>
        {error && <p role="alert" style={{ color: '#b91c1c', fontSize: 14, margin: '12px 0' }}>{error}</p>}
        <button type="submit" disabled={busy || (!session && !error)} style={{ marginTop: 16, width: '100%', border: 0, borderRadius: 8, padding: 14, color: 'white', background: '#1d3a6e', cursor: 'pointer', fontWeight: 600 }}>{busy ? 'Đang mở…' : !session && !error ? 'Đang kiểm tra…' : 'Mở phần mềm'}</button>
      </form>
      <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 20, marginTop: 24, color: '#64748b', fontSize: 12, display: 'flex', gap: 8 }}><MapPin size={16} /><span>Dữ liệu nghiệp vụ lưu tại máy. Ranh giới đang dùng là dữ liệu tham khảo.</span></div>
    </section>
  </main>;
}
