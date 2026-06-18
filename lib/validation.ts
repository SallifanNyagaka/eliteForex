import { z } from "zod";

const baseLead = z.object({
  leadType: z.enum(["home", "contact", "package"]),
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(120),
  message: z.string().min(5).max(2000),
  honeypot: z.string().max(0).optional().or(z.literal("")),
  packageName: z.string().max(120).optional().or(z.literal("")),
  sourcePage: z.string().max(80).optional().or(z.literal("")),
});

export const homeLeadSchema = baseLead.extend({
  leadType: z.literal("home"),
  whatsappNumber: z.string().min(7).max(30),
  country: z.string().min(2).max(80),
  broker: z.string().max(120).optional().or(z.literal("")),
  accountSize: z.string().min(1).max(40),
});

export const contactLeadSchema = baseLead.extend({
  leadType: z.literal("contact"),
  phoneNumber: z.string().min(7).max(30),
  investmentBudget: z.string().min(1).max(40),
});

export const packageLeadSchema = baseLead.extend({
  leadType: z.literal("package"),
  phoneNumber: z.string().min(7).max(30),
  investmentBudget: z.string().min(1).max(40),
  packageName: z.string().min(2).max(120),
});

export const leadSchema = z.discriminatedUnion("leadType", [
  homeLeadSchema,
  contactLeadSchema,
  packageLeadSchema,
]);

export type LeadInput = z.infer<typeof leadSchema>;
