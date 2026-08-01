"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  currentPage: number;
  totalPages: number;
};

export default function Pagination({
  currentPage,
  totalPages,
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function goToPage(page: number) {
    const params = new URLSearchParams(searchParams);

    params.set("page", page.toString());

    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <div className="mt-8 flex items-center justify-center gap-6">
      <button
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded border px-4 py-2 disabled:opacity-50"
      >
        ← Previous
      </button>

      <span className="font-medium">
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
        className="rounded border px-4 py-2 disabled:opacity-50"
      >
        Next →
      </button>
    </div>
  );
}