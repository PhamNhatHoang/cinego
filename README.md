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

### Bước 1: Khởi động MySQL thông qua Docker (Khuyên dùng)
Dự án được cấu hình sẵn Docker để khởi chạy nhanh cơ sở dữ liệu mà không cần cài đặt MySQL local:
1. Đảm bảo phần mềm **Docker Desktop** đã được mở trên máy tính.
2. Mở Terminal tại thư mục gốc của dự án (`CineGo/`) và chạy lệnh:
   ```bash
   docker compose up -d
   ```
   *Lệnh này sẽ tự động tải MySQL 8.0, tạo database `cinego` và thiết lập tài khoản `root` với mật khẩu là `root`.*

*(Nếu bạn muốn chạy MySQL cài đặt trực tiếp trên hệ điều hành, hãy khởi động dịch vụ MySQL của bạn, tạo database `cinego` và thay đổi mật khẩu kết nối phù hợp tại file `backend/src/main/resources/application-dev.yml`).*

### Bước 2: Chạy Backend (Spring Boot)
1. **Chạy qua IDE (Khuyên dùng)**:
   - Mở thư mục `backend/` bằng **IntelliJ IDEA** hoặc **Eclipse**.
   - Bấm **Reload Maven Project** để IDE tải hết thư viện.
   - Tìm file `com.cinego.backend.BackendApplication.java`, click chuột phải và chọn **Run**.
2. **Chạy qua dòng lệnh (CLI)**:
   - Mở Terminal tại thư mục `backend/` và chạy lệnh:
     ```bash
     mvn spring-boot:run
     ```
   - Khi chạy thành công, Tomcat sẽ hoạt động tại cổng `8080` (context-path: `/api/v1`).

### Bước 3: Chạy Frontend (Next.js)
1. Mở Terminal tại thư mục `frontend/`.
2. Cài đặt các thư viện phụ thuộc (nếu là lần đầu tiên chạy):
   ```bash
   npm install
   ```
3. Khởi chạy server phát triển (Development Server):
   ```bash
   npm run dev
   ```
4. Frontend Next.js sẽ hoạt động tại địa chỉ: **`http://localhost:3000`**.

---

## 5. Kiểm tra Kết nối & Hoạt động của Dự án

Sau khi đã khởi chạy tất cả các dịch vụ, hãy kiểm tra hoạt động bằng các địa chỉ sau:

| Dịch vụ | Đường dẫn kiểm tra | Kết quả mong đợi |
| :--- | :--- | :--- |
| **Frontend Giao diện** | [http://localhost:3000](http://localhost:3000) | Hiển thị trang chủ CineGo hỗ trợ toggle theme Sáng/Tối và sơ đồ định tuyến. |
| **Backend Health Check** | [http://localhost:8080/api/v1/health](http://localhost:8080/api/v1/health) | Trả về JSON chứa thông tin status `"UP"` và phiên bản Java. |
| **Tài liệu API Swagger** | [http://localhost:8080/api/v1/swagger-ui/index.html](http://localhost:8080/api/v1/swagger-ui/index.html) | Hiển thị giao diện Swagger UI chứa danh sách các endpoints của dự án. |
| **Cơ sở dữ liệu (Docker)** | MySQL localhost:3306 | Kết nối thành công bằng user `root`, password `root`, database `cinego`. |

---

## 6. Quy tắc Git của Nhóm

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

## 7. Trạng thái Phát triển
- **Giai đoạn Hiện tại**: Khởi tạo phần thô (sườn dự án), định hình cấu trúc monorepo, tài liệu đặc tả, và các trang layout cơ bản.
