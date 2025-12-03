"use client";
import Header from "@/components/layout/header";
import Footer from "@/components/Footer";
import Testimonials from "@/components/sections/Testimonials";
import CtaBanner from "@/components/sections/CtaBanner";
export default function InfoPage() {
  return (
    <>
     
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left copy */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
            Các tác nhân AI
            <br />
            mang lại trải nghiệm kỳ diệu
            <br />
            cho khách hàng
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            LuxeWear là nền tảng hoàn chỉnh để xây dựng và triển khai các tác nhân hỗ trợ AI cho doanh nghiệp của bạn.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
            <a
              href="/auth/login"
              className="rounded-2xl px-6 py-3 text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
              style={{
                background:
                  "linear-gradient(90deg, #FF7A7A 0%, #FF8C5A 25%, #FFB056 50%, #A77BFF 75%, #6C7BFF 100%)",
              }}
            >
              Xây dựng đại lý của bạn
            </a>
            <span className="text-sm text-muted-foreground">Không cần thẻ tín dụng</span>
          </div>
        </div>

        {/* Right preview */}
        <div className="relative rounded-3xl border bg-muted/40 p-6 lg:p-10 group hover:shadow-lg transition-shadow duration-300">
          {/* Mock chat bubbles */}
          <div className="absolute left-1/2 top-16 w-[70%] -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="mx-auto mb-4 inline-flex items-center gap-3 rounded-full border bg-background px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
              <span className="text-sm text-muted-foreground">I want to upgrade to the premium plan</span>
              <span className="h-8 w-8 overflow-hidden rounded-full bg-muted" />
            </div>
          </div>
          <div className="absolute left-1/2 top-36 w-[65%] -translate-x-1/2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            <div className="mx-auto inline-flex items-center gap-3 rounded-full border bg-background px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-foreground text-background">★</span>
              <span className="text-sm text-muted-foreground">Sure! I&apos;ve just updated that.</span>
            </div>
          </div>

          <VideoPlayer
            src="/videos/hero.webm"
            className="rounded-2xl w-full h-[420px] object-cover"
            autoPlay
            loop
            muted
          />
        </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mt-20 md:mt-32">
        <div className="container mx-auto px-4">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-pink-500" /> Điểm nổi bật
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">Nền tảng hoàn chỉnh cho các tác nhân hỗ trợ AI</h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            LuxeWear được thiết kế để xây dựng các tác nhân hỗ trợ AI có khả năng giải quyết những vấn đề khó khăn nhất của khách hàng đồng thời cải thiện kết quả kinh doanh.
          </p>
        </div>
        <div className="mt-10 md:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="rounded-3xl border bg-background p-6 hover:shadow-lg transition-all duration-300 hover:border-foreground/20">
            <div className="rounded-2xl overflow-hidden border">
              <img
                src="/images/home/purpose-built-for-llms.webp"
                alt="purpose-built-for-llms"
                className="w-full transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="mt-5">
              <div className="text-xl font-bold mb-2">Được xây dựng có mục đích cho LLM</div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Mô hình ngôn ngữ có khả năng lý luận để trả lời hiệu quả các truy vấn phức tạp.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="rounded-3xl border bg-background p-6 hover:shadow-lg transition-all duration-300 hover:border-foreground/20">
            <div className="rounded-2xl overflow-hidden border">
              <img
                src="/images/home/designed-for-simplicity.webp"
                alt="designed-for-simplicity"
                className="w-full transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="mt-5">
              <div className="text-xl font-bold mb-2">Được thiết kế để đơn giản</div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Tạo, quản lý và triển khai AI Agent dễ dàng, ngay cả khi không có kỹ năng kỹ thuật.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="rounded-3xl border bg-background p-6 hover:shadow-lg transition-all duration-300 hover:border-foreground/20">
            <div className="rounded-2xl overflow-hidden border">
              <img
                src="/images/home/engineered-for-security.webp"
                alt="engineered-for-security"
                className="w-full transition-transform duration-300 hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="mt-5">
              <div className="text-xl font-bold mb-2">Được thiết kế để bảo mật</div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Tận hưởng sự an tâm với mã hóa mạnh mẽ và các tiêu chuẩn tuân thủ nghiêm ngặt.
              </p>
            </div>
          </div>
        </div>
        </div>

      </section>

      {/* How it works */}
      <section className="mt-24 md:mt-32">
        <div className="container mx-auto px-4">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-pink-500" /> Nó hoạt động như thế nào
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start">
          <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Giải pháp toàn diện cho AI đàm thoại
          </h3>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            Với LuxeWear, khách hàng của bạn có thể dễ dàng tìm thấy câu trả lời, giải quyết vấn đề và thực hiện các hành động có ý nghĩa thông qua các cuộc trò chuyện liền mạch và hấp dẫn do AI điều khiển.
          </p>
        </div>
        {/* client component */}
        <StepsShowcase />
        </div>
      </section>

      {/* Features Grid */}
      <section className="mt-24 md:mt-32">
        <div className="container mx-auto px-4">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
          <span className="h-2 w-2 rounded-full bg-pink-500" /> Đặc trưng
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-start">
          <h3 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Xây dựng một tác nhân AI hoàn hảo hướng tới khách hàng
          </h3>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
            LuxeWear cung cấp cho bạn mọi công cụ cần thiết để đào tạo tác nhân AI hoàn hảo và kết nối với hệ thống của bạn.
          </p>
        </div>

        {/* top row */}
        <div className="mt-8 md:mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-3xl border bg-background p-6 hover:shadow-lg transition-all duration-300 hover:border-foreground/20">
            <div className="rounded-2xl overflow-hidden border">
              <img src="/images/build/sync-with-realtime-data.webp" alt="sync-with-realtime-data" className="w-full transition-transform duration-300 hover:scale-105" />
            </div>
            <div className="mt-5">
              <div className="text-lg font-semibold mb-2">Đồng bộ hóa với dữ liệu thời gian thực</div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Kết nối đại lý của bạn với các hệ thống như công cụ quản lý đơn hàng, CRM, v.v. để truy cập dữ liệu liền mạch, từ chi tiết đơn hàng đến các đăng ký đang hoạt động và hơn thế nữa.
              </p>
            </div>
          </div>
          <div className="rounded-3xl border bg-background p-6 hover:shadow-lg transition-all duration-300 hover:border-foreground/20">
            <div className="rounded-2xl overflow-hidden border">
              <img src="/images/build/take-actions-on-your-systems.webp" alt="take-actions-on-your-systems" className="w-full transition-transform duration-300 hover:scale-105" />
            </div>
            <div className="mt-5">
              <div className="text-lg font-semibold mb-2">Thực hiện hành động trên hệ thống của bạn</div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Cấu hình các hành động mà đại lý của bạn có thể thực hiện trong hệ thống hoặc thông qua một trong các tích hợp của chúng tôi, chẳng hạn như cập nhật đăng ký của khách hàng hoặc thay đổi địa chỉ của họ.
              </p>
            </div>
          </div>
        </div>

        {/* bottom row */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="rounded-3xl border bg-background p-6 hover:shadow-lg transition-all duration-300 hover:border-foreground/20">
            <div className="rounded-2xl overflow-hidden border">
              <img src="/images/build/compare-ai-models.webp" alt="compare-ai-models" className="w-full transition-transform duration-300 hover:scale-105" />
            </div>
            <div className="mt-5">
              <div className="text-lg font-semibold mb-2">So sánh các mô hình AI</div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Thử nghiệm với nhiều mô hình và cấu hình khác nhau để đảm bảo bạn có thiết lập tối ưu nhất cho trường hợp sử dụng của mình.
              </p>
            </div>
          </div>
          <div className="rounded-3xl border bg-background p-6 hover:shadow-lg transition-all duration-300 hover:border-foreground/20">
            <div className="rounded-2xl overflow-hidden border">
              <img src="/images/build/smart-escalation.webp" alt="smart-escalation" className="w-full transition-transform duration-300 hover:scale-105" />
            </div>
            <div className="mt-5">
              <div className="text-lg font-semibold mb-2">Leo thang thông minh</div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Hướng dẫn bằng ngôn ngữ tự nhiên cho nhân viên của bạn về thời điểm chuyển tiếp câu hỏi đến nhân viên thực sự.
              </p>
            </div>
          </div>
          <div className="rounded-3xl border bg-background p-6 hover:shadow-lg transition-all duration-300 hover:border-foreground/20">
            <div className="rounded-2xl overflow-hidden border">
              <img src="/images/build/advanced-reporting.webp" alt="advanced-reporting" className="w-full transition-transform duration-300 hover:scale-105" />
            </div>
            <div className="mt-5">
              <div className="text-lg font-semibold mb-2">Báo cáo nâng cao</div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Nhận thông tin chi tiết và tối ưu hiệu quả hoạt động của đại lý với phân tích chi tiết.
              </p>
            </div>
          </div>
        </div>
        </div>
      </section>
 
      {/* Advantages Slider */}
      <AdvantagesSlider />
 
 
      {/* Security */}
      <SecuritySection />
 
      {/* CTA - top footer banner */}
 
    </>
  );
}


import { useState } from "react";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Shield, Pause, Play } from "lucide-react";

