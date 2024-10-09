import { z } from "zod";

const jobSchema = z.object({
  id: z.number().int().positive().optional(),
  title: z.string().min(5).max(30),
  description: z.string(),
  budget: z.number().positive(),
  paymentType: z.enum(["hourly", "fixed"]),
  status: z.enum(["open", "progress", "complated", "closed"]).default("open"),
  createdAt: z.date().optional(),
  employerId: z.number().int().positive(),
});

export default jobSchema;
