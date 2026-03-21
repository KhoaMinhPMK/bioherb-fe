# SANKIT - Hệ Thống Quản Lý Sản Xuất Nông Nghiệp (Frontend)

Dự án frontend phục vụ hệ thống quản lý nông nghiệp SANKIT. Mã nguồn được tổ chức theo module, tách biệt giao diện và dữ liệu.

## 🚀 Công Nghệ Sử Dụng
- **Framework:** React 19 + React Router v7
- **CSS Architecture:** SCSS (theo cú pháp BEM)
- **Icons:** Lucide React
- **Tooling:** ESLint, Prettier, Husky, Lint-Staged

---

## 💻 Cài Đặt Khởi Tạo

**1. Clone dự án & Cài dependencies:**
```bash
git clone ...
cd sankit-fe
yarn install
```

**2. Cấu hình môi trường:**
```bash
cp .env.example .env
```

**3. Khởi động server:**
```bash
yarn start
```
Browser sẽ tự khởi động tại `http://localhost:3000`.

---

## 🛠️ Danh Sách Câu Lệnh (Scripts)

- `yarn start` - Chạy app ở chế độ development.
- `yarn build` - Đóng gói app ra thư mục `/build` để deploy.
- `yarn lint` - Chạy ESLint rà soát code toàn dự án.
- `yarn format` - Chạy tự động format code (Prettier) cho `.js`, `.jsx`, `.scss`.

---

## 📂 Kiến Trúc Thư Mục (Folder Structure)

Kiến trúc thư mục được chia theo tính năng kết hợp với component dùng chung:

```text
src/
├── assets/          # Thư mục chứa hình ảnh, fonts, file SVG (logo, hình nền).
├── components/      # UI Components dùng chung toàn dự án (DataTable, StatusBadge...).
├── data/            # Thư mục chứa File Mock Data nội bộ thay vì hardcode ở UI.
├── hooks/           # Custom React Hooks xử lý logic chung.
├── layouts/         # Layout tĩnh của hệ thống (MainLayout gồm Sidebar, Header).
├── pages/           # Màn hình tính năng phân theo domain (Dashboard, Farm, Harvert).
├── styles/          # File SCSS Global + Khai báo Biến Màu (`_variables.scss`).
├── App.js           # Khởi tạo App, cấu hình định tuyến và ErrorBoundary.
└── Routers.jsx      # Thiết lập các route (đường dẫn) vào trang tương ứng.
```
