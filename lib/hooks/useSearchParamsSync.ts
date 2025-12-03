import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

/**
 * Hook tiện ích để đồng bộ state filter/search với URL query.
 */
export function useSearchParamsSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string | null | undefined) => {
      const params = new URLSearchParams(searchParams?.toString());
      if (value == null || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router, searchParams]
  );

  return {
    searchParams,
    setParam,
  };
}


