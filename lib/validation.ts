import { z } from "zod";

export const leadSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(120),
  whatsappNumber: z.string().min(7).max(30),
  country: z.string().min(2).max(80),
  broker: z.string().min(1).max(120).optional().or(z.literal("")),
  accountSize: z.string().min(1).max(40),
  message: z.string().min(5).max(2000),
  honeypot: z.string().max(0).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;
