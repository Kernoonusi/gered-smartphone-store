import { z } from "zod";

export const orderFormSchema = z.object({
  address: z
    .string()
    .min(2, { message: "Минимум 2 символа" })
    .max(50, { message: "Максимум 50 символов" }),
  paymentMethod: z
    .string()
    .min(2, { message: "Минимум 2 символа" })
    .max(50, { message: "Максимум 50 символов" }),
  note: z.string().max(250, { message: "Максимум 250 символов" }).optional(),
});
