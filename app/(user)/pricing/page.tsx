"use client";

import { useState } from "react";

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      key: "free",
      name: "Miễn phí",
      icon: "/images/pricing/star-1.svg",
      priceMonthly: 0,
      priceYearly: 0,
      cta: "Bắt đầu",
      features: [
        "Truy cập các mô hình nhanh",
        "100 tin nhắn/tháng",
        "1 AI Agent",
        "1 Hành động AI cho mỗi AI Agent",
        "400 KB cho mỗi AI Agent",
        "1 chỗ ngồi",
        "Truy cập API",
        "Nhúng trên website không giới hạn",
      ],
      footnote: "AI Agent sẽ bị xóa sau 14 ngày không hoạt động trên gói miễn phí.",
    },
    {
      key: "hobby",
      name: "Hobby",
      icon: "/images/pricing/star-2.svg",
      priceMonthly: 40,
      priceYearly: 400,
      cta: "Đăng ký",
      features: [
        "Tất cả trong gói Miễn phí +",
        "2,000 tin nhắn/tháng",
        "1 AI Agent",
        "5 Hành động AI cho mỗi AI Agent",
        "40 MB cho mỗi AI Agent",
        "Liên kết không giới hạn để huấn luyện",
        "Phân tích cơ bản",
      ],
    },
    {
      key: "standard",
      name: "Standard",
      icon: "/images/pricing/star-3.svg",
      priceMonthly: 150,
      priceYearly: 1500,
      cta: "Đăng ký",
      popular: true,
      features: [
        "Tất cả trong gói Hobby +",
        "12,000 tin nhắn/tháng",
        "2 AI Agent",
        "10 Hành động AI cho mỗi AI Agent",
        "3 chỗ ngồi",
      ],
    },
    {
      key: "pro",
      name: "Pro",
      icon: "/images/pricing/star-4.svg",
      priceMonthly: 500,
      priceYearly: 5000,
      cta: "Đăng ký",
      features: [
        "Tất cả trong gói Standard +",
        "40,000 tin nhắn/tháng",
        "3 AI Agent",
        "15 Hành động AI cho mỗi AI Agent",
        "5+ chỗ ngồi",
        "Phân tích nâng cao",
      ],
    },
    {
      key: "enterprise",
      name: "Enterprise",
      icon: "/images/pricing/star-5.svg",
      priceMonthly: null,
      priceYearly: null,
      cta: "Liên hệ chúng tôi",
      features: [
        "Tất cả trong gói Pro +",
        "Giới hạn cao hơn",
        "Hỗ trợ ưu tiên",
        "SLA",
        "Quản lý thành công (CSM)",
      ],
    },
  ];

  return (
    <section className="py-14 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Giá cả minh bạch
            <br /> Gói dịch vụ mở rộng
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
            Được thiết kế cho mọi giai đoạn hành trình của bạn.
          </p>

          <div className="mt-6 inline-flex items-center rounded-full border bg-background p-1 text-sm shadow-sm">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                billing === "monthly" ? "bg-foreground text-background shadow-sm" : "hover:bg-muted"
              }`}
            >
              Hàng tháng
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`px-4 py-1.5 rounded-full transition-all duration-200 ${
                billing === "yearly" ? "bg-foreground text-background shadow-sm" : "hover:bg-muted"
              }`}
            >
              Hàng năm
            </button>
          </div>
        </div>

        {/* Pricing grid */}
        <div className="mt-10 md:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {plans.map((plan) => (
            <div key={plan.key} className={`rounded-3xl border bg-background transition-all duration-300 hover:shadow-lg ${plan.popular ? 'ring-2 ring-foreground/20' : 'hover:border-foreground/20'}`}>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <div className="inline-flex items-center gap-2 text-sm font-semibold">
                  <img src={plan.icon} alt="star" className="h-4 w-4" />
                  <span>{plan.name}</span>
                </div>
                {plan.popular ? (
                  <span className="rounded-full bg-black text-white text-xs px-3 py-1 font-medium">Phổ biến</span>
                ) : null}
              </div>

              {/* Price */}
              <div className="px-6 pt-6">
                {plan.priceMonthly === null ? (
                  <div className="text-2xl font-semibold">Liên hệ</div>
                ) : (
                  <>
                    <div className="text-4xl font-extrabold">
                      ${billing === "monthly" ? plan.priceMonthly : plan.priceYearly}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {billing === "monthly" ? "mỗi tháng" : "mỗi năm"}
                    </div>
                  </>
                )}

                <button
                  className={`mt-6 w-full rounded-xl px-4 py-3 text-sm font-medium border transition-all duration-200 ${
                    plan.popular 
                      ? "bg-black text-white border-black hover:bg-black/90 hover:shadow-md" 
                      : "bg-background hover:bg-muted hover:border-foreground/20"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>

              {/* Features */}
              <ul className="px-6 py-6 space-y-3 text-sm">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="mt-1.5 inline-block h-1.5 w-1.5 rounded-full bg-foreground shrink-0" />
                    <span className="leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>

              {plan.footnote ? (
                <div className="px-6 pb-6 text-[11px] text-muted-foreground">
                  {plan.footnote}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
