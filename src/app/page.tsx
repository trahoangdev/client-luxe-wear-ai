import Button from "@/components/Button";

export default function Home() {
  return (
    <main>
      <section className="banner">
        <div className="container banner-inner">
          <div>
            <h1 className="banner-title">Live Chat</h1>
            <p className="banner-subtitle">Interact with customers in a faster way</p>
          </div>
          <img className="banner-graphic" src="/banner-livechat.png" alt="Live chat illustration" />
        </div>
      </section>
      <section className="container hero">
        <h1 style={{ fontWeight: 800 }}>Luxe Wear AI</h1>
        <p>AI Agent bán hàng thời trang - tích hợp nội bộ hoặc website đối tác.</p>
        <div className="actions">
          <Button href="/register">Bắt đầu miễn phí</Button>
          <Button variant="outline" href="/login">Đăng nhập</Button>
        </div>
      </section>
      <section className="features container">
        <div className="feature">
          <h3>RAG + Gemini</h3>
          <p>Hiểu sản phẩm từ kiến thức của bạn, trả lời chính xác theo ngữ cảnh.</p>
        </div>
        <div className="feature">
          <h3>Tích hợp nhanh</h3>
          <p>API key công khai cho website thứ 3, kiểm soát allowed origins.</p>
        </div>
        <div className="feature">
          <h3>Phân tích</h3>
          <p>Ghi nhận hội thoại để cải thiện tỉ lệ chuyển đổi.</p>
        </div>
      </section>
      <section id="pricing" className="container">
        <h2 style={{ textAlign: "center", marginBottom: 16 }}>Bảng giá</h2>
        <p className="muted" style={{ textAlign: "center", marginBottom: 24 }}>Chọn gói phù hợp, có thể nâng cấp bất kỳ lúc nào.</p>
        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="plan">Starter</div>
            <div className="price">0đ<span className="muted">/tháng</span></div>
            <ul className="benefits">
              <li>1 Agent</li>
              <li>500 tin nhắn/tháng</li>
              <li>Tích hợp web công khai (API key)</li>
            </ul>
            <Button href="/register">Dùng thử</Button>
          </div>
          <div className="pricing-card highlight">
            <div className="plan">Pro</div>
            <div className="price">499.000đ<span className="muted">/tháng</span></div>
            <ul className="benefits">
              <li>5 Agents</li>
              <li>10.000 tin nhắn/tháng</li>
              <li>Vector RAG nhanh hơn</li>
              <li>Phân tích hội thoại</li>
              <li>Hỗ trợ ưu tiên</li>
            </ul>
            <Button href="/register">Chọn Pro</Button>
          </div>
          <div className="pricing-card">
            <div className="plan">Business</div>
            <div className="price">Liên hệ</div>
            <ul className="benefits">
              <li>Không giới hạn Agents</li>
              <li>Tùy biến mô hình</li>
              <li>SLA doanh nghiệp</li>
            </ul>
            <Button href="/register">Liên hệ</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
