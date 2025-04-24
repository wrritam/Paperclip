import * as z from "zod"
import { CompleteRequest, RelatedRequestModel } from "./index"

export const UserModel = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string().nullish(),
  password: z.string(),
  is_verified: z.boolean(),
  otp: z.number().int().nullish(),
  last_login: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteUser extends z.infer<typeof UserModel> {
  requests: CompleteRequest[]
}

/**
 * RelatedUserModel contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const RelatedUserModel: z.ZodSchema<CompleteUser> = z.lazy(() => UserModel.extend({
  requests: RelatedRequestModel.array(),
}))
