import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UrlCard from "@/components/UrlCard";
import SearchBar from "@/components/SearchBar";
import SortDropdown from "@/components/SortDropdown";
import Pagination from "@/components/Pagination";

type Props = {
  searchParams: Promise<{
    search?: string;
    sort?: string;
    page?: string;
  }>;
};

export default async function DashboardPage({
  searchParams,
}: Props) {
  const { userId } = await auth();

  const {
    search = "",
    sort = "newest",
    page = "1",
  } = await searchParams;

  const currentPage = Number(page);
  const PAGE_SIZE = 5;
  const skip = (currentPage - 1) * PAGE_SIZE;

  if (!userId) {
    redirect("/sign-in");
  }

  const orderBy =
    sort === "oldest"
      ? { createdAt: "asc" as const }
      : sort === "clicks"
        ? { clickCount: "desc" as const }
        : { createdAt: "desc" as const };

  // Run all independent database queries in parallel
  const [totalLinks, clickStats, urls, latestUrl] = await Promise.all([
    prisma.url.count({
      where: {
        clerkUserId: userId,

        originalUrl: {
          contains: search,
          mode: "insensitive",
        },
      },
    }),

    prisma.url.aggregate({
      where: {
        clerkUserId: userId,
      },
      _sum: {
        clickCount: true,
      },
      _avg: {
        clickCount: true,
      },
    }),

    prisma.url.findMany({
      where: {
        clerkUserId: userId,

        originalUrl: {
          contains: search,
          mode: "insensitive",
        },
      },
      orderBy,

      skip,

      take: PAGE_SIZE,
    }),
    prisma.url.findFirst({
      where: {
        clerkUserId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const totalClicks = clickStats._sum.clickCount ?? 0;
  const averageClicks = clickStats._avg.clickCount ?? 0;
  const totalPages = Math.ceil(totalLinks / PAGE_SIZE);

  return (
    <main className="min-h-screen p-8">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold">
          Dashboard
        </h1>

        <div className="flex gap-4">
          <SearchBar />
          <SortDropdown />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        {/* Total Links */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">
            Total Links
          </h2>

          <p className="mt-2 text-3xl font-bold">
            {totalLinks}
          </p>
        </div>

        {/* Total Clicks */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">
            Total Clicks
          </h2>

          <p className="mt-2 text-3xl font-bold">
            {totalClicks}
          </p>
        </div>

        {/* Average Clicks */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">
            Average Clicks
          </h2>

          <p className="mt-2 text-3xl font-bold">
            {averageClicks.toFixed(1)}
          </p>
        </div>
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <h2 className="text-sm font-medium text-gray-500">
            Latest Link
          </h2>

          <p className="mt-2 truncate text-lg font-semibold">
            {latestUrl
              ? latestUrl.originalUrl
              : "No links yet"}
          </p>

          <p className="mt-1 text-sm text-gray-500">
            {latestUrl
              ? latestUrl.createdAt.toLocaleDateString()
              : ""}
          </p>
        </div>
      </div>

      {/* URL List */}
      {urls.length === 0 ? (
        <p className="text-gray-500">
          You have not created any shortened URLs yet.
        </p>
      ) :

        (
          <>
            <div className="space-y-4">
              {urls.map((url) => (
                <UrlCard
                  key={url.id}
                  url={url}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
            />
          </>
        )}
    </main>
  );
}