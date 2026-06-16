import { z } from "zod"

export const AddCompetitorSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  domain: z.string().min(1, "Domain is required").max(200),
})

export const UpdateCompetitorSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  domain: z.string().min(1).max(200).optional(),
})

export type AddCompetitorInput = z.infer<typeof AddCompetitorSchema>
