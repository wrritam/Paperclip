import * as z from "zod"
import { CompleteRequest, RelatedRequestModel, CompleteRequestLog, RelatedRequestLogModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const InsightModel = z.object({
  id: z.string(),
  requestId: z.string(),
  avgResponseTime: z.number().int(),
  errorRate: z.number(),
  slowestResponse: z.number().int(),
  avgPayloadSizeKB: z.number(),
  statusCodeDistribution: jsonSchema,
  mostCommonHeaders: jsonSchema,
  recentOutputs: jsonSchema,
  score: z.number().int(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteInsight extends z.infer<typeof InsightModel> {
  request: CompleteRequest
  requestLogs: CompleteRequestLog[]
}

/**
 * RelatedInsightModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedInsightModel: z.ZodSchema<CompleteInsight> = z.lazy(() => InsightModel.extend({
  request: RelatedRequestModel,
  requestLogs: RelatedRequestLogModel.array(),
}))