function VideoPlayer({
  src,
  className,
  autoPlay,
  loop,
  muted,
  onLoaded,
  preload = "auto",
}: {
  src: string;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  onLoaded?: () => void;
  preload?: "auto" | "metadata" | "none";
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(!!autoPlay);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onTime = () => {
      if (!v.duration) return;
      setProgress(v.currentTime / v.duration);
    };
    const onLoadedData = () => {
      onLoaded?.();
    };
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("loadeddata", onLoadedData);
    return () => {
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("loadeddata", onLoadedData);
    };
  }, [onLoaded]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const circumference = 2 * Math.PI * 14.8; // ~92.9
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="relative group">
      <video
        ref={videoRef}
        src={src}
        className={className}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        preload={preload}
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? "Pause video" : "Play video"}
        className="absolute bottom-4 left-4 rounded-full bg-black/25 p-2 opacity-90 transition-opacity md:p-3 group-hover:opacity-100"
      >
        <svg aria-label="video progress" role="img" className="-rotate-90 absolute top-0 left-0 h-full w-full" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="14.8" fill="none" stroke="white" strokeWidth="2.3" strokeDasharray={circumference} strokeDashoffset={dashOffset} className="opacity-90" />
        </svg>
        {isPlaying ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" className="relative h-4 w-4 md:h-6 md:w-6" aria-hidden="true">
            <rect x="14" y="4" width="4" height="16" rx="1"></rect>
            <rect x="6" y="4" width="4" height="16" rx="1"></rect>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="currentColor" strokeWidth="0" strokeLinecap="round" strokeLinejoin="round" className="relative h-4 w-4 md:h-6 md:w-6" aria-hidden="true">
            <polygon points="6 3 20 12 6 21 6 3"></polygon>
          </svg>
        )}
      </button>
    </div>
  );
}

function StepsShowcase() {
  const steps = [
    {
      num: "01",
      header: "Xây dựng và triển khai tác nhân của bạn",
      desc:
        "Đào tạo một nhân viên về dữ liệu doanh nghiệp của bạn, cấu hình các hành động mà nhân viên đó có thể thực hiện, sau đó triển khai cho khách hàng của bạn.",
      video: "/videos/step/build-and-deploy.webm",
    },
    {
      num: "02",
      header: "Đại lý giải quyết vấn đề của khách hàng",
      desc:
        "Người đại diện sẽ trả lời các câu hỏi và truy cập vào các hệ thống bên ngoài để thu thập dữ liệu và thực hiện hành động.",
      video: "/videos/step/agent-responds.webm",
    },
    {
      num: "03",
      header: "Tinh chỉnh và tối ưu hóa",
      desc: "Điều này đảm bảo rằng tác nhân của bạn sẽ cải thiện theo thời gian.",
      video: "/videos/step/refine-and-optimize.webm",
    },
    {
      num: "04",
      header: "Chuyển các vấn đề phức tạp đến con người",
      desc:
        "Chuyển tiếp liền mạch một số truy vấn nhất định tới tác nhân con người khi tác nhân AI không thể giải quyết vấn đề hoặc khi các vấn đề cần được con người xem xét.",
      video: "/videos/step/review-analytics.webm",
    },
    {
      num: "05",
      header: "Đánh giá phân tích và thông tin chi tiết",
      desc:
        "Vì nhân viên phải nói chuyện với khách hàng cả ngày nên có thể thu thập thông tin chi tiết và phân tích quan trọng về khách hàng và doanh nghiệp của bạn.",
      video: "/videos/step/route-complex-issues.webm",
    },
  ];

  // selectedIdx: bước đang được chọn để hiển thị video
  const [selectedIdx, setSelectedIdx] = useState(0);
  // openIdx: bước đang mở mô tả
  const [openIdx, setOpenIdx] = useState<number>(0);
  // trạng thái cho hiệu ứng video
  const [videoReady, setVideoReady] = useState(false);
  const didMountRef = useRef(false);

  const onClickStep = (idx: number) => {
    setSelectedIdx(idx);
  };

  useEffect(() => {
    // Auto mở mô tả của step được chọn và reset hiệu ứng video
    setOpenIdx(selectedIdx);
    if (didMountRef.current) {
      setVideoReady(false);
    } else {
      // Lần render đầu tiên: cho video sẵn sàng và phát ngay cả khi chưa scroll
      setVideoReady(true);
      didMountRef.current = true;
    }
  }, [selectedIdx]);

  return (
    <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Left steps list */}
      <div className="space-y-3">
        {steps.map((s, idx) => (
          <button
            key={idx}
            onClick={() => onClickStep(idx)}
            className={`w-full rounded-2xl border p-5 text-left transition ${
              selectedIdx === idx ? "bg-background shadow-sm border-foreground/20" : "text-muted-foreground"
            }`}
          >
            <div className="flex items-start gap-4">
              <span className={`mt-1 text-sm font-semibold ${selectedIdx === idx ? "text-rose-500" : "text-muted-foreground"}`}>{s.num}</span>
              <div className="flex-1">
                <div className={`text-base md:text-lg font-semibold ${selectedIdx === idx ? "text-foreground" : ""}`}>{s.header}</div>
                <div
                  className={`overflow-hidden transition-all duration-500 ease-out ${
                    openIdx === idx ? "max-h-40 opacity-100 mt-1" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-sm md:text-[15px] text-muted-foreground max-w-xl">{s.desc}</p>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Right video */}
      <div className="rounded-3xl border bg-muted/40 p-4 lg:p-8">
        <VideoPlayer
          key={steps[selectedIdx].video}
          src={steps[selectedIdx].video}
          className="w-full h-[420px] rounded-2xl object-cover"
          autoPlay
          loop
          muted
          preload="auto"
          onLoaded={() => setVideoReady(true)}
        />
      </div>
    </div>
  );
}

function AdvantagesSlider() {
  const items = [
    {
      img: "/images/advantages/works-across-channels.webp",
      title: "Works across channels",
      desc:
        "Easily integrate your AI Agent with various platforms like Slack, WhatsApp, Messenger, and web widgets, ensuring seamless functionality across all.",
    },
    {
      img: "/images/advantages/secure-by-default.webp",
      title: "Secure by default",
      desc:
        "Your AI Agent ensures the utmost safety by refusing sensitive or unauthorized requests, keeping your data protected at all times.",
    },
    {
      img: "/images/advantages/enterprise-quality-guardrails.webp",
      title: "Enterprise quality guardrails",
      desc:
        "AI-powered guardrails prevent misinformation and off-topic responses, maintaining professionalism and trust in every interaction.",
    },
    {
      img: "/images/advantages/handles-unclear-requests.webp",
      title: "Handles unclear requests",
      desc:
        "Politely declines or asks follow-up questions when requests are ambiguous or risky, ensuring safe and accurate assistance.",
    },
  ];

  const [index, setIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const len = items.length;
  const goPrev = () => {
    setAnimating(true);
    setTimeout(() => {
      setIndex((i) => (i - 1 + len) % len);
      setAnimating(false);
    }, 400);
  };
  const goNext = () => {
    setAnimating(true);
    setTimeout(() => {
      setIndex((i) => (i + 1) % len);
      setAnimating(false);
    }, 400);
  };

  // Autoplay with delay for smoothness
  useEffect(() => {
    const id = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setIndex((i) => (i + 1) % len);
        setAnimating(false);
      }, 400);
    }, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="mt-24 md:mt-32">
      <div className="container mx-auto px-4">
      <div className="text-center">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground">Advantages</div>
        <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
          Unlock the power of AI-driven Agents
        </h2>
      </div>

      <div className="mt-10">
        {/* Show 3 cards; move by 1 on click with wrap-around */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[0, 1, 2].map((offset) => {
            const it = items[(index + offset) % len];
            return (
              <div
                key={offset}
                className={`mx-auto max-w-xl transition-all duration-500 ease-out ${
                  animating ? "translate-x-3 opacity-0" : "translate-x-0 opacity-100"
                }`}
              >
                <img src={it.img} alt={it.title} className="w-full rounded-3xl border" />
                <div className="mt-5">
                  <div className="text-2xl font-semibold">{it.title}</div>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground max-w-xl">{it.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex items-center justify-center gap-6">
          <button onClick={goPrev} className="inline-flex h-10 w-10 items-center justify-center rounded-full border">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={goNext} className="inline-flex h-10 w-10 items-center justify-center rounded-full border">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      </div>
    </section>
  );
}

function SecuritySection() {
  return (
    <section className="mt-24 md:mt-32">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
        {/* Left: Heading + copy + badges */}
        <div className="space-y-6">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground">Security</div>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Enterprise-grade
            <br />
            security & privacy
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            We take security and compliance seriously. LuxeWear is SOC 2 Type II and
            GDPR compliant, trusted by thousands of businesses to build secure and
            compliant AI Agents.
          </p>
          <div className="mt-8 flex items-center gap-8">
            <img src="/images/security/soc-2.webp" alt="SOC 2" className="h-20 w-auto" />
            <img src="/images/security/gdpr.webp" alt="GDPR" className="h-20 w-auto" />
          </div>
        </div>

        {/* Right: Detail cards */}
        <div className="rounded-3xl border overflow-hidden divide-y hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between p-6 md:p-8 hover:bg-muted/30 transition-colors">
            <div className="max-w-xl">
              <h3 className="text-xl font-semibold mb-2">Your data stays yours</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Your data is only accessible to your AI agent and is never used to train models.
              </p>
            </div>
            <img src="/images/security/database.webp" alt="Database" className="h-24 md:h-28 w-auto" />
          </div>
          <div className="flex items-center justify-between p-6 md:p-8 hover:bg-muted/30 transition-colors">
            <div className="max-w-xl">
              <h3 className="text-xl font-semibold mb-2">Data encryption</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                All data is encrypted at rest and in transit using industry-standard encryption algorithms.
              </p>
            </div>
            <img src="/images/security/lock.webp" alt="Lock" className="h-24 md:h-28 w-auto" />
          </div>
          <div className="flex items-center justify-between p-6 md:p-8 hover:bg-muted/30 transition-colors">
            <div className="max-w-xl">
              <h3 className="text-xl font-semibold mb-2">Secure integrations</h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                We use verified variables to ensure users can access only their own data in your systems.
              </p>
            </div>
            <img src="/images/security/cube.webp" alt="Cube" className="h-24 md:h-28 w-auto" />
          </div>
        </div>
      </div>

      {/* Commitment bar */}
      <div className="container mx-auto px-6 mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border py-4 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center gap-2 text-sm">
          <Shield className="h-4 w-4" />
          <span>LuxeWear is committed to safeguarding your data.</span>
        </div>
        <a href="/docs/user-guides" className="inline-flex items-center gap-1 text-sm font-medium hover:text-foreground transition-colors">
          Learn more <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}
