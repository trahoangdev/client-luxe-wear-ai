"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/services/observabilityService";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const paramsObj: Record<string, string> = {};
    searchParams?.forEach((value, key) => {
      paramsObj[key] = value;
    });

    void trackEvent("page_view", {
      path: pathname,
      query: paramsObj,
    });
  }, [pathname, searchParams]);

  return null;
}


