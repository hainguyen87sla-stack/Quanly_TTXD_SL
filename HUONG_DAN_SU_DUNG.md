# Hướng dẫn sử dụng bản đầu

Ứng dụng chạy tại máy này tại `http://127.0.0.1:3100`. Mở tệp `MO_PHAN_MEM.command` để khởi động lại khi cần. Mã truy cập nằm trong `data/access-code.txt`; tự tạo khi mở trang lần đầu. Nhập mã rồi bấm **Mở phần mềm**.

## Nhập GPXD

1. Bấm **Nhập GPXD** từ Tổng quan, Bản đồ hoặc danh sách.
2. Nhập số giấy phép, ngày cấp, cơ quan cấp, chủ đầu tư, tên công trình, diện tích, số tầng và địa chỉ.
3. Bấm **Chọn vị trí trên bản đồ**. Có thể chọn địa bàn trên thanh lọc để phóng tới xã/phường.
4. Bấm điểm công trình; biểu mẫu mở lại, giữ thông tin đã nhập và điền tọa độ cùng địa bàn gợi ý. Kiểm tra trước khi lưu. Có thể nhập tọa độ trực tiếp nếu đã biết vị trí chính xác.
5. Bấm **Lưu hồ sơ**. Hồ sơ được lưu thật, hiển thị điểm trên bản đồ và có thể tìm lại trong **Giấy phép xây dựng**.

Ngày cấp không được ở tương lai; diện tích và số tầng phải hợp lệ. Số GPXD trùng cùng năm/cơ quan cấp bị từ chối. Vị trí ngoài tỉnh, sai địa bàn hoặc ngay ranh chung chưa xác định được sẽ có hướng dẫn sửa.

## Ghi phản ánh người dân

1. Bấm **Ghi phản ánh**, nhập tiêu đề, nhóm phản ánh, nội dung và địa chỉ; tên/điện thoại là tùy chọn.
2. Chọn vị trí trên bản đồ tương tự GPXD; kiểm tra xã/phường.
3. Bấm **Lưu hồ sơ** để nhận mã phản ánh và thấy điểm màu cam.

Cũng có thể bấm bản đồ trước, rồi chọn **Ghi phản ánh tại đây** hoặc **Nhập GPXD tại đây**. Bản đầu dành cho ghi nhận tại máy bởi người đã đăng nhập; chưa có cổng phản ánh công khai hay quy trình giao xử lý đầy đủ.

## Tra cứu

Chọn **Toàn tỉnh Sơn La** hoặc từng xã/phường, nhập từ tìm kiếm và chọn lớp GPXD/phản ánh. Bấm điểm hoặc **Xem vị trí** trong danh sách để mở chi tiết. Tải lại trang vẫn còn hồ sơ. Tổng quan đếm đúng hồ sơ theo bộ lọc hiện tại, không có dữ liệu nghiệp vụ mẫu mặc định.

## Lưu dữ liệu an toàn

- Hồ sơ lưu tại `data/ttxd.sqlite`, mã hóa bằng `data/secret.key`. Không xóa hoặc thay khóa; giữ riêng mã truy cập.
- Muốn sao lưu thủ công: dừng phần mềm, sao chép toàn bộ thư mục `data` vào nơi an toàn. Việc sao lưu/khôi phục vận hành tự động chưa được triển khai trong mốc này.
- Không gửi thư mục `data`, mã truy cập hoặc ảnh hồ sơ cho người không có quyền. Bản mã cùng với khóa có thể đọc được bởi người có quyền trên máy.
- Bấm **Đăng xuất** khi kết thúc trên máy tính; phiên tối đa 8 giờ. Trên điện thoại ở cùng mạng chưa truy cập được vì bản này chỉ mở tại máy hiện tại.

Ranh giới 75 xã/phường là dữ liệu tham khảo. Nền bản đồ cần Internet; thiếu nền không làm mất hồ sơ đã lưu. Chưa dùng bản này để cấp phép hành chính hoặc xác định địa giới pháp lý.
