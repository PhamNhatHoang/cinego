# CineGo - Hệ thống Quản lý và Đặt vé xem phim trực tuyến

Đồ án cuối khóa của nhóm gồm 2 thành viên. Hệ thống cho phép khách hàng tìm kiếm thông tin phim, chọn suất chiếu, đặt ghế trực tuyến, thanh toán mô phỏng và nhận vé điện tử (mã QR/mã vé). Đồng thời cung cấp công cụ quản trị dành cho nhân viên (check-in) và quản trị viên (quản lý rạp, phim, suất chiếu, vé và báo cáo).

---

## 1. Cấu trúc Monorepo
Dự án được tổ chức theo cấu trúc monorepo:
```text
CineGo/
├── backend/            # Spring Boot REST API
├── frontend/           # Next.js App Router (TypeScript, Tailwind CSS)
├── docs/               # Tài liệu phân tích nghiệp vụ, cơ sở dữ liệu và thiết kế UI/UX
├── database/           # Các script SQL khởi tạo và dữ liệu mẫu
├── .gitignore          # Cấu hình bỏ qua các file không cần thiết khi commit Git
└── README.md           # Hướng dẫn tổng quan và vận hành dự án
```

---

## 2. Công nghệ sử dụng

### Backend
- **Ngôn ngữ**: Java 17 (OpenJDK Temurin)
- **Framework**: Spring Boot 3.3.x, Spring Security (JWT, RBAC), Spring Data JPA, Hibernate 6.x
- **Cơ sở dữ liệu**: MySQL 8.x
- **Quản lý dependencies**: Maven
- **Tài liệu API**: OpenAPI/Swagger UI

### Frontend
- **Framework**: Next.js 14.x/15.x (App Router), React, TypeScript
- **CSS & UI**: Tailwind CSS (Thiết lập theme Sáng/Tối song song bằng CSS Variables)
- **Animation**: Motion (Framer Motion)
- **Icons**: Phosphor Icons / Lucide Icons

---

## 3. Phân chia Công việc Nhóm

### Thành viên 1: Quản trị danh mục & Xác thực
- **Backend & Frontend**:
  - Module Đăng ký, Đăng nhập & Phân quyền (Spring Security + JWT + Next.js Middleware).
  - Quản lý người dùng, vai trò.
  - Quản lý phim, thể loại.
  - Quản lý rạp, phòng chiếu.
  - Giao diện quản trị Admin cho các module trên.

### Thành viên 2: Suất chiếu, Ghế, Đặt vé & Check-in
- **Backend & Frontend**:
  - Quản lý ghế (sơ đồ ghế động), suất chiếu.
  - Xử lý thuật toán kiểm tra trùng lịch chiếu phòng và chống trùng ghế đặt (Pessimistic Locking / Unique constraints).
  - Quy trình đặt vé, thanh toán mô phỏng.
  - Sinh mã vé & Nhân viên quét mã / check-in.
  - Trang chủ của khách hàng (Cinematic Dark/Light, lịch chiếu, tìm phim).
  - Dashboard thống kê doanh thu và lượt đặt vé cơ bản cho Admin.

---

## 4. Hướng dẫn Chạy Dự án

### Cài đặt và chạy Backend (Spring Boot)
1. **Yêu cầu hệ thống**: Đã cài đặt JDK 17 và Maven.
2. **Cấu hình Cơ sở dữ liệu**:
   - Tạo database trong MySQL:
     ```sql
     CREATE DATABASE cinego CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
     ```
   - Tạo file cấu hình cá nhân `backend/src/main/resources/application-dev.yml` (hoặc cấu hình trực tiếp biến môi trường) để điền tài khoản database của bạn. Tham khảo file mẫu `application.yml`.
3. **Chạy ứng dụng**:
   - Di chuyển vào thư mục `backend/`.
   - Chạy lệnh biên dịch và tải thư viện:
     ```bash
     mvn clean compile
     ```
   - Chạy ứng dụng:
     ```bash
     mvn spring-boot:run
     ```
   - Backend sẽ chạy tại cổng mặc định `8080`. API check trạng thái: `http://localhost:8080/api/v1/health`.
   - Swagger UI tài liệu API: `http://localhost:8080/swagger-ui/index.html`.

### Cài đặt và chạy Frontend (Next.js)
1. **Yêu cầu hệ thống**: Đã cài đặt Node.js (v18.x hoặc mới hơn).
2. **Cài đặt thư viện**:
   - Di chuyển vào thư mục `frontend/`.
   - Chạy lệnh:
     ```bash
     npm install
     ```
3. **Cấu hình biến môi trường**:
   - Tạo file `frontend/.env.local` ở thư mục frontend:
     ```env
     NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
     ```
4. **Chạy ứng dụng chế độ phát triển**:
   - Chạy lệnh:
     ```bash
     npm run dev
     ```
   - Frontend sẽ chạy tại `http://localhost:3000`.

---

## 5. Quy tắc Git của Nhóm

### Nhánh Git (Git Branches)
- `main`: Nhánh chạy production ổn định. Không được push code trực tiếp lên đây.
- `develop`: Nhánh tích hợp các tính năng mới của cả nhóm.
- Các nhánh tính năng (Feature Branches): Nhóm tự phân chia tạo từ `develop`:
  - `feature/auth`
  - `feature/movie-management`
  - `feature/cinema-management`
  - `feature/showtime`
  - `feature/booking`
  - `feature/payment`

### Quy trình đưa Code lên nhánh chung:
1. Viết code và test kỹ lưỡng dưới local.
2. Pull code mới nhất từ nhánh `develop` về nhánh của mình và resolve conflict nếu có.
3. Push nhánh feature của mình lên GitHub và tạo Pull Request (PR) vào nhánh `develop`.
4. Thành viên còn lại review code, thảo luận và approve PR để merge.

### Định dạng Commit Message (Conventional Commits)
Hãy viết commit rõ ràng theo định dạng:
`type(scope): description`
Ví dụ:
- `feat(auth): implement JWT token provider`
- `fix(booking): prevent duplicate database insertion on seats`
- `docs(db): update database design schema`
- `style(ui): improve responsive layout on movie detail`

---

## 6. Trạng thái Phát triển
- **Giai đoạn Hiện tại**: Khởi tạo phần thô (sườn dự án), định hình cấu trúc monorepo, tài liệu đặc tả, và các trang layout cơ bản.
