import z from "zod";

export const validateUnitNumberSchema = z.object({
  unitNumber: z.string(),
});
