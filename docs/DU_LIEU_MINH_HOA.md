# Dữ liệu minh họa — 11/10/2026

Theo yêu cầu người dùng, đã thêm 15 GPXD và 10 phản ánh vào vùng dữ liệu sử dụng tại máy qua API có phiên/CSRF. Tất cả tên, địa chỉ, công trình và nội dung đều có nhãn MẪU; tọa độ là vị trí giả định, kiểm tra khớp duy nhất ranh giới đầy đủ, không xác nhận thửa đất/công trình thực tế.

| Phường | GPXD | Kiểm tra sai phép | Phản ánh |
|---|---:|---:|---:|
| Tô Hiệu | 4 | 2 | 3 |
| Chiềng Cơi | 4 | 1 | 3 |
| Thảo Nguyên | 4 | 1 | 2 |
| Mộc Châu | 3 | 1 | 2 |

5 kết quả sai phép ở số mẫu 001, 002, 005, 009, 013 được ghi trong tên công trình và trường notes, hiển thị trong chi tiết GPXD dưới Ghi chú / kết quả kiểm tra. Chưa tạo nghiệp vụ biên bản, quyết định xử phạt hay thay trạng thái GPXD. 10 phản ánh gồm 6 không phép và 4 sai phép, đều ở trạng thái tiếp nhận, nội dung ghi rõ chưa xác minh.

Script scripts/seed-examples.ts bỏ qua số GPXD/tiêu đề phản ánh mẫu đã có, không xóa hồ sơ; đọc mã truy cập nội bộ, không in mã/phiên. Bản build và lint đạt; xác nhận API đủ25 hồ sơ, sau khởi động lại trình duyệt hiển thị15 GPXD/10 phản ánh, bản đồ25 marker và chi tiết đọc được kết quả sai phép.
