import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";

import BrowserChart from "@/components/BrowserChart";
import DeviceChart from "@/components/DeviceChart";
import OSChart from "@/components/OSChart";
import ClicksOverTimeChart from "@/components/ClicksOverTimeChart";
import Navbar from "@/components/Navbar";

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

    const topBrowser =
        browserChartData.length > 0
            ? browserChartData.reduce((max, current) =>
                current.clicks > max.clicks ? current : max
            )
            : null;

    const topDevice =
        deviceChartData.length > 0
            ? deviceChartData.reduce((max, current) =>
                current.clicks > max.clicks ? current : max
            )
            : null;

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 p-4 sm:p-6 lg:p-8">
                {/* Header */}
                <div className="mx-auto max-w-7xl">
                    <Link
                        href="/dashboard"
                        className="mb-6 inline-block text-sm font-medium text-blue-600 transition hover:text-blue-800"
                    >
                        ← Back to Dashboard
                    </Link>

                    <div>
                        <h1 className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-3xl font-bold text-transparent sm:text-4xl">
                            Analytics
                        </h1>

                        <p className="mt-2 break-all text-sm text-gray-600 sm:text-base">
                            {url.originalUrl}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                            Short Code: {url.shortCode}
                        </p>
                    </div>

                    {/* Summary Cards */}
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Total Clicks */}
                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 shadow-sm sm:p-6">
                            <p className="text-sm font-medium text-blue-600">
                                Total Clicks
                            </p>

                            <p className="mt-2 text-3xl font-bold text-blue-700">
                                {url.clickCount}
                            </p>
                        </div>

                        {/* Top Browser */}
                        <div className="rounded-xl border border-purple-100 bg-purple-50 p-5 shadow-sm sm:p-6">
                            <p className="text-sm font-medium text-purple-600">
                                Top Browser
                            </p>

                            <p className="mt-2 truncate text-2xl font-bold text-purple-700">
                                {topBrowser?.browser ?? "No data"}
                            </p>

                            {topBrowser && (
                                <p className="mt-1 text-sm text-gray-500">
                                    {topBrowser.clicks} clicks
                                </p>
                            )}
                        </div>

                        {/* Top Device */}
                        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-5 shadow-sm sm:p-6">
                            <p className="text-sm font-medium text-emerald-600">
                                Top Device
                            </p>

                            <p className="mt-2 truncate text-2xl font-bold text-emerald-700">
                                {topDevice?.device ?? "No data"}
                            </p>

                            {topDevice && (
                                <p className="mt-1 text-sm text-gray-500">
                                    {topDevice.clicks} clicks
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Clicks Over Time */}
                    <div className="mt-8 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">
                            Clicks Over Time
                        </h2>

                        {clicksOverTimeData.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                No click data available yet.
                            </p>
                        ) : (
                            <div className="w-full overflow-hidden">
                                <ClicksOverTimeChart data={clicksOverTimeData} />
                            </div>
                        )}
                    </div>

                    {/* Browser + Device */}
                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        {/* Browser */}
                        <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">
                                Browser Statistics
                            </h2>

                            {browserChartData.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                    No browser data available yet.
                                </p>
                            ) : (
                                <div className="w-full overflow-hidden">
                                    <BrowserChart data={browserChartData} />
                                </div>
                            )}
                        </div>

                        {/* Device */}
                        <div className="min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                            <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">
                                Device Statistics
                            </h2>

                            {deviceChartData.length === 0 ? (
                                <p className="text-sm text-gray-500">
                                    No device data available yet.
                                </p>
                            ) : (
                                <div className="w-full overflow-hidden">
                                    <DeviceChart data={deviceChartData} />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Operating System */}
                    <div className="mt-6 min-w-0 overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">
                            Operating System Statistics
                        </h2>

                        {osChartData.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                No operating system data available yet.
                            </p>
                        ) : (
                            <div className="w-full overflow-hidden">
                                <OSChart data={osChartData} />
                            </div>
                        )}
                    </div>

                    {/* Recent Clicks */}
                    <div className="mt-6">
                        <h2 className="mb-4 text-lg font-semibold text-gray-900 sm:text-xl">
                            Recent Clicks
                        </h2>

                        {clicks.length === 0 ? (
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <p className="text-sm text-gray-500">
                                    No clicks yet.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                                <table className="min-w-[700px] w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Time
                                            </th>

                                            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Browser
                                            </th>

                                            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                OS
                                            </th>

                                            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Device
                                            </th>

                                            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                Country
                                            </th>

                                            <th className="whitespace-nowrap px-4 py-3 text-left text-sm font-semibold text-gray-700">
                                                City
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {clicks.map((click) => (
                                            <tr
                                                key={click.id}
                                                className="border-t border-gray-100 transition hover:bg-gray-50"
                                            >
                                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                                    {click.clickedAt.toLocaleString()}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                                    {click.browser ?? "Unknown"}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                                    {click.os ?? "Unknown"}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                                    {click.device ?? "Unknown"}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                                    {click.country ?? "Unknown"}
                                                </td>

                                                <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                                                    {click.city ?? "Unknown"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}