"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";

/**
 * Hook to manage URL search params for filters
 * Preserves filter state in URL for sharing and refresh
 */
export function useUrlFilters<T extends Record<string, string>>(
  defaults: T
): {
  getFilter: (key: keyof T) => string;
  setFilter: (key: keyof T, value: string) => void;
  getAllFilters: () => T;
  clearFilters: () => void;
} {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const getFilter = useCallback(
    (key: keyof T): string => {
      const value = searchParams.get(String(key));
      return value || defaults[key] || "";
    },
    [searchParams, defaults]
  );

  const setFilter = useCallback(
    (key: keyof T, value: string) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      const defaultValue = defaults[key];

      // Remove param if value is default or empty
      if (!value || value === defaultValue) {
        current.delete(String(key));
      } else {
        current.set(String(key), value);
      }

      // Update URL without page reload
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.replace(`${pathname}${query}`, { scroll: false });
    },
    [searchParams, router, pathname, defaults]
  );

  const getAllFilters = useCallback((): T => {
    const filters = { ...defaults };
    for (const key in defaults) {
      const value = searchParams.get(key);
      if (value) {
        filters[key] = value;
      }
    }
    return filters;
  }, [searchParams, defaults]);

  const clearFilters = useCallback(() => {
    router.replace(pathname, { scroll: false });
  }, [router, pathname]);

  return {
    getFilter,
    setFilter,
    getAllFilters,
    clearFilters,
  };
}

