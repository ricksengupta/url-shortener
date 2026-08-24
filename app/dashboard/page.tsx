import Link from "next/link";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UrlCard from "@/components/UrlCard";
import SearchBar from "@/components/SearchBar";
import SortDropdown from "@/components/SortDropdown";
import Pagination from "@/components/Pagination";
import Navbar from "@/components/Navbar";

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
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-4 sm:p-6 lg:p-8">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
              Dashboard
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Manage your shortened URLs.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row md:w-auto">
            <SearchBar />

            <SortDropdown />

            <Link
              href="/"
              className="rounded-md bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              Create Short URL
            </Link>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Total Links */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
            <h2 className="text-sm font-medium text-gray-500">
              Total Links
            </h2>

            <p className="mt-2 text-3xl font-bold text-blue-700">
              {totalLinks}
            </p>
          </div>

          {/* Total Clicks */}
          <div className="rounded-xl border border-purple-100 bg-purple-50 p-6 shadow-sm">
            <h2 className="text-sm font-medium text-gray-500">
              Total Clicks
            </h2>

            <p className="mt-2 text-3xl font-bold text-purple-700">
              {totalClicks}
            </p>
          </div>

          {/* Average Clicks */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 shadow-sm">
            <h2 className="text-sm font-medium text-gray-500">
              Average Clicks
            </h2>

            <p className="mt-2 text-3xl font-bold text-emerald-700">
              {averageClicks.toFixed(1)}
            </p>
          </div>
          <div className="rounded-xl border border-orange-100 bg-orange-50 p-6 shadow-sm">
            <h2 className="text-sm font-medium text-gray-500">
              Latest Link
            </h2>

            <p className="mt-2 truncate text-lg font-semibold text-orange-700">
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
    </>
  );
}