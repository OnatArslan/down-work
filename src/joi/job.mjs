import { z } from "zod";

const jobSchema = z.object({
  id: z.number().int().positive().optional(),

  title: z
    .string()
    .min(5, { message: "Title must be at least 5 characters long" })
    .max(30, { message: "Title must be at most 30 characters long" }),
  description: z.string().nonempty({ message: "Description is required" }),
  budget: z.number().positive({ message: "Budget must be a positive number" }),
  paymentType: z.enum(["hourly", "fixed"], {
    message: "Payment type must be either 'hourly' or 'fixed'",
  }),
  status: z
    .enum(["open", "progress", "complated", "closed"], {
      message:
        "Status must be one of 'open', 'progress', 'complated', or 'closed'",
    })
    .default("open"),
  createdAt: z.date().optional(),
  employerId: z
    .number()
    .int()
    .positive({ message: "Employer ID must be a positive integer" }),
});

export default jobSchema;
