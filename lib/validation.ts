import { z } from "zod";

const baseLead = z.object({
  leadType: z.enum(["home", "contact", "package"]),
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(120),
  message: z.string().min(5).max(2000),
  honeypot: z.string().max(0).optional().or(z.literal("")),
  packageName: z.string().max(120).optional().or(z.literal("")),
  sourcePage: z.string().max(80).optional().or(z.literal("")),
  preferredContactMethod: z.enum(["whatsapp", "email", "phone"]),
  preferredContactDetail: z.string().max(120).optional().or(z.literal("")),
  confirmedOver18: z.boolean().refine((value) => value, {
    message: "You must confirm that you are 18 years or older.",
  }),
});

function validatePreferredContact(
  data: { preferredContactMethod: "whatsapp" | "email" | "phone"; preferredContactDetail?: string },
  context: z.RefinementCtx
) {
  const detail = data.preferredContactDetail?.trim() ?? "";

  if (data.preferredContactMethod === "email" && !z.string().email().safeParse(detail).success) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["preferredContactDetail"],
      message: "Enter a valid preferred email address.",
    });
  }

  if (data.preferredContactMethod === "phone" && (detail.replace(/\D/g, "").length < 7 || detail.length > 30)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["preferredContactDetail"],
      message: "Enter a valid preferred phone number.",
    });
  }
}

export const homeLeadSchema = baseLead.extend({
  leadType: z.literal("home"),
  whatsappNumber: z.string().min(7).max(30),
  country: z.string().min(2).max(80),
  broker: z.string().max(120).optional().or(z.literal("")),
  accountSize: z.string().min(1).max(40),
}).superRefine(validatePreferredContact);

export const contactLeadSchema = baseLead.extend({
  leadType: z.literal("contact"),
  phoneNumber: z.string().min(7).max(30),
  investmentBudget: z.string().min(1).max(40),
}).superRefine(validatePreferredContact);

export const packageLeadSchema = baseLead.extend({
  leadType: z.literal("package"),
  phoneNumber: z.string().min(7).max(30),
  investmentBudget: z.string().min(1).max(40),
  packageName: z.string().min(2).max(120),
}).superRefine(validatePreferredContact);

export const leadSchema = z.union([
  homeLeadSchema,
  contactLeadSchema,
  packageLeadSchema,
]);

export type LeadInput = z.infer<typeof leadSchema>;
