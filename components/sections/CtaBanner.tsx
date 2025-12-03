import { CreditCard } from "lucide-react";

export default function CtaBanner() {
  return (
    <section className="relative overflow-hidden pt-[70px] pb-[60px] mt-20">
      <img
        src="/images/topFooter/cta.webp"
        alt=""
        className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
      />
      <div className="relative z-10 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
            Make customer experience your
            <br />
            competitive edge
          </h2>
          <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">
            Use LuxeWear to deliver exceptional support experiences that set you apart from the competition.
          </p>
          <div className="mt-10 inline-flex flex-col items-center gap-3">
            <button className="relative inline-flex items-center justify-center rounded-full bg-black px-8 py-4 text-white text-lg font-medium shadow-sm">
              Build your agent
              <span className="pointer-events-none absolute inset-x-0 -bottom-1 h-1 rounded-b-full bg-gradient-to-r from-pink-500 to-purple-500" />
            </button>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <span>No credit card required</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
