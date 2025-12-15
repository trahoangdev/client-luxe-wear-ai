import { Metadata } from 'next';
import PricingPage from './PricingClient';

export const metadata: Metadata = {
    title: 'Bảng Giá - Các gói dịch vụ',
    description: 'Xem bảng giá các gói dịch vụ LuxeWear AI. Từ gói miễn phí đến gói doanh nghiệp, chọn gói phù hợp với nhu cầu của bạn.',
    openGraph: {
        title: 'Bảng Giá - LuxeWear AI',
        description: 'Chọn gói dịch vụ phù hợp để xây dựng AI Agent cho doanh nghiệp của bạn.',
    },
};

export default function Page() {
    return <PricingPage />;
}
