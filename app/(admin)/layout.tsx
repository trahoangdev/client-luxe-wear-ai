import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import Providers from "@/components/providers";
import 'antd/dist/reset.css';

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <div className="min-h-screen flex flex-col bg-background">
        <AdminHeader />
        <div className="flex flex-1">
          <AdminSidebar />
          <main className="flex-1 p-6 bg-background">{children}</main>
        </div>
      </div>
    </Providers>
  );
}
