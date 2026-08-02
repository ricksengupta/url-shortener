import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

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

    if (!url) {
        notFound();
    }
    await prisma.$transaction([
        prisma.click.create({
            data: {
                urlId: url.id,
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