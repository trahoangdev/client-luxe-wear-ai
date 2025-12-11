# Contributing to LuxeWear AI Client

Cảm ơn bạn đã quan tâm đến việc đóng góp cho **LuxeWear AI**! Tài liệu này cung cấp các hướng dẫn giúp bạn tham gia phát triển dự án một cách hiệu quả.

## 1. Công Nghệ Sử Dụng (Tech Stack)

Dự án này được xây dựng dựa trên các công nghệ hiện đại:

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/)
*   **State Management**: Redux Toolkit
*   **Package Manager**: npm

## 2. Bắt Đầu (Getting Started)

### Yêu cầu tiên quyết
*   Node.js (Phiên bản 18.x trở lên)
*   npm

### Cài đặt

1.  **Clone repository**:
    ```bash
    git clone https://github.com/your-username/client-luxe-wear-ai.git
    cd client-luxe-wear-ai
    ```

2.  **Cài đặt các gói phụ thuộc (dependencies)**:
    ```bash
    npm install
    ```

3.  **Thiết lập biến môi trường**:
    Tạo file `.env.local` từ file mẫu (nếu có) hoặc cấu hình các biến cần thiết:
    ```env
    NEXT_PUBLIC_SERVER_URL=http://localhost:3000
    ```

4.  **Chạy server phát triển (Development Server)**:
    ```bash
    npm run dev
    ```
    Truy cập [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 3. Quy Trình Phát Triển (Development Workflow)

### Cấu trúc dự án
*   `app/`: Chứa source code chính (Pages, Layouts, API Routes).
*   `components/`: Các UI components tái sử dụng.
*   `services/`: Logic gọi API và xử lý dữ liệu.
*   `store/`: Redux store slices.

### Code Style & Linting
Chúng tôi sử dụng **ESLint** và **Prettier** để đảm bảo chất lượng code.
*   Kiểm tra lỗi Lint: `npm run lint`
*   Tự động sửa lỗi Lint: `npm run lint:fix`
*   Format code: `npm run format`

Vui lòng đảm bảo không còn lỗi Lint trước khi commit.

### Commit Messages
Khuyến khích tuân thủ [Conventional Commits](https://www.conventionalcommits.org/):
*   `feat: thêm chức năng đăng nhập`
*   `fix: sửa lỗi hiển thị trên mobile`
*   `docs: cập nhật README`
*   `style: chỉnh sửa UI dashboard`
*   `refactor: tối ưu hóa code upload`

## 4. Quy Trình Pull Request (PR)

1.  Tạo một branch mới cho tính năng hoặc bản sửa lỗi của bạn:
    ```bash
    git checkout -b feature/ten-tinh-nang
    ```
2.  Thực hiện thay đổi và commit code.
3.  Đẩy branch lên remote repository:
    ```bash
    git push origin feature/ten-tinh-nang
    ```
4.  Tạo Pull Request trên GitHub và mô tả chi tiết những thay đổi bạn đã thực hiện.
5.  Chờ review và merge.

---

Cảm ơn sự đóng góp của bạn! Team LuxeWear AI.
