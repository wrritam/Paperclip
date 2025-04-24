import * as z from "zod"
import { CompleteUser, RelatedUserModel, CompleteRequestLog, RelatedRequestLogModel, CompleteInsight, RelatedInsightModel, CompleteAITip, RelatedAITipModel } from "./index"

export const RequestModel = z.object({
  id: z.string(),
  userId: z.string(),
  method: z.string(),
  url: z.string(),
  summary: z.string(),
  createdAt: z.date(),
})

export interface CompleteRequest extends z.infer<typeof RequestModel> {
  user: CompleteUser
  requestLogs: CompleteRequestLog[]
  insights: CompleteInsight[]
  aiTips: CompleteAITip[]
}

/**
 * RelatedRequestModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRequestModel: z.ZodSchema<CompleteRequest> = z.lazy(() => RequestModel.extend({
  user: RelatedUserModel,
  requestLogs: RelatedRequestLogModel.array(),
  insights: RelatedInsightModel.array(),
  aiTips: RelatedAITipModel.array(),
}))
