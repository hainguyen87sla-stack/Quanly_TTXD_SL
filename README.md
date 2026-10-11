# Quản lý trật tự xây dựng tỉnh Sơn La

Dự án mở rộng hệ thống quản lý trật tự xây dựng hiện có để điều hành toàn tỉnh và quản lý theo 75 xã, phường — phạm vi do người dùng yêu cầu.

Ngày lập: 10/10/2026. Trạng thái: đã xây dựng bản đầu độc lập chạy tại máy; gồm giao diện tỉnh, nhập GPXD và phản ánh tại vị trí bản đồ, lưu SQLite mã hóa. Kết quả kiểm thử cập nhật trong `docs/TEST_REPORT.md`.

Đọc kế hoạch tại [KE_HOACH_TRIEN_KHAI.md](./KE_HOACH_TRIEN_KHAI.md).

Giao diện và quy trình được xây dựng theo cách sử dụng quen thuộc của phần mềm quản lý trật tự xây dựng phường Thảo Nguyên, sau đó mở rộng cho phạm vi tỉnh Sơn La. Bản đầu dùng khung độc lập, không sao chép cấu hình, tài khoản hoặc cơ sở dữ liệu.

Mục tiêu: giữ cách sử dụng quen thuộc, mở rộng bản đồ và báo cáo toàn tỉnh, phân quyền theo vai trò và địa bàn, liên kết giấy phép – công trình – phản ánh – kiểm tra – vi phạm.

## Mở bản đầu

Truy cập `http://127.0.0.1:3100` khi ứng dụng đang chạy. Mã truy cập tại `data/access-code.txt`, tự tạo khi mở trang lần đầu; giữ riêng mã này. Đọc `HUONG_DAN_SU_DUNG.md`.

Yêu cầu Node.js 24 trở lên. Cài đặt bằng `npm ci`, kiểm tra bằng `npm run verify`, chạy bản đã build bằng `npm start`. Các lệnh chạy mặc định chỉ lắng nghe tại máy này.

`npm run test:e2e` khởi động máy chủ kiểm thử riêng trên cổng 3100 và dùng thư mục dữ liệu tạm; cần dừng ứng dụng đang chạy trước khi thực hiện. Ảnh và kết quả kiểm thử tại `test-results/`, không dùng làm dữ liệu thật.

## Dữ liệu và giới hạn

GPXD và phản ánh được lưu thật trong `data/ttxd.sqlite`, toàn bộ nội dung mã hóa AES-256-GCM bằng `data/secret.key`. Không xóa khóa: mất khóa sẽ không đọc lại được nội dung. Không chỉ sao lưu SQLite mà bỏ quên khóa. Người có quyền hệ điều hành đọc cả tệp và khóa vẫn có thể giải mã.

Bản hiện tại dùng một mã truy cập tại máy. Chưa có tài khoản riêng tỉnh/xã, phân quyền 75 địa bàn hoặc cổng công dân công khai; “Ghi phản ánh” là thao tác của cán bộ/người dùng đã mở phiên tại máy. Chưa kết nối Supabase, chưa phát hành trên Internet. Kế hoạch mở rộng vẫn nằm trong `KE_HOACH_TRIEN_KHAI.md`.

Ranh giới gồm 75 mã duy nhất từ bộ dữ liệu dự án bản đồ Sơn La, có nguồn và SHA-256 trong `geodata/provenance.json`. Một hình học xã Mường Bám đã chuẩn hóa lỗi tự cắt; bản gốc giữ ở `geodata/source-original.geojson`. Ranh giới này chỉ tham khảo, chưa xác nhận pháp lý. Bản đồ hiển thị dùng geometry đơn giản hóa; máy chủ kiểm tra vị trí bằng geometry đầy đủ. Nền bản đồ cần kết nối mạng với nhà cung cấp tương ứng; mặc định là Google Hybrid cùng nguồn bản phường Thảo Nguyên, có tên địa điểm/đường và biểu tượng trong ảnh; có tùy chọn vệ tinh Esri World Imagery và đường phố OpenStreetMap.

Bản đồ có bộ chọn nền đường phố/vệ tinh, bật/tắt ranh giới và trở về toàn tỉnh. Google Map Tiles API đã có tùy chọn tích hợp, chưa bật khi chưa có khóa API. Cách cấu hình và giới hạn sử dụng tại [BAN_DO_NEN.md](./docs/BAN_DO_NEN.md).

Rà soát bảo mật tại `docs/SECURITY_REVIEW.md`.
