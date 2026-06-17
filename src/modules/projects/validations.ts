import { z } from "zod"

export const CreateProjectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  brandName: z.string().min(1, "Brand name is required").max(100),
  domain: z.string().min(1, "Domain is required").max(200),
  description: z.string().max(500).optional(),
  organizationId: z.string().min(1, "Organization is required"),
  targetCountries: z.array(z.string()).optional(),
})

export const UpdateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  brandName: z.string().min(1).max(100).optional(),
  domain: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
})

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>
export type UpdateProjectInput = z.infer<typeof UpdateProjectSchema>
