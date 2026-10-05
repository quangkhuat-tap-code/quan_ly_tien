# GEMINI & AI CODING INSTRUCTIONS
> Vui lòng tham khảo và tuân thủ chi tiết tại [AGENTS.md](file:///d:/quan_ly_tien/AGENTS.md) và [.agents/rules/coding-guidelines.md](file:///d:/quan_ly_tien/.agents/rules/coding-guidelines.md).

## TÓM TẮT NGUYÊN TẮC:
1. **Backend (Node.js/Express/Prisma/TypeScript)**:
   - Kiến trúc phân tầng: `Route` -> `Middleware` -> `Controller` -> `Service` -> `Prisma`.
   - Không query DB trực tiếp trong Controller.
   - Singleton Prisma client tại `src/config/db.ts`.
   - Chuẩn response `{ success, message, data }`.
2. **Frontend (React 19/TypeScript/Vite/Axios)**:
   - Kiến trúc module tính năng: `features/<name>/` gồm components, hooks.
   - Gọi API qua `src/api/` (Axios interceptor), không gọi `axios` trực tiếp trong component.
   - Tách UI nhỏ, tái sử dụng trong `src/components/common/`.
3. **Tuyệt đối không nhồi nhét toàn bộ code vào `index.ts` hoặc `App.tsx`**.
