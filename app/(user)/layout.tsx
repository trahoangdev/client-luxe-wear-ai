'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Header from "@/components/layout/header";
import Footer from "@/components/Footer";
import Testimonials from "@/components/sections/Testimonials";
import CtaBanner from "@/components/sections/CtaBanner";

export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDocsPage = pathname?.startsWith('/docs');

  // Update document metadata for SEO
  useEffect(() => {
    if (pathname === '/') {
      document.title = 'LuxeWear AI - Nền tảng AI Agent cho Doanh nghiệp';
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', 'LuxeWear là nền tảng hoàn chỉnh để xây dựng và triển khai các tác nhân hỗ trợ AI cho doanh nghiệp. Tạo AI Agent thông minh với RAG, tích hợp dễ dàng và bảo mật cấp doanh nghiệp.');
      }
    }
  }, [pathname]);

  return (
    <>
      <Header />
      <main className="main">{children}</main>
      {!isDocsPage && (
        <>
          <Testimonials/>
          <CtaBanner/>
          <Footer />
        </>
      )}
    </>
  );
}
