# Kỷ Niệm Yêu Thương • 20/10 • Quin & Anh

Trang web kỷ niệm tình yêu và chúc mừng ngày Phụ Nữ Việt Nam 20/10, được trích xuất và phát triển dựa trên bản thiết kế **"web anni quin"** từ Google Stitch (Theme: **Vintage Rose & Parchment**).

---

## 🌹 Các Tính Năng Đã Tích Hợp Hoàn Thiện

### 1. Hiệu Ứng Mở Thư & Mở Rộng Toàn Trang (Cinematic 5-Step Unboxing)
- **Phong bì ban đầu**: Render chuẩn xác từ Stitch với hiệu ứng chiều sâu 3D, tem thư bưu điện cổ điển "Poste Hanoi", và dải ruy băng tình yêu.
- **Con dấu sáp cố định**: Được neo tuyệt đối tại mép nắp phong bì (`top: 58%; left: 50%; transform: translate(-50%, -50%)`), hiệu ứng hover sử dụng `filter: drop-shadow` ánh kim, **hoàn toàn không xê dịch hay giật lag**.
- **Khi bấm mở**:
  1. Con dấu phát sáng và vỡ nhẹ theo hiệu ứng tan rã kim loại vàng (`seal-broken`).
  2. Nắp phong bì lật ngược 3D (`rotateX(180deg)`).
  3. Cơn mưa cánh hoa hồng và bụi sao vàng lung linh rơi xuống toàn màn hình.
  4. Bức thư bên trong trượt lên và phóng to phủ kín màn hình (morph/scale).
  5. Chuyển sang trang web chính cho phép cuộn trang mượt mà (`overflow-y: auto`).
  6. Dải hoa hồng leo mềm mại (`assets/rose-border.png`) xuất hiện dọc 2 bên viền màn hình.
  7. Có nút **"Đóng Lại Phong Bì"** ở cuối trang để trải nghiệm lại bất kỳ lúc nào.

---

### 2. Bộ Đếm Ngày Yêu (Real-time Love Counter)
- **Mốc thời gian**: Bắt đầu từ ngày **06/08/2025**.
- **Hiển thị trực quan**:
  - Tổng số ngày yêu nhau (cập nhật theo thời gian thực).
  - Giờ, Phút và Giây đếm nhịp nhàng từng giây một với hiệu ứng pulse.
  - Thiết kế 4 khối vintage sang trọng, viền chỉ vàng và bóng đổ mềm.

---

### 3. Trình Phát Nhạc "Sandwich & Story" (MONO)
- **Floating Music Player**: Nằm ở thanh điều hướng cố định góc trên, đi kèm đĩa than vinyl vintage xoay nhịp nhàng khi phát nhạc.
- **Điều khiển**: Có đầy đủ nút Play / Pause, Mute / Unmute, thanh tiến trình bài hát và thời gian thực.
- **Cơ chế phát kép (Dual Audio)**:
  - **Ưu tiên 1**: File nhạc cục bộ `assets/sandwich-and-story.mp3` (hoặc `assets/Sandwich & Story.mp3`).
  - **Phương án Fallback**: Link trực tuyến trực tiếp bài dạ khúc lãng mạn nếu file cục bộ chưa có hoặc gặp lỗi.
  - **Vượt rào Autoplay Policy**: Khi người dùng nhấn vào con dấu sáp mở thư (sự kiện click trực tiếp), nhạc sẽ tự động kích hoạt ngay lập tức mà không bị trình duyệt chặn.

---

### 4. Xử Lý Nội Dung & Góc Ảnh Polaroid
- **Lời chúc & Tâm sự**:
  - Giữ trọn typography kinh điển (`Playfair Display` cho tiêu đề, `Inter` cho nội dung, `Montserrat` cho nhãn).
  - Chữ cái khởi đầu nghệ thuật **Drop Cap "E"** cỡ lớn mạ vàng.
  - Các đoạn tâm sự mẫu về kỷ niệm tình yêu và lời chúc 20/10 ngọt ngào.
  - **Dễ dàng chỉnh sửa**: Toàn bộ nội dung thư đều có thể bấm vào chỉnh sửa trực tiếp (`contenteditable="true"`) trên trình duyệt hoặc sửa file [index.html](file:///e:/web%20anni/index.html).
- **Góc ảnh Polaroid**:
  - 6 khung ảnh phong cách Polaroid vintage với góc nghiêng tự nhiên (`-1.8°`, `2.4°`, `-2.2°`, `1.6°`, `-1.5°`, `2°`).
  - Đi kèm băng dính washi tape hồng/vàng và ghim bấm đồng cổ.
  - Đã liên kết sẵn với `assets/photo1.jpg` đến `assets/photo6.jpg`.
  - Cơ chế tự nhận diện thông minh: Khi bạn thả file ảnh trùng tên `photo1.jpg`..`photo6.jpg` vào thư mục `assets/`, ảnh sẽ tự hiển thị vừa khít khung hình mà không lo vỡ layout!

---

## 🚀 Hướng Dẫn Chạy Trang Web

### Cách 1: Chạy trực tiếp (Không cần cài đặt bất kỳ thứ gì)
Bạn chỉ cần click đúp vào file [index.html](file:///e:/web%20anni/index.html) để mở trực tiếp trong Google Chrome, Microsoft Edge hoặc bất kỳ trình duyệt nào.

### Cách 2: Chạy qua Server cục bộ (Khuyên dùng để tối ưu âm thanh & font)
Mở terminal trong thư mục dự án và chạy:
```bash
node server.js
```
Sau đó truy cập: [http://localhost:3000](http://localhost:3000)

---

## 📁 Cấu Trúc Thư Mục
```text
web anni/
├── index.html            # Giao diện chính (Stage 1 phong bì + Stage 2 trang web)
├── style.css             # Style tokens, hiệu ứng 3D, mở thư, vinyl player, hoa rơi
├── script.js             # Logic mở thư, Dual Audio, Love Counter thời gian thực
├── server.js             # Server Node.js nhẹ để test âm thanh & ảnh cục bộ
└── assets/               # Thư mục tài nguyên đa phương tiện
    ├── sandwich-and-story.mp3   # Bài hát của MONO
    ├── rose-border.png          # Dải hoa hồng leo mềm mại 2 bên viền
    ├── photo1.jpg .. photo6.jpg # 6 ảnh kỷ niệm Polaroid
    └── defaults/                # Ảnh dự phòng từ Stitch
```
