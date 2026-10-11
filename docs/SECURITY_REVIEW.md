# Rà soát bảo mật bản đầu tại máy — 10/10/2026

Phạm vi: nhập GPXD và phản ánh vào SQLite tại máy, phiên truy cập nội bộ, bản đồ 75 xã/phường. Chưa xác nhận để triển khai đa người dùng hoặc đưa ứng dụng lên Internet.

## Kiểm tra đã xác nhận

- Kiểm tra mức mã nguồn và unit: API nghiệp vụ yêu cầu phiên; ghi kiểm tra CSRF, Host, Origin và Sec-Fetch-Site. Cookie HttpOnly, SameSite=Strict, phiên hết hạn sau 8 giờ; token ngẫu nhiên và chỉ băm token trong bảng phiên. Đăng xuất xóa phiên.
- SQL tham số hóa; nội dung người dùng hiển thị qua React hoặc textContent. Không phát hiện dùng hồ sơ làm HTML.
- Máy chủ kiểm tra ngày có thật, ngày tương lai, số tầng/diện tích, tọa độ hữu hạn, mã địa bàn đúng đa giác, enum, độ dài, ký tự điều khiển và trường dư. Không gán xã theo centroid; điểm nhiều địa bàn trùng nhau phải xác minh.
- Toàn bộ nội dung hồ sơ SQLite được mã hóa AES-256-GCM; khóa trùng giấy phép dùng SHA-256. Kiểm thử kiểm tra tên, số điện thoại, số GPXD, tiêu đề, nội dung và địa chỉ không xuất hiện dạng rõ trong file SQLite. Thay đổi bản mã bị từ chối.
- Dữ liệu còn sau khi đọc bằng tiến trình mới. Khi SQLite có dữ liệu nhưng mất khóa, ứng dụng từ chối và không tự tạo khóa thay thế.
- Thư mục lưu dữ liệu 0700, tệp khóa 0600. Dữ liệu/mã truy cập/ảnh kiểm thử loại khỏi Git.

Kiểm tra HTTP và trình duyệt thực tế hoàn tất: 13/13 nhóm đạt, gồm từ chối đọc/ghi không phiên, Host/Origin/cross-site, CSRF và dữ liệu lỗi, lưu GPXD/phản ánh qua bản đồ rồi tải lại, mã hóa trên đĩa, đăng xuất; xem TEST_REPORT.md. CSP production không cho unsafe-eval, có frame-ancestors none/object-src none; còn unsafe-inline cho Next.js cần chuyển nonce trước khi công khai.

## Giới hạn vận hành

Mã truy cập dùng chung tại máy chưa phải định danh cá nhân, phân quyền tỉnh/xã, MFA hoặc nhật ký nghiệp vụ chống sửa. Các lớp này cần triển khai và nghiệm thu trước vận hành cấp tỉnh. Không có đăng ký công khai cho công dân; ghi phản ánh là thao tác của người có phiên tại máy.

Mã hóa bảo vệ bản sao SQLite bị lấy riêng khi không có khóa tương ứng. Khóa nằm trên cùng máy, trong thư mục dữ liệu, nên người có quyền truy cập hệ điều hành có thể đọc khóa và giải mã. Không phải biện pháp chống người quản trị máy. Sao lưu phải giữ cả SQLite và secret.key; mất khóa sẽ không đọc lại được nội dung.

Bản đồ nền OpenStreetMap, Esri World Imagery hoặc Google (khi được cấu hình) tạo yêu cầu mạng đến nhà cung cấp tile, tiết lộ IP và khu vực được xem; ứng dụng không gửi nội dung hồ sơ đến nhà cung cấp tile. Khi mất mạng, ranh giới và hồ sơ tại máy còn truy cập nhưng nền bản đồ có thể thiếu.

Chưa thực hiện kiểm thử xâm nhập độc lập, khôi phục bản sao lưu, phân quyền cấp tỉnh/xã, máy chủ production, tải đồng thời quy mô tỉnh hay đánh giá tuân thủ xử lý dữ liệu cá nhân. Ranh giới là nguồn tham khảo, chưa được xác nhận pháp lý; nguồn có một đa giác Mường Bám tự cắt đã được chuẩn hóa, bản gốc được giữ và lý do được công bố trong geodata/provenance.json.

## Cập nhật bản đồ nền — 11/10/2026

CSP chỉ bổ sung img/connect cho server.arcgisonline.com và tile.googleapis.com, giữ các hạn chế script/worker/frame/API. Referrer-Policy là strict-origin-when-cross-origin để khóa Google giới hạn theo HTTP referrer hoạt động; không gửi đường dẫn trang trong yêu cầu ngoài origin. Khóa Google là khóa trình duyệt giới hạn riêng Map Tiles API và origin, không thay thế khóa mã hóa local. Không gửi payload GPXD/phản ánh tới dịch vụ bản đồ. Google chưa bật, chưa xác minh với khóa thật; cần cấu hình quota trước khi dùng.

## Google Hybrid theo bản tham khảo — 11/10/2026

Bổ sung duy nhất origin mt0.google.com vào img/connect CSP để tải lớp Google Hybrid cùng endpoint tile cũ của bản phường Thảo Nguyên. Các hạn chế script/worker/frame/API giữ nguyên. Nền này không cần khóa Map Tiles API, không dùng session chính thức; hai lựa chọn Map Tiles API vẫn cần khóa. Chỉ gửi tọa độ tile/mức zoom và ngôn ngữ cho nhà cung cấp, không gửi payload GPXD/phản ánh; không cache ảnh/POI vào SQLite. Nhãn theo dữ liệu nhà cung cấp, không đảm bảo đầy đủ mọi vị trí.
