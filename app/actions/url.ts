"use server";

import { prisma } from "@/lib/prisma";
import { generateShortCode } from "@/lib/shortCode";
import { urlSchema } from "@/lib/validation/url";

export async function createShortUrl(formData: FormData) {
  console.log("===== SERVER ACTION STARTED =====");

  const result = urlSchema.safeParse({
    originalUrl: formData.get("originalUrl"),
  });

  if (!result.success) {
    console.log(result.error.issues);
    return;
  }

  const shortCode = generateShortCode();

  await prisma.url.create({
    data: {
      originalUrl: result.data.originalUrl,
      shortCode,
      clerkUserId: "demo-user",
    },
  });

  console.log("URL Created Successfully");
}