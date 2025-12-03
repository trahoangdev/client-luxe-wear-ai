import { useState } from "react";

export function usePagination(initialPage = 1, initialPageSize = 12) {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [total, setTotal] = useState(0);

  const pageCount = pageSize > 0 ? Math.ceil(total / pageSize) : 0;

  const goNext = () => setPage((p) => (pageCount ? Math.min(pageCount, p + 1) : p + 1));
  const goPrev = () => setPage((p) => Math.max(1, p - 1));

  const reset = () => {
    setPage(1);
    setTotal(0);
  };

  return {
    page,
    pageSize,
    total,
    pageCount,
    setPage,
    setPageSize,
    setTotal,
    goNext,
    goPrev,
    reset,
  };
}


