# CODING STANDARDS & ARCHITECTURAL RULES FOR AI

Dự án này áp dụng mô hình phân tầng chuyên nghiệp (Layered Clean Architecture). AI Agent bắt buộc phải tuân theo các nguyên tắc dưới đây:

## 1. BACKEND (Node.js + Express + Prisma + TypeScript)
- **Tầng Controller (`backend/src/controllers/`)**: Chỉ nhận request, điều phối gọi Service, trả JSON chuẩn qua helper `apiResponse`. Không bao giờ gọi trực tiếp `prisma` tại đây.
- **Tầng Service (`backend/src/services/`)**: Chứa toàn bộ Business Logic, query Prisma, transaction dữ liệu, tính toán tiền tệ. Không nhận các object HTTP (`req`, `res`).
- **Tầng Route (`backend/src/routes/`)**: Định nghĩa endpoints, nhóm theo tài nguyên (`/wallets`, `/transactions`, `/categories`, `/auth`).
- **Tầng Middleware (`backend/src/middlewares/`)**: Xử lý authentication (JWT), validate request DTO, global error handling.
- **Prisma Client (`backend/src/config/db.ts`)**: Sử dụng duy nhất 1 PrismaClient singleton. Không khởi tạo `new PrismaClient()` rải rác.
- **Xử lý số dư ví**: Khi thêm/sửa/xóa giao dịch, phải dùng `prisma.$transaction` để bảo đảm số dư ví luôn chính xác.

## 2. FRONTEND (React 19 + TypeScript + Vite + Axios)
- **Tầng API (`frontend/src/api/`)**: Mọi request HTTP phải thông qua `axiosClient` cấu hình sẵn baseUrl từ biến môi trường `VITE_API_URL` và interceptors. Không gọi `axios.get/post` trực tiếp trong component.
- **Tầng Hook (`frontend/src/features/.../hooks/` hoặc `frontend/src/hooks/`)**: Tách biệt state management, logic fetch API ra khỏi component giao diện.
- **Tầng Component (`frontend/src/components/` & `frontend/src/features/`)**:
  - `components/common/`: Các UI tái sử dụng (Button, Input, Modal, Card, Badge, Loader).
  - `components/layout/`: Header, Sidebar, Container.
  - `features/<feature_name>/`: Mỗi tính năng tách thành 1 folder riêng (ví dụ: `transactions/`, `wallets/`, `dashboard/`).
- **Formatting (`frontend/src/utils/`)**: Sử dụng hàm `formatCurrency(amount)` cho tiền VND và `formatDate(date)` cho ngày tháng.

## 3. STRICT CONVENTIONS
- Không tạo God-files (nhồi tất cả vào `index.ts` hay `App.tsx`).
- Định dạng Response API thống nhất: `{ success: boolean, message?: string, data?: T, error?: any }`.
- Sử dụng TypeScript nghiêm ngặt, không dùng `any` bừa bãi.
- Xử lý lỗi đầy đủ, trả về status code HTTP tương ứng (200, 201, 400, 401, 403, 404, 500).
