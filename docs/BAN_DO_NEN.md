# Bản đồ nền

Đã bổ sung bộ chọn **Vệ tinh Google Hybrid**, **Đường phố**, **Vệ tinh**, **Google đường phố**, **Google vệ tinh**, bật/tắt ranh giới xã, phường và nút **Về toàn tỉnh**. Chuyển nền chỉ thay nguồn ảnh; giữ lớp ranh giới, vị trí chọn, GPXD và phản ánh đã lưu. Nền vệ tinh có ranh giới màu vàng để dễ nhìn; nền đường phố giữ màu xanh.

## Dùng ngay tại máy

- Đường phố: OpenStreetMap, không yêu cầu khóa API.
- Vệ tinh: Esri World Imagery, cùng nguồn ảnh với dự án tham khảo. Cần kết nối mạng; chất lượng/độ mới ảnh phụ thuộc khu vực và nhà cung cấp. Không coi ảnh là chứng cứ xác nhận ngày xây dựng.
- Vệ tinh Google Hybrid: nền mặc định, dùng lớp ảnh kèm nhãn tiếng Việt theo cách hiển thị của phần mềm tham khảo phường Thảo Nguyên. Nhãn cửa hàng, homestay, điểm tham quan và đường là dữ liệu Google có sẵn trong ảnh, tăng chi tiết khi phóng to. Không đảm bảo mọi vị trí đều có tên hoặc tất cả tên cùng hiện ở một mức zoom. Đây là tích hợp tương thích bản tham khảo qua endpoint tile cũ, không phải Map Tiles API chính thức. Không cache/download tile hoặc nội dung POI vào dữ liệu nghiệp vụ.
- Hai lựa chọn Google đường phố/Google vệ tinh (API): tích hợp chính thức **Map Tiles API**, chỉ bật khi có khóa.

## Bật Google

1. Tạo hoặc dùng dự án Google Cloud của chủ phần mềm, bật billing và Map Tiles API. Việc này do chủ tài khoản thực hiện; ứng dụng không tự đăng ký hoặc bật thanh toán.
2. Tạo khóa cho trình duyệt, giới hạn API chỉ Map Tiles API, giới hạn HTTP referrer `http://127.0.0.1:3100/*` và `http://localhost:3100/*`. Khi triển khai phải thêm đúng tên miền. Khóa dành cho trình duyệt sẽ hiển thị ở các yêu cầu ảnh, không sử dụng khóa máy chủ hoặc khóa dịch vụ khác.
3. Đặt hạn mức API phù hợp với ngân sách và theo dõi mức sử dụng. Google có hạn mức miễn phí theo SKU; vượt hạn mức có thể phát sinh phí. Không có giả định mọi yêu cầu đều miễn phí.
4. Sao chép `.env.example` thành `.env.local`, điền `NEXT_PUBLIC_GOOGLE_MAPS_TILE_API_KEY`. Không đưa `.env.local` vào Git hoặc gửi khóa qua chat.
5. Chạy lại `npm run build` và khởi động lại ứng dụng. Next.js chốt biến `NEXT_PUBLIC_` ở lúc build; sửa tệp rồi chỉ tải lại trình duyệt không đủ.
6. Kiểm tra cả hai nền Google trên trình duyệt thật: ảnh tải được, logo/bản quyền đầy đủ, đổi nền giữ hồ sơ, và theo dõi hạn mức trên Google Cloud. Kiểm thử giả không thay thế bước này.

Ứng dụng dùng session token, lấy bản quyền theo viewport, hiển thị logo Google Maps chính thức, và không lưu ảnh Google vào SQLite. Google nhận yêu cầu vùng bản đồ/ảnh đang xem; nội dung GPXD, tên người phản ánh và số điện thoại không được gửi cho dịch vụ nền bản đồ. Khi không tạo được phiên/nguồn bản quyền, nền cũ hoặc nền đường phố vẫn dùng được.

## Tài liệu nguồn

- [Google Map Tiles API — phiên bản đồ](https://developers.google.com/maps/documentation/tile/session_tokens)
- [Google — viewport và bản quyền](https://developers.google.com/maps/documentation/tile/2d-tiles-overview)
- [Google — quy định hiển thị nguồn](https://developers.google.com/maps/documentation/tile/policies)
- [Google — hạn mức và thanh toán](https://developers.google.com/maps/documentation/tile/usage-and-billing)
- [Google — tổng quan giá](https://developers.google.com/maps/billing-and-pricing/overview)
- [Esri World Imagery](https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08febac2a9)
- [OpenStreetMap — tile usage policy](https://operations.osmfoundation.org/policies/tiles/)

Tình trạng: bản chạy tại máy. Hai lựa chọn Google qua Map Tiles API chưa xác minh bằng khóa thật. Nền Google Hybrid tương thích bản tham khảo được kiểm tra riêng bằng tile và ảnh trình duyệt thực tế.

## Điều khiển gọn và lớp tham chiếu vị trí

Bộ chọn nền mặc định thu thành nút **Lớp bản đồ**; bấm để mở bảng nhỏ với danh sách nền, tên địa danh/đường giao thông và ranh giới. Có nút X, phím Esc hoặc bấm ngoài để đóng bảng. Esc khi bảng lớp đang mở chỉ đóng bảng này; Esc tiếp theo đóng chi tiết hồ sơ, thanh vị trí và thông báo. Trong chế độ chọn vị trí cho biểu mẫu, Esc trở lại biểu mẫu và giữ nội dung đang nhập. Esc ở biểu mẫu đang mở đóng biểu mẫu như nút Hủy; khi đang gửi yêu cầu lưu thì chờ kết quả để tránh gửi lại hồ sơ. Đóng các bảng không xóa hồ sơ đã lưu.

Trên vệ tinh Esri, tên địa danh và đường giao thông được bật mặc định từ **World Transportation** và **World Boundaries and Places**. Có thể bật/tắt hai lớp này cùng nhau. Phóng to để xem chi tiết đường và tên phố ở nơi nhà cung cấp có dữ liệu. Nhãn nhà cung cấp là thông tin tham khảo, có thể khác tên hành chính hiện hành; ranh giới 75 xã/phường vẫn là lớp riêng của dự án. Nền đường phố và Google đã có nhãn trong ảnh nên không chồng thêm lớp Esri lên những nền này.

Nguồn: [World Transportation](https://www.arcgis.com/home/item.html?id=94f838a535334cf1aa061846514b77c7), [World Boundaries and Places](https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer). Lớp nhãn cần mạng như nền ảnh; ứng dụng không gửi nội dung hồ sơ cho nhà cung cấp.
