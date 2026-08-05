import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BrowserChart from "@/components/BrowserChart";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function AnalyticsPage({ params }: Props) {
    const { id } = await params;

    const url = await prisma.url.findUnique({
        where: {
            id,
        },
    });

    if (!url) {
        notFound();
    }

    const clicks = await prisma.click.findMany({
        where: {
            urlId: id,
        },
        orderBy: {
            clickedAt: "desc",
        },
    });

    const browserStats = await prisma.click.groupBy({
        by: ["browser"],
        where: {
            urlId: id,
        },
        _count: {
            browser: true,
        },
    });

    const browserChartData = browserStats.map((item) => ({
        browser: item.browser ?? "Unknown",
        clicks: item._count.browser,
    }));

    return (
        <main className="min-h-screen p-8">
            <h1 className="mb-6 text-3xl font-bold">
                Analytics
            </h1>

            <div className="space-y-2 rounded-lg border p-6 shadow-sm">
                <p>
                    <strong>Original URL:</strong>{" "}
                    {url.originalUrl}
                </p>

                <p>
                    <strong>Short Code:</strong>{" "}
                    {url.shortCode}
                </p>

                <p>
                    <strong>Total Clicks:</strong>{" "}
                    {url.clickCount}
                </p>

                <p>
                    <strong>Click Records:</strong>{" "}
                    {clicks.length}
                </p>
            </div>

            <h2 className="mt-10 mb-4 text-2xl font-semibold">
                Browser Statistics
            </h2>

            <BrowserChart data={browserChartData} />

            <div className="rounded-lg border p-4">
                {browserStats.map((browser) => (
                    <p key={browser.browser ?? "Unknown"}>
                        {browser.browser ?? "Unknown"} :{" "}
                        {browser._count.browser}
                    </p>
                ))}
            </div>

            <h2 className="mt-10 mb-4 text-2xl font-semibold">
                Recent Clicks
            </h2>

            {clicks.length === 0 ? (
                <p className="text-gray-500">
                    No clicks yet.
                </p>
            ) : (
                <div className="space-y-4">
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="min-w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left">Time</th>
                                    <th className="px-4 py-3 text-left">Browser</th>
                                    <th className="px-4 py-3 text-left">OS</th>
                                    <th className="px-4 py-3 text-left">Device</th>
                                    <th className="px-4 py-3 text-left">Country</th>
                                    <th className="px-4 py-3 text-left">City</th>
                                </tr>
                            </thead>

                            <tbody>
                                {clicks.map((click) => (
                                    <tr
                                        key={click.id}
                                        className="border-t"
                                    >
                                        <td className="px-4 py-3">
                                            {click.clickedAt.toLocaleString()}
                                        </td>

                                        <td className="px-4 py-3">
                                            {click.browser}
                                        </td>

                                        <td className="px-4 py-3">
                                            {click.os}
                                        </td>

                                        <td className="px-4 py-3">
                                            {click.device}
                                        </td>

                                        <td className="px-4 py-3">
                                            {click.country}
                                        </td>

                                        <td className="px-4 py-3">
                                            {click.city}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </main>
    );
}