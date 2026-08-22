import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

import BrowserChart from "@/components/BrowserChart";
import DeviceChart from "@/components/DeviceChart";
import OSChart from "@/components/OSChart";
import ClicksOverTimeChart from "@/components/ClicksOverTimeChart";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function AnalyticsPage({ params }: Props) {
    const { id } = await params;

    // Find the URL
    const url = await prisma.url.findUnique({
        where: {
            id,
        },
    });

    if (!url) {
        notFound();
    }

    // Get all clicks for this URL
    const clicks = await prisma.click.findMany({
        where: {
            urlId: id,
        },
        orderBy: {
            clickedAt: "desc",
        },
    });

    // Browser statistics
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

    // Device statistics
    const deviceStats = await prisma.click.groupBy({
        by: ["device"],
        where: {
            urlId: id,
        },
        _count: {
            device: true,
        },
    });

    const deviceChartData = deviceStats.map((item) => ({
        device: item.device ?? "Unknown",
        clicks: item._count.device,
    }));

    // Operating system statistics
    const osStats = await prisma.click.groupBy({
        by: ["os"],
        where: {
            urlId: id,
        },
        _count: {
            os: true,
        },
    });

    const osChartData = osStats.map((item) => ({
        os: item.os ?? "Unknown",
        clicks: item._count.os,
    }));

    // Clicks grouped by day
    const clicksByDay: Record<string, number> = {};

    clicks.forEach((click) => {
        const date = click.clickedAt.toLocaleDateString();

        clicksByDay[date] = (clicksByDay[date] ?? 0) + 1;
    });

    const clicksOverTimeData = Object.entries(clicksByDay).map(
        ([date, clicks]) => ({
            date,
            clicks,
        })
    );

    // Find the most popular browser
    const topBrowser =
        browserChartData.length > 0
            ? browserChartData.reduce((max, current) =>
                current.clicks > max.clicks ? current : max
            )
            : null;

    // Find the most popular device
    const topDevice =
        deviceChartData.length > 0
            ? deviceChartData.reduce((max, current) =>
                current.clicks > max.clicks ? current : max
            )
            : null;

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 p-8">
            {/* Page heading */}

            <Link
                href="/dashboard"
                className="mb-6 inline-block text-sm text-blue-600 hover:underline"
            >
                ← Back to Dashboard
            </Link>
            <div>

                <h1 className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent">
                    Analytics
                </h1>

                <p className="mt-2 break-all text-gray-500">
                    {url.originalUrl}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                    Short Code: {url.shortCode}
                </p>
            </div>

            {/* Summary Cards */}
            <div className="mt-8 grid gap-4 md:grid-cols-3">
                {/* Total Clicks */}
                <div className="rounded-lg border p-6 shadow-sm">
                    <p className="rounded-xl border border-blue-100 bg-blue-50 p-6 shadow-sm">
                        Total Clicks
                    </p>

                    <p className="mt-2 text-3xl font-bold">
                        {url.clickCount}
                    </p>
                </div>

                {/* Top Browser */}
                <div className="rounded-xl border border-purple-100 bg-purple-50 p-6 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Top Browser
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        {topBrowser?.browser ?? "No data"}
                    </p>

                    {topBrowser && (
                        <p className="text-sm text-gray-500">
                            {topBrowser.clicks} clicks
                        </p>
                    )}
                </div>

                {/* Top Device */}
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Top Device
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        {topDevice?.device ?? "No data"}
                    </p>

                    {topDevice && (
                        <p className="text-sm text-gray-500">
                            {topDevice.clicks} clicks
                        </p>
                    )}
                </div>
            </div>

            {/* Clicks Over Time */}
            <div className="mt-8 rounded-lg border p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">
                    Clicks Over Time
                </h2>

                {clicksOverTimeData.length === 0 ? (
                    <p className="text-gray-500">
                        No click data available yet.
                    </p>
                ) : (
                    <ClicksOverTimeChart
                        data={clicksOverTimeData}
                    />
                )}
            </div>

            {/* Browser + Device */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                {/* Browser Statistics */}
                <div className="rounded-lg border p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold">
                        Browser Statistics
                    </h2>

                    {browserChartData.length === 0 ? (
                        <p className="text-gray-500">
                            No browser data available yet.
                        </p>
                    ) : (
                        <BrowserChart
                            data={browserChartData}
                        />
                    )}
                </div>

                {/* Device Statistics */}
                <div className="rounded-lg border p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-semibold">
                        Device Statistics
                    </h2>

                    {deviceChartData.length === 0 ? (
                        <p className="text-gray-500">
                            No device data available yet.
                        </p>
                    ) : (
                        <DeviceChart
                            data={deviceChartData}
                        />
                    )}
                </div>
            </div>

            {/* Operating System */}
            <div className="mt-6 rounded-lg border p-6 shadow-sm">
                <h2 className="mb-4 text-xl font-semibold">
                    Operating System Statistics
                </h2>

                {osChartData.length === 0 ? (
                    <p className="text-gray-500">
                        No operating system data available yet.
                    </p>
                ) : (
                    <OSChart data={osChartData} />
                )}
            </div>

            {/* Recent Clicks */}
            <div className="mt-6">
                <h2 className="mb-4 text-xl font-semibold">
                    Recent Clicks
                </h2>

                {clicks.length === 0 ? (
                    <p className="text-gray-500">
                        No clicks yet.
                    </p>
                ) : (
                    <div className="overflow-x-auto rounded-lg border">
                        <table className="min-w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left">
                                        Time
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        Browser
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        OS
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        Device
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        Country
                                    </th>

                                    <th className="px-4 py-3 text-left">
                                        City
                                    </th>
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
                                            {click.browser ?? "Unknown"}
                                        </td>

                                        <td className="px-4 py-3">
                                            {click.os ?? "Unknown"}
                                        </td>

                                        <td className="px-4 py-3">
                                            {click.device ?? "Unknown"}
                                        </td>

                                        <td className="px-4 py-3">
                                            {click.country ?? "Unknown"}
                                        </td>

                                        <td className="px-4 py-3">
                                            {click.city ?? "Unknown"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}