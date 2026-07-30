import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UrlCard from "@/components/UrlCard";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Run all independent database queries in parallel
  const [totalLinks, clickStats, urls] = await Promise.all([
    prisma.url.count({
      where: {
        clerkUserId: userId,
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
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const totalClicks = clickStats._sum.clickCount ?? 0;
  const averageClicks = clickStats._avg.clickCount ?? 0;

  return (
    <main className="min-h-screen p-8">
      <h1 className="mb-6 text-3xl font-bold">
        Dashboard
      </h1>

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
      </div>

      {/* URL List */}
      {urls.length === 0 ? (
        <p className="text-gray-500">
          You have not created any shortened URLs yet.
        </p>
      ) : (
        <div className="space-y-4">
          {urls.map((url) => (
            <UrlCard
              key={url.id}
              url={url}
            />
          ))}
        </div>
      )}
    </main>
  );
}