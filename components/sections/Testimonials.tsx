export default function Testimonials() {
  return (
    <section className="mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground">Đánh giá</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">Những gì mọi người nói</h2>
          <p className="mt-2 text-sm text-muted-foreground">Với hơn 9000 khách hàng đã sử dụng, đây là những gì họ nói</p>
        </div>

        <div className="mt-10 flex flex-wrap gap-6 items-stretch">
          {/* Big quote - flexible */}
          <div className="rounded-3xl border p-6 flex-1 min-w-[320px]">
            <p className="text-lg leading-relaxed">
              &quot;LuxeWear là một tín hiệu mạnh mẽ về cách hỗ trợ khách hàng sẽ phát triển. Đây là một trong những người tiên phong áp dụng phương pháp agentic, điều này sẽ ngày càng hiệu quả, đáng tin cậy và nổi bật.&quot;
            </p>
            <div className="mt-8 flex items-center gap-3">
              <img src="/images/testimonials/marc-manara.webp" className="h-10 w-10 rounded-full" alt="Marc Manara" />
              <div>
                <div className="text-sm font-semibold">Marc Manara</div>
                <div className="text-xs text-muted-foreground">OpenAI</div>
              </div>
            </div>
          </div>

          {/* Short quote - fixed 200px */}
          <div className="rounded-3xl border p-6 w-[200px]">
            <p className="text-lg leading-relaxed">&quot;Thật tuyệt vời, cảm ơn vì đã xây dựng nó!&quot;</p>
            <div className="mt-8 flex items-center gap-3">
              <img src="/images/testimonials/logan-kilpatrick.webp" className="h-10 w-10 rounded-full" alt="Logan Kilpatrick" />
              <div>
                <div className="text-sm font-semibold">Logan Kilpatrick</div>
                <div className="text-xs text-muted-foreground">Google</div>
              </div>
            </div>
          </div>

          {/* 9000+ stat - fixed 200px */}
          <div className="rounded-3xl border overflow-hidden w-[200px]">
            <img src="/images/testimonials/abstract-1.webp" className="w-full h-48 object-cover" alt="abstract" />
            <div className="p-6">
              <div className="text-4xl font-extrabold">9000+</div>
              <div className="text-sm text-muted-foreground">doanh nghiệp tin tưởng LuxeWear</div>
            </div>
          </div>

          {/* 140+ countries - fixed 200px */}
          <div className="rounded-3xl border overflow-hidden w-[200px]">
            <img src="/images/testimonials/abstract-2.webp" className="w-full h-48 object-cover" alt="abstract" />
            <div className="p-6">
              <div className="text-4xl font-extrabold">140+</div>
              <div className="text-sm text-muted-foreground">quốc gia được phục vụ</div>
            </div>
          </div>

          {/* Short quote 2 - fixed 200px */}
          <div className="rounded-3xl border p-6 w-[200px]">
            <p className="text-lg leading-relaxed">&quot;Một công cụ mạnh mẽ được xây dựng với OP stack.&quot;</p>
            <div className="mt-8 flex items-center gap-3">
              <img src="/images/testimonials/greg-kogan.webp" className="h-10 w-10 rounded-full" alt="Greg Kogan" />
              <div>
                <div className="text-sm font-semibold">Greg Kogan</div>
                <div className="text-xs text-muted-foreground">Pinecone</div>
              </div>
            </div>
          </div>

          {/* Long quote - flexible */}
          <div className="rounded-3xl border p-6 flex-1 min-w-[320px]">
            <p className="text-lg leading-relaxed">
              &quot;Chatbot của chúng tôi đã rất tuyệt vời. Trả lời các câu hỏi mà nó biết, chuyển giao cho nhân viên khi gặp khó khăn, biết cách đưa khách hàng vào funnel. LuxeWear là những gì chúng tôi sử dụng, khuyến nghị 10/10.&quot;
            </p>
            <div className="mt-8 flex items-center gap-3">
              <img src="/images/testimonials/martin-terskin.webp" className="h-10 w-10 rounded-full" alt="Martin Terskin" />
              <div>
                <div className="text-sm font-semibold">Martin Terskin</div>
                <div className="text-xs text-muted-foreground">OfferMarket</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
