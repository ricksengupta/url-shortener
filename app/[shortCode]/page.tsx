import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

type Props = {
    params: Promise<{
        shortCode: string;
    }>;
};

export default async function RedirectPage({ params }: Props) {
    const { shortCode } = await params;

    const url = await prisma.url.findUnique({
        where: {
            shortCode: shortCode,
        },
    });

    const headersList = await headers();

    const userAgent =
        headersList.get("user-agent") ?? "";


    const parser = new UAParser(userAgent);

    const browser =
        parser.getBrowser().name ?? "Unknown";

    const os =
        parser.getOS().name ?? "Unknown";

    const device =
        parser.getDevice().type ?? "Desktop";

    if (!url) {
        notFound();
    }
    await prisma.$transaction([
        prisma.click.create({
            data: {
                urlId: url.id,
                browser,
                os,
                device,
            },
        }),

        prisma.url.update({
            where: {
                id: url.id,
            },
            data: {
                clickCount: {
                    increment: 1,
                },
            },
        }),
    ]);

    redirect(url.originalUrl);
}