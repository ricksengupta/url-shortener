import { z } from "zod";

export const urlSchema = z.object({
  originalUrl: z.url({
    message: "Please enter a valid URL",
  }),
});