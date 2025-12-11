import { Inter } from "next/font/google";
import type { Metadata } from "next";
import "./globals.scss";
import StoreProvider from "@/components/StoreProvider";
import { Toaster } from "sonner";
import AnalyticsTracker from "@/components/AnalyticsTracker";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://client-luxe-wear-ai.vercel.app"),
  title: {
    default: "LuxeWear AI - Nền tảng AI Agent cho Doanh nghiệp",
    template: "%s | LuxeWear AI",
  },
  description: "LuxeWear là nền tảng hoàn chỉnh để xây dựng và triển khai các tác nhân hỗ trợ AI cho doanh nghiệp. Tạo AI Agent thông minh với RAG, tích hợp dễ dàng và bảo mật cấp doanh nghiệp.",
  keywords: [
    "AI Agent",
    "AI Assistant",
    "Chatbot",
    "RAG",
    "Retrieval Augmented Generation",
    "AI cho doanh nghiệp",
    "Customer Support AI",
    "AI Vietnam",
    "LuxeWear",
    "AI Platform",
  ],
  authors: [{ name: "LuxeWear AI" }],
  creator: "LuxeWear AI",
  publisher: "LuxeWear AI",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "/",
    siteName: "LuxeWear AI",
    title: "LuxeWear AI - Nền tảng AI Agent cho Doanh nghiệp",
    description: "Xây dựng và triển khai các tác nhân hỗ trợ AI thông minh cho doanh nghiệp của bạn với LuxeWear.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LuxeWear AI - Nền tảng AI Agent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LuxeWear AI - Nền tảng AI Agent cho Doanh nghiệp",
    description: "Xây dựng và triển khai các tác nhân hỗ trợ AI thông minh cho doanh nghiệp.",
    images: ["/og-image.png"],
    creator: "@luxewearai",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body className={inter.className}>
        <StoreProvider>
          <AnalyticsTracker />
          {children}
          <Toaster position="top-right" richColors closeButton />
        </StoreProvider>
      </body>
    </html>
  );
}
