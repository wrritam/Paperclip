import * as z from "zod"
import { CompleteRequest, RelatedRequestModel } from "./index"

export const AITipModel = z.object({
  id: z.string(),
  requestId: z.string(),
  title: z.string(),
  description: z.string(),
  codeSnippet: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteAITip extends z.infer<typeof AITipModel> {
  request: CompleteRequest
}

/**
 * RelatedAITipModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedAITipModel: z.ZodSchema<CompleteAITip> = z.lazy(() => AITipModel.extend({
  request: RelatedRequestModel,
}))
