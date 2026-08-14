# CineGo Backend Skeleton Project

Đây là bộ khung (skeleton) backend viết bằng **Java Spring Boot** và **Maven** dành cho hệ thống đặt vé xem phim **CineGo**.

Dự án đã được cấu trúc sẵn theo mô hình phân tầng chuẩn để hai thành viên trong nhóm bắt đầu triển khai code mà không bị chồng chéo.

---

## 🛠️ Công nghệ sử dụng

- **Java Version:** 17
- **Spring Boot Version:** 3.3.1
- **Build Tool:** Maven (đã cấu hình sẵn Maven Wrapper)
- **Cơ sở dữ liệu chính:** MySQL (dùng khi chạy ứng dụng thực tế)
- **Cơ sở dữ liệu kiểm thử:** H2 in-memory (chỉ dùng khi chạy test tự động để tránh phụ thuộc vào MySQL local)
- **Tài liệu API:** Swagger / Springdoc OpenAPI

---

## 📂 Cấu trúc Packages (`com.cinego.backend`)

```text
com.cinego.backend
├── common         -> Chứa cấu trúc Response chung (ApiResponse)
├── config         -> CORS, Security và các cấu hình hệ thống khác
├── controller     -> Các REST API Controllers (chứa endpoint mẫu)
├── dto            -> Data Transfer Objects (request/response)
│   ├── request    -> LoginRequest, RegisterRequest, v.v.
│   └── response   -> MovieResponse, BookingResponse, v.v.
├── exception      -> Global Exception Handler và Custom Exceptions
├── model          -> Các Entity JPA ánh xạ xuống Database
│   └── enums      -> RoleName, MovieStatus, SeatType, v.v.
├── repository     -> Interfaces Spring Data JPA kế thừa JpaRepository
├── security       -> Cấu hình và bộ lọc JWT (TODO)
├── service        -> Xử lý logic nghiệp vụ (Class trực tiếp, không qua Interface/Impl)
└── specification  -> Xử lý truy vấn tìm kiếm động (JPA Specification)
```

*Lưu ý:* Dự án **KHÔNG** sử dụng thư viện Lombok để bảo đảm tính tương thích tối đa và phù hợp với kiến thức bài tập trên lớp của các thành viên.

---

## 🚀 Cách chạy dự án (Local Development)

### 1. Chạy automated tests (Không cần bật MySQL)
Test tự động sử dụng H2 in-memory database thông qua profile `test` (`src/test/resources/application-test.properties`).
Chạy bằng lệnh:
```bash
./mvnw.cmd clean test
```

### 2. Build dự án thành file JAR
```bash
./mvnw.cmd clean package
```

### 3. Khởi chạy ứng dụng (Yêu cầu bật MySQL local)
Đảm bảo bạn đã bật MySQL trên cổng `3306` và tạo database tên là `cinego`. Tài khoản mặc định cấu hình là `root` / `root`.
```bash
./mvnw.cmd spring-boot:run
```

Sau khi ứng dụng khởi chạy thành công:
- **Health check URL:** `http://localhost:8080/api/v1/health`
- **Swagger UI:** `http://localhost:8080/api/v1/swagger-ui.html`

---

## 📌 Phân chia công việc (TODO markers)
Tìm kiếm các từ khóa `TODO [MEMBER-1]` hoặc `TODO [MEMBER-2]` trong source code để biết chính xác các file và nghiệp vụ được giao cho từng người.
Các nhiệm vụ phối hợp chung sẽ được đánh dấu bằng `TODO [SHARED]`.
Danh sách chi tiết hơn và checklist chức năng có thể tham khảo tại tệp tin `TASKS.md` ở thư mục gốc của dự án.
