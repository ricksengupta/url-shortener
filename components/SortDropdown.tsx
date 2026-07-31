"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSort(value: string) {
    const params = new URLSearchParams(searchParams);

    params.set("sort", value);

    router.push(`/dashboard?${params.toString()}`);
  }

  return (
    <select
      defaultValue={searchParams.get("sort") ?? "newest"}
      onChange={(e) => handleSort(e.target.value)}
      className="rounded-lg border p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
      <option value="clicks">Most Clicked</option>
    </select>
  );
}