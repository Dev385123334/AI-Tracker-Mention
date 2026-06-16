import { z } from "zod"

export const AddKeywordSchema = z.object({
  keyword: z.string().min(1, "Keyword is required").max(200),
})

export const BulkImportSchema = z.object({
  keywords: z
    .string()
    .min(1, "At least one keyword is required")
    .transform((val) =>
      val
        .split(/[\n,]+/)
        .map((k) => k.trim())
        .filter(Boolean)
    )
    .pipe(z.array(z.string().min(1)).min(1, "At least one valid keyword is required")),
})

export type AddKeywordInput = z.infer<typeof AddKeywordSchema>
