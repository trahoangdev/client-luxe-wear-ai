import { Metadata } from 'next';
import EnterprisePage from './EnterpriseClient';

export const metadata: Metadata = {
  title: 'Doanh nghiệp - Giải pháp AI toàn diện',
  description: 'Mở rộng quy mô hỗ trợ khách hàng với các AI Agent cấp doanh nghiệp. Xử lý khối lượng lớn, tự động hóa thông minh và bảo mật hàng đầu.',
  openGraph: {
    title: 'Giải pháp Doanh nghiệp - LuxeWear AI',
    description: 'Nền tảng AI Agent an toàn, bảo mật và mở rộng cho doanh nghiệp của bạn.',
  },
};

export default function Page() {
  return <EnterprisePage />;
}
