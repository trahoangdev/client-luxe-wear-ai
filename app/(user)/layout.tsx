'use client';

import { usePathname } from 'next/navigation';
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
