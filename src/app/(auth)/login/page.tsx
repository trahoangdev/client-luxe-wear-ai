"use client";
import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import AuthService from "@/services/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await AuthService.login({ email, password });
      router.push("/");
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ maxWidth: 440, padding: "40px 0" }}>
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0 }}>Đăng nhập</h2>
        <p className="muted" style={{ margin: "6px 0 16px" }}>Chào mừng quay lại 👋</p>
        <form onSubmit={handleSubmit}>
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <div className="error-text">{error}</div>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
            <a className="nav-link" href="/register">Chưa có tài khoản? Đăng ký</a>
            <Button>{loading ? "Đang xử lý..." : "Đăng nhập"}</Button>
          </div>
        </form>
      </div>
    </main>
  );
}

