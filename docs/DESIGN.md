# Tài liệu Thiết kế UI/UX - CineGo Movie Ticket Booking System

Tài liệu này đặc tả quy chuẩn thiết kế UI/UX cho hệ thống CineGo. Bản thiết kế hướng tới trải nghiệm người dùng cao cấp, chuyên nghiệp dạng **Cinematic Dark-Tech & Ethereal Glass** (Tối) kết hợp song song với **Pristine Editorial Ivory** (Sáng).

---

## 1. Không khí Trực quan (Visual Atmosphere)
* **DESIGN_VARIANCE: 7** (Bố cục bất đối xứng tinh tế ở trang bán vé của khách hàng để tạo cảm giác điện ảnh; đối xứng phẳng, gọn gàng, trực quan ở trang Admin/Staff).
* **MOTION_INTENSITY: 6** (Chuyển động tự nhiên mô phỏng vật lý thế giới thực, mượt mà, không giật lắc, sử dụng transition cubic-bezier tùy chỉnh).
* **VISUAL_DENSITY: 4 (Customer) / 7 (Admin)** (Không gian thoáng đãng, dễ thở ở trang đặt vé của khách hàng; hiển thị cô đọng, mật độ thông tin cao tại trang Dashboard quản trị).

---

## 2. Bảng màu Song song (Color Calibration)

Hệ thống sử dụng **CSS Variables** kết hợp cơ chế `@media (prefers-color-scheme)` hoặc class `.dark` của Tailwind để chuyển đổi mượt mà giữa hai giao diện sáng và tối.

### A. Chế độ Tối (Dark Mode - Mặc định cho Trang chủ Khách hàng)
* **Nền trang chính (Canvas Back)**: `#050505` (OLED sâu thẳm).
* **Nền phụ/Thẻ card (Surface)**: `#121212` hoặc `#1E1E1E` với hiệu ứng kính mờ nhẹ (`backdrop-blur-xl bg-white/5`).
* **Đường viền mỏng (Whisper Border)**: `rgba(255, 255, 255, 0.08)` hoặc `#27272A`.
* **Chữ chính (Primary Text)**: `#F4F4F5` (Off-white).
* **Chữ phụ (Secondary Text)**: `#A1A1AA` (Xám khói nhã nhặn).
* **Màu nhấn (Accent Color)**: **Crimson Red** `#E11D48` hoặc `#EF4444`. Đại diện cho sắc màu nhung rạp phim và ánh sáng rực cháy.

### B. Chế độ Sáng (Light Mode - Thân thiện khi sử dụng Ban ngày/Văn phòng)
* **Nền trang chính (Canvas Back)**: `#FDFBF7` hoặc `#FBFBFA` (Màu ngà ấm, giấy thô cao cấp).
* **Nền phụ/Thẻ card (Surface)**: `#FFFFFF` hoặc `#F9F9F8` (kem cực nhạt).
* **Đường viền mỏng (Whisper Border)**: `rgba(0, 0, 0, 0.06)` hoặc `#E2E8F0`.
* **Chữ chính (Primary Text)**: `#111111` (Màu mực espresso tối).
* **Chữ phụ (Secondary Text)**: `#787774` (Xám ấm).
* **Màu nhấn (Accent Color)**: **Crimson Red** `#EF4444` hoặc `#E11D48` (độ tương phản cao, đáp ứng tỷ lệ WCAG AA tối thiểu 4.5:1).

---

## 3. Hệ Typography (Font Chữ)
* **Font Sans-Serif chính (Body, UI, Nút bấm)**: Sử dụng font **Outfit** (`next/font/google`). Đây là một font sans-serif hình học mang hơi hướng điện ảnh, thanh lịch và sắc nét.
* **Font Monospace (Mã vé, Lịch chiếu, Ghế, Dữ liệu Admin)**: Sử dụng font **Geist Mono** hoặc **JetBrains Mono**. Giúp hiển thị chính xác các ký tự số, ký hiệu và tạo cảm giác công nghệ cao (tech-vibe).
* **Cú pháp tiêu đề H1/H2**:
  - Không viết tiêu đề quá dài (Hero Title tối đa 2-3 dòng).
  - Thu hẹp khoảng cách chữ (`tracking-tighter`) và co hẹp chiều cao dòng (`leading-none` hoặc `leading-[1.1]`).
  - Sử dụng cỡ chữ lớn co giãn linh hoạt qua hàm `clamp()` của CSS để thích ứng tốt trên mobile.

---

