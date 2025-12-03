import Link from "next/link";
import { Linkedin, Instagram, X, Youtube } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative bg-black text-white">
      {/* Watermark */}


      <div className="container mx-auto px-4 pt-16 pb-5 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand & actions */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-white text-black font-bold">L</span>
              <span className="text-lg font-semibold">LuxeWear</span>
            </div>
            <div className="text-sm text-zinc-400">© 2025 LuxeWear, Inc.</div>

            <div className="flex items-center gap-3">
              <Link href="#" className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium">Contact</Link>
              <Link href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-zinc-900 border border-zinc-800"><Linkedin className="h-5 w-5" /></Link>
              <Link href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-zinc-900 border border-zinc-800"><Instagram className="h-5 w-5" /></Link>
              <Link href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-zinc-900 border border-zinc-800"><X className="h-5 w-5" /></Link>
              <Link href="#" className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-zinc-900 border border-zinc-800"><Youtube className="h-5 w-5" /></Link>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <Image
                src="/images/security/soc-2.webp"
                alt="SOC2"
                width={120}
                height={56}
                className="h-14 w-auto"
                sizes="(min-width: 768px) 120px, 96px"
              />
              <Image
                src="/images/security/gdpr.webp"
                alt="GDPR"
                width={120}
                height={56}
                className="h-14 w-auto"
                sizes="(min-width: 768px) 120px, 96px"
              />
            </div>
          </div>

          {/* Columns */}
          <div>
            <div className="text-sm font-semibold tracking-wide text-zinc-300">PRODUCT</div>
            <ul className="mt-3 space-y-3 text-sm text-zinc-400">
              <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
              <li><Link href="/pricing" className="hover:text-white">Pricing</Link></li>
              <li><Link href="/docs/user-guides" className="hover:text-white">Security</Link></li>
              <li><Link href="#" className="hover:text-white">Affiliates</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide text-zinc-300">RESOURCES</div>
            <ul className="mt-3 space-y-3 text-sm text-zinc-400">
              <li><Link href="/auth/login" className="hover:text-white">Login</Link></li>
              <li><Link href="/docs/user-guides" className="hover:text-white">Docs</Link></li>
              <li><Link href="/docs/your-first-agent" className="hover:text-white">Guide</Link></li>
              <li><Link href="/dashboard/pages/users" className="hover:text-white">Users</Link></li>
              <li><Link href="/dashboard/pages/settings" className="hover:text-white">Settings</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide text-zinc-300">COMPANY</div>
            <ul className="mt-3 space-y-3 text-sm text-zinc-400">
              <li><Link href="#" className="hover:text-white">Careers</Link></li>
              <li><Link href="#" className="hover:text-white">Privacy policy</Link></li>
              <li><Link href="#" className="hover:text-white">Terms of service</Link></li>
              <li><Link href="#" className="hover:text-white">DPA</Link></li>
              <li><Link href="#" className="hover:text-white">Cookie policy</Link></li>
              <li><Link href="#" className="hover:text-white">Trust center</Link></li>
              <li><Link href="#" className="hover:text-white">Cookie preferences</Link></li>
            </ul>
          </div>
        </div>
        <section className="mx-auto flex w-full max-w-(--breakpoint-xl) px-6 xl:-mt-14 lg:-mt-10 md:-mt-4 sm:-mt-10 overflow-hidden pb-1 md:pb-3 lg:pb-0" data-sentry-element="ContentWrapper" data-sentry-source-file="ContentWrapper.tsx" data-sentry-component="ContentWrapper">
          <Image src="/images/footer/iconGobal.png" alt="Watermark" width={2000} height={2000} />
        </section>
      </div>
    </footer>
  );
}
