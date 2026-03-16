# 🐾 VetCare — Hệ thống quản lý phòng khám thú y

Ứng dụng web quản lý phòng khám thú y hiện đại, được xây dựng với **Spring Boot** (Backend) và **Next.js 14** (Frontend).

---

## 🛠️ Tech Stack

| Phần | Công nghệ |
|------|-----------|
| Backend | Java 17, Spring Boot 3.2, Hibernate/JPA, Spring Security |
| Database | MySQL 8.0 |
| Auth | JWT + OAuth2 (Google, Facebook) |
| Build tool | Maven |
| Frontend | Next.js 14, TypeScript, TailwindCSS |
| State | Zustand |
| HTTP | Axios + React Query |
| Forms | React Hook Form + Zod |
| Deploy | Docker + Docker Compose |

---

## 📦 Cấu trúc dự án

```
vetcare/
├── backend/              # Spring Boot API
│   ├── src/main/java/com/vetcare/
│   │   ├── config/       # SecurityConfig
│   │   ├── controller/   # REST Controllers
│   │   ├── dto/          # Request & Response DTOs
│   │   ├── entity/       # JPA Entities
│   │   ├── enums/        # Role, Status enums
│   │   ├── exception/    # Global Exception Handler
│   │   ├── repository/   # Spring Data JPA Repos
│   │   ├── security/     # JWT, OAuth2, Filters
│   │   └── service/      # Business Logic
│   └── pom.xml
├── frontend/             # Next.js App
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── components/   # Reusable components
│   │   ├── lib/          # API client, Zustand store
│   │   └── types/        # TypeScript types
│   └── package.json
└── docker-compose.yml
```

---

## 🚀 Hướng dẫn cài đặt

### Yêu cầu
- Java 17+
- Node.js 20+
- MySQL 8.0+
- Maven 3.9+

### 1. Clone dự án
```bash
git clone <repo-url>
cd vetcare
```

### 2. Cài đặt Database
```sql
CREATE DATABASE vetcare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Cấu hình Backend
Chỉnh sửa `backend/src/main/resources/application.properties`:
```properties
spring.datasource.password=YOUR_MYSQL_PASSWORD
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 4. Khởi động Backend
```bash
cd backend
mvn clean install -DskipTests
mvn spring-boot:run
# API chạy tại http://localhost:8080/api
# Swagger UI: http://localhost:8080/api/swagger-ui.html
```

### 5. Cấu hình Frontend
```bash
cd frontend
cp .env.local.example .env.local
# Chỉnh NEXT_PUBLIC_API_URL nếu cần
```

### 6. Khởi động Frontend
```bash
npm install
npm run dev
# App chạy tại http://localhost:3000
```

### 7. Chạy với Docker
```bash
docker-compose up --build
```

---

## 🔑 Roles & Quyền hạn

| Role | Quyền |
|------|-------|
| **USER** | Xem dịch vụ, đặt lịch, like/comment, đánh giá |
| **DOCTOR** | Xem lịch hẹn của mình |
| **STAFF** | Quản lý lịch hẹn |
| **ADMIN** | Toàn quyền: thêm/sửa/xoá dịch vụ, bác sĩ, người dùng |

---

## 📋 API Endpoints chính

### Auth
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/v1/auth/register` | Đăng ký |
| POST | `/v1/auth/login` | Đăng nhập |
| POST | `/v1/auth/refresh` | Làm mới token |
| GET | `/oauth2/authorization/google` | Đăng nhập Google |
| GET | `/oauth2/authorization/facebook` | Đăng nhập Facebook |

### Services
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/v1/services` | Danh sách dịch vụ |
| GET | `/v1/services/search?keyword=` | Tìm theo tên |
| GET | `/v1/services/by-symptom?symptom=` | Tìm theo triệu chứng |
| GET | `/v1/services/by-specialization?specialization=` | Theo chuyên khoa |
| POST | `/v1/services` | Thêm dịch vụ (ADMIN) |
| PUT | `/v1/services/{id}` | Cập nhật (ADMIN) |

### Appointments
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/v1/appointments` | Đặt lịch |
| GET | `/v1/appointments/my` | Lịch hẹn của tôi |
| PATCH | `/v1/appointments/{id}/cancel` | Huỷ lịch |
| PATCH | `/v1/appointments/{id}/status` | Cập nhật trạng thái (ADMIN/STAFF) |

---

## 🎨 Các trang chính

| URL | Trang | Yêu cầu đăng nhập |
|-----|-------|-------------------|
| `/` | Trang chủ | Không |
| `/services` | Danh sách dịch vụ | Không |
| `/services/:id` | Chi tiết dịch vụ | Không |
| `/community` | Cộng đồng | Không |
| `/branches` | Chi nhánh | Không |
| `/search` | Tìm kiếm | Không |
| `/booking` | Đặt lịch | ✅ |
| `/profile` | Hồ sơ | ✅ |
| `/profile/appointments` | Lịch hẹn của tôi | ✅ |
| `/admin/dashboard` | Dashboard | ✅ ADMIN |
| `/admin/services` | Quản lý dịch vụ | ✅ ADMIN |
| `/admin/appointments` | Quản lý lịch hẹn | ✅ ADMIN |
| `/admin/users` | Quản lý người dùng | ✅ ADMIN |

---

## 📧 Liên hệ
Email: info@vetcare.vn | Hotline: 1900 1234
