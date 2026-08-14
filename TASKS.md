# Phân Chia Nhiệm Vụ Đồ Án CineGo

Tài liệu này đặc tả việc phân chia công việc cho 2 thành viên trong nhóm và checklist các chức năng cần hoàn thiện trên hệ thống Backend.

---

## 🧑‍💻 Phân Vai Thành Viên

### **MEMBER-1 (Xác thực, Phim & Giao diện Admin/Khách hàng liên quan)**
Phụ trách các module bảo mật, tài khoản người dùng, quản lý phim và thể loại.

### **MEMBER-2 (Suất chiếu, Ghế, Đặt vé & Soát vé)**
Phụ trách sơ đồ rạp, ghế ngồi, lịch chiếu phim, nghiệp vụ đặt vé (Booking), xuất vé (Ticket) và chức năng soát vé của nhân viên (Staff).

### **SHARED (Công việc phối hợp chung)**
Phối hợp xây dựng quan hệ giữa các bảng cơ sở dữ liệu, tích hợp hệ thống và kiểm thử.

---

## 📋 Checklist Chi Tiết Chức Năng

### 🔹 MEMBER-1: Tác vụ & Module

#### 1. Security & Authentication (`security/`, `config/SecurityConfig.java`)
- [ ] Cấu hình `PasswordEncoder` (sử dụng BCrypt).
- [ ] Triển khai JWT Token generation & validation (`JwtTokenProvider`).
- [ ] Xây dựng `JwtAuthenticationFilter` để chặn và xác thực request.
- [ ] Cấu hình phân quyền chi tiết trong `SecurityConfig` theo role (`CUSTOMER`, `STAFF`, `ADMIN`).

#### 2. User & Auth (`service/AuthService.java`, `controller/AuthController.java`)
- [ ] API Đăng ký tài khoản: Mã hóa mật khẩu, kiểm tra trùng lặp email/username, gán vai trò mặc định `CUSTOMER`.
- [ ] API Đăng nhập tài khoản: Xác thực qua `AuthenticationManager`, trả về JWT Token và thông tin người dùng.
- [ ] API Quản lý danh sách người dùng (chỉ ADMIN truy cập) và chuyển đổi quyền hạn giữa các role.

#### 3. Movies & Genres (`model/Movie.java`, `model/Genre.java`)
- [ ] Hoàn thiện các trường dữ liệu của Movie (director, cast, releaseDate, posterUrl, trailerUrl, v.v.).
- [ ] Thiết lập quan hệ Many-to-Many giữa `Movie` và `Genre` (qua bảng trung gian `movie_genres`).
- [ ] Triển khai CRUD Genre (thêm, sửa, xóa, liệt kê thể loại).
- [ ] Triển khai CRUD Movie (chỉ ADMIN được chỉnh sửa, khách hàng được xem).
- [ ] Viết API Tìm kiếm/Lọc phim (`MovieSpecification`) theo tên phim, trạng thái (NOW_SHOWING, COMING_SOON) và thể loại.

---

### 🔹 MEMBER-2: Tác vụ & Module

#### 1. Cinema, Auditorium & Seat (`model/Cinema.java`, `model/Auditorium.java`, `model/Seat.java`)
- [ ] Thiết lập quan hệ Many-to-One từ `Auditorium` tới `Cinema`.
- [ ] Thiết lập quan hệ Many-to-One từ `Seat` tới `Auditorium`.
- [ ] Viết API lấy danh sách phòng chiếu theo Rạp.
- [ ] Viết API thiết lập/tạo sơ đồ ghế mẫu cho phòng chiếu (ví dụ: tự động tạo hàng A-H, cột 1-10 khi khởi tạo phòng).

#### 2. Showtime (`model/Showtime.java`, `service/ShowtimeService.java`)
- [ ] Thiết lập quan hệ Many-to-One từ `Showtime` tới `Movie` và `Auditorium`.
- [ ] Viết API lấy lịch chiếu phim (lọc theo ngày, theo rạp hoặc theo phim).
- [ ] API Thêm/Sửa suất chiếu (chỉ ADMIN): **Phải kiểm tra trùng chéo thời gian** trong cùng một phòng chiếu.
  - *Logic kiểm tra:* Không được phép tồn tại suất chiếu khác bắt đầu trước khi suất chiếu hiện tại kết thúc (startTime + duration + cleaningTime).

#### 3. Booking & BookingSeat (`model/Booking.java`, `model/BookingSeat.java`, `service/BookingService.java`)
- [ ] Thiết lập quan hệ Many-to-One từ `Booking` tới `User` và `Showtime`.
- [ ] Thiết lập quan hệ Many-to-One từ `BookingSeat` tới `Booking` và `Seat`.
- [ ] API Tạo đơn đặt vé (`POST /bookings`):
  - Nhận vào `showtimeId` và danh sách `seatIds`.
  - Kiểm tra xem ghế đã được đặt cho suất chiếu này chưa (xem phần SHARED).
  - Tính tổng số tiền dựa trên giá vé cơ bản của suất chiếu và phụ thu loại ghế (STANDARD, VIP, COUPLE).
  - Lưu Booking ở trạng thái `PENDING`.
- [ ] API Thanh toán giả lập (`POST /bookings/{id}/payment`):
  - Cập nhật trạng thái Booking từ `PENDING` thành `PAID`.
  - Sinh thực thể `Ticket` tương ứng cho từng ghế trong Booking.

#### 4. Ticket & Staff Check-in (`model/Ticket.java`, `service/TicketService.java`)
- [ ] Thiết lập quan hệ Many-to-One từ `Ticket` tới `Booking`, `Seat` và `Showtime`.
- [ ] Thiết lập mã vé ngẫu nhiên duy nhất (`ticketCode`).
- [ ] API Tra cứu thông tin vé qua mã vé (dành cho STAFF).
- [ ] API Check-in vé (`PUT /tickets/{code}/check-in`):
  - Chuyển trạng thái từ `ACTIVE` sang `CHECKED_IN`.
  - Ghi nhận thời gian `checkedInAt`.
  - Đảm bảo một vé không thể check-in 2 lần.

#### 5. Dashboard (`service/DashboardService.java`)
- [ ] API lấy số liệu thống kê cơ bản cho trang Admin: Tổng doanh thu, số vé bán ra, số lượng phim hoạt động, bảng doanh thu phân chia theo từng phim.

---

### 🔹 SHARED: Công việc phối hợp chung

- [ ] **Database Relationship Mapping:** Hai thành viên cùng rà soát các khai báo `@ManyToOne`, `@ManyToMany` và `@OneToMany` trên các Entity để đảm bảo Hibernate sinh bảng MySQL khớp với file `docs/DATABASE_DESIGN.md`.
- [ ] **Chống đặt trùng ghế (Double Booking Prevention):**
  - Cần tạo ràng buộc Unique phức hợp (`uq_showtime_seat`) trên bảng `tickets` ở mức database cho cặp `(showtime_id, seat_id)`.
  - Triển khai logic kiểm tra trong BookingService: Kiểm tra xem các ghế yêu cầu đã có vé thành công (`PAID`) tương ứng với suất chiếu này chưa trước khi tạo đơn hàng mới.
- [ ] **API Contract:** Thống nhất các DTO request/response để khớp với cấu trúc dữ liệu mà frontend Next.js đang sử dụng.
- [ ] **Tích hợp và kiểm thử:** Viết các JUnit Test kiểm thử tích hợp (Integration Test) cho luồng đặt vé và kiểm tra xung đột suất chiếu.
