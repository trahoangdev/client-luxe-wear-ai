export default function Testimonials() {
  return (
    <section className="mt-24">
      <div className="container mx-auto px-4">
        <div className="text-center">
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-xs text-muted-foreground">Testimonials</div>
          <h2 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight">What people say</h2>
          <p className="mt-2 text-sm text-muted-foreground">With over 9000 clients served, here's what they have to say</p>
        </div>

        <div className="mt-10 flex flex-wrap gap-6 items-stretch">
          {/* Big quote - flexible */}
          <div className="rounded-3xl border p-6 flex-1 min-w-[320px]">
            <p className="text-lg leading-relaxed">
              "LuxeWear is a strong signal of how customer support will evolve. It is an early adopter of the agentic approach, which will become increasingly effective, trusted, and prominent."
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
            <p className="text-lg leading-relaxed">"This is awesome, thanks for building it!"</p>
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
              <div className="text-sm text-muted-foreground">businesses trust LuxeWear</div>
            </div>
          </div>

          {/* 140+ countries - fixed 200px */}
          <div className="rounded-3xl border overflow-hidden w-[200px]">
            <img src="/images/testimonials/abstract-2.webp" className="w-full h-48 object-cover" alt="abstract" />
            <div className="p-6">
              <div className="text-4xl font-extrabold">140+</div>
              <div className="text-sm text-muted-foreground">countries served</div>
            </div>
          </div>

          {/* Short quote 2 - fixed 200px */}
          <div className="rounded-3xl border p-6 w-[200px]">
            <p className="text-lg leading-relaxed">"An overpowered tool built with the OP stack."</p>
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
              "Our chatbot has been great. Answers questions it knows, delegates to our talent when its stuck, knows how to push clients to the funnel. LuxeWear is what we use, 10/10 recommend."
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