## 4. Chi tiết Component Đặc trưng (UX/UI Tokens)

### A. Cấu trúc Thẻ "Viền Đôi" (Double-Bezel)
Để tránh các thẻ phim (Movie Cards) hoặc block chọn ghế phẳng lì tẻ nhạt, chúng ta sử dụng thiết kế lồng nhau:
* **Outer Shell (Khung ngoài)**: Nền mờ nhẹ (`bg-black/5` ở Light Mode, `bg-white/5` ở Dark Mode), viền hairline cực mảnh, bo góc lớn (`rounded-[2rem]`), padding nhỏ (`p-2`).
* **Inner Core (Lõi trong)**: Container chứa poster và thông tin phim thực tế nằm trong khung. Bo góc nhỏ hơn theo tính toán tỷ lệ (`rounded-[calc(2rem-0.5rem)]`) để các đường curves đồng tâm hoàn hảo, có đổ bóng môi trường khuếch tán rộng.

### B. Cấu trúc Nút "Island CTA" (Nút bấm lồng nhau)
* Các nút bấm tương tác chính được thiết kế dạng viên thuốc bo tròn hoàn toàn (`rounded-full`) với padding rộng (`px-6 py-3`).
* **Nút trong Nút**: Biểu tượng mũi tên điều hướng (`↗`) hoặc icon vé (`🎟️`) được lồng gọn gàng trong một vòng tròn nhỏ riêng biệt (`w-8 h-8 rounded-full bg-white/10 flex items-center justify-center`) đặt sát lề phải bên trong nút bấm, tạo sức căng chuyển động nội tại khi hover.

### C. Giao diện Sơ đồ chọn Ghế (Seat Map Interface)
* Thiết kế phẳng, tối giản nhưng phản hồi nhanh:
  - Ghế trống (**AVAILABLE**): Nền xám nhạt (Light) / Nền xám tối (Dark), bo góc nhẹ `rounded-md`.
  - Ghế VIP: Viền mỏng màu vàng nhạt, lõi màu xám.
  - Ghế đôi (COUPLE): Nút rộng gấp đôi bình thường, bo góc mềm mại.
  - Ghế đang chọn (**HELD**): Lên màu nhấn Crimson Red rực rỡ tức thì.
  - Ghế đã đặt (**BOOKED**): Màu xám mờ đục có dấu `x` chéo hoặc icon nhỏ, vô hiệu hóa tương tác (`pointer-events-none`).
* Tương tác nhấn: Khi click chuột hoặc chạm tay vào ghế, ghế co lại nhẹ (`active:scale-90`) tạo hiệu ứng tactile feedback chân thực.

---

## 5. Chuyển động và Hoạt ảnh (Motion)
Mọi chuyển động trong CineGo mô phỏng vật lý lò xo mượt mà, không dùng các easing tuyến tính rẻ tiền.
* **Spring physics mặc định (Motion/Framer Motion)**: `stiffness: 100, damping: 20` (đầm, sang trọng).
* **Xuất hiện so le (Staggered float-up)**: Danh sách lịch chiếu phim hoặc sơ đồ ghế không xuất hiện đồng loạt. Các phần tử hiển thị lần lượt trễ nhau (`delay` cách nhau 40ms) trượt nhẹ từ dưới lên và mờ dần.
* **Hoạt ảnh an toàn**: Chỉ tạo chuyển động qua các thuộc tính `transform` (scale, translate) và `opacity` để GPU xử lý tối ưu, không gây reflow làm giật lag trình duyệt di động.

---

## 6. Bảng kiểm tra chất lượng (Anti-Patterns / Checklist)
Trước khi đưa code lên nhánh chung, hãy kiểm tra:
- [ ] Không sử dụng font mặc định `Inter` cho giao diện khách hàng.
- [ ] Không sử dụng dải màu gradient tím/xanh AI sáo rỗng.
- [ ] Chữ trên nút bấm rõ tương phản, không bị chìm màu.
- [ ] Toàn bộ text nhãn nút bấm nằm trên 1 dòng duy nhất trên desktop.
- [ ] Không có 2 nút CTA cùng mục đích hành động xuất hiện trên một viewport.
- [ ] Tất cả các component nút bấm, form, thẻ card đều thống nhất bo góc theo quy chuẩn.
- [ ] padding dọc của các section lớn tối thiểu đạt `py-16 md:py-24`.
- [ ] Cài đặt đầy đủ skeleton loader khi chờ tải danh sách phim/lịch chiếu.
