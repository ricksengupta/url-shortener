"use server";

import { prisma } from "@/lib/prisma";
import { generateShortCode } from "@/lib/shortCode";
import { urlSchema } from "@/lib/validation/url";
import { auth } from "@clerk/nextjs/server";

async function generateUniqueShortCode() {
  while (true) {
    const shortCode = generateShortCode();

    const existingUrl = await prisma.url.findUnique({
      where: {
        shortCode,
      },
    });

    if (!existingUrl) {
      return shortCode;
    }
  }
}

export async function createShortUrl(formData: FormData) {
  console.log("===== SERVER ACTION STARTED =====");

  const { userId } = await auth();

  if (!userId) {
  throw new Error("User not authenticated");
  }

  const result = urlSchema.safeParse({
    originalUrl: formData.get("originalUrl"),
  });

  if (!result.success) {
    console.log(result.error.issues);
    return;
  }

  const shortCode = await generateUniqueShortCode();

  await prisma.url.create({
    data: {
      originalUrl: result.data.originalUrl,
      shortCode,
      clerkUserId: userId,
    },
  });

  console.log("URL Created Successfully");
}