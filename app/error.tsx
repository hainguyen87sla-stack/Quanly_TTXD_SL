'use client';
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <main className="access-screen"><div className="access-card"><h1>Chưa mở được phần mềm</h1><p>Có lỗi khi tải giao diện. Dữ liệu đã lưu vẫn được giữ tại máy.</p><button className="button button-primary" onClick={reset}>Thử lại</button></div></main>;
}
