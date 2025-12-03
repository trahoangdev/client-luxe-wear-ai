"use client";
import { useState } from "react";
import Input from "@/components/Input";
import Button from "@/components/Button";
import AuthService from "@/services/auth";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const res = await AuthService.register({ name, email, password });
      if (!res.accessToken) {
        setMessage("Đăng ký thành công. Vui lòng xác nhận email để đăng nhập.");
      } else {
        router.push("/");
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ maxWidth: 440, padding: "40px 0" }}>
      <div className="card" style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0 }}>Tạo tài khoản</h2>
        <p className="muted" style={{ margin: "6px 0 16px" }}>Bắt đầu miễn phí, nâng cấp sau.</p>
        <form onSubmit={handleSubmit}>
          <Input label="Tên" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Mật khẩu" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {message && <div className="muted" style={{ marginBottom: 8 }}>{message}</div>}
          {error && <div className="error-text">{error}</div>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
            <a className="nav-link" href="/login">Đã có tài khoản? Đăng nhập</a>
            <Button>{loading ? "Đang xử lý..." : "Tạo tài khoản"}</Button>
          </div>
        </form>
      </div>
    </main>
  );
}

