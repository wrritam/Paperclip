import * as z from "zod"
import { CompleteRequest, RelatedRequestModel, CompleteInsight, RelatedInsightModel } from "./index"

// Helper schema for JSON fields
type Literal = boolean | number | string
type Json = Literal | { [key: string]: Json } | Json[]
const literalSchema = z.union([z.string(), z.number(), z.boolean()])
const jsonSchema: z.ZodSchema<Json> = z.lazy(() => z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)]))

export const RequestLogModel = z.object({
  id: z.string(),
  requestId: z.string(),
  insightId: z.string().nullish(),
  status: z.number().int(),
  responseTimeMs: z.number().int(),
  responseSizeKB: z.number(),
  isError: z.boolean(),
  responseBody: jsonSchema,
  headers: jsonSchema,
  ipAddress: z.string().nullish(),
  userAgent: z.string().nullish(),
  createdAt: z.date(),
})

export interface CompleteRequestLog extends z.infer<typeof RequestLogModel> {
  request: CompleteRequest
  insight?: CompleteInsight | null
}

/**
 * RelatedRequestLogModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedRequestLogModel: z.ZodSchema<CompleteRequestLog> = z.lazy(() => RequestLogModel.extend({
  request: RelatedRequestModel,
  insight: RelatedInsightModel.nullish(),
}))
