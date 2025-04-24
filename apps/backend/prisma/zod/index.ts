import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','email','name','password','is_verified','otp','last_login','createdAt','updatedAt']);

export const RequestScalarFieldEnumSchema = z.enum(['id','userId','method','url','summary','createdAt']);

export const RequestLogScalarFieldEnumSchema = z.enum(['id','requestId','insightId','status','responseTimeMs','responseSizeKB','isError','responseBody','headers','ipAddress','userAgent','createdAt']);

export const InsightScalarFieldEnumSchema = z.enum(['id','requestId','avgResponseTime','errorRate','slowestResponse','avgPayloadSizeKB','statusCodeDistribution','mostCommonHeaders','recentOutputs','score','createdAt','updatedAt']);

export const AITipScalarFieldEnumSchema = z.enum(['id','requestId','title','description','codeSnippet','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().cuid(),
  email: z.string(),
  name: z.string().nullable(),
  password: z.string(),
  is_verified: z.boolean(),
  otp: z.number().int().nullable(),
  last_login: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// REQUEST SCHEMA
/////////////////////////////////////////

export const RequestSchema = z.object({
  id: z.string().cuid(),
  userId: z.string(),
  method: z.string(),
  url: z.string(),
  summary: z.string(),
  createdAt: z.coerce.date(),
})

export type Request = z.infer<typeof RequestSchema>

/////////////////////////////////////////
// REQUEST LOG SCHEMA
/////////////////////////////////////////

export const RequestLogSchema = z.object({
  id: z.string().cuid(),
  requestId: z.string(),
  insightId: z.string().nullable(),
  status: z.number().int(),
  responseTimeMs: z.number().int(),
  responseSizeKB: z.number(),
  isError: z.boolean(),
  responseBody: JsonValueSchema.nullable(),
  headers: JsonValueSchema.nullable(),
  ipAddress: z.string().nullable(),
  userAgent: z.string().nullable(),
  createdAt: z.coerce.date(),
})

export type RequestLog = z.infer<typeof RequestLogSchema>

/////////////////////////////////////////
// INSIGHT SCHEMA
/////////////////////////////////////////

export const InsightSchema = z.object({
  id: z.string().cuid(),
  requestId: z.string(),
  avgResponseTime: z.number().int(),
  errorRate: z.number(),
  slowestResponse: z.number().int(),
  avgPayloadSizeKB: z.number(),
  statusCodeDistribution: JsonValueSchema,
  mostCommonHeaders: JsonValueSchema.nullable(),
  recentOutputs: JsonValueSchema.nullable(),
  score: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Insight = z.infer<typeof InsightSchema>

/////////////////////////////////////////
// AI TIP SCHEMA
/////////////////////////////////////////

export const AITipSchema = z.object({
  id: z.string().cuid(),
  requestId: z.string(),
  title: z.string(),
  description: z.string(),
  codeSnippet: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type AITip = z.infer<typeof AITipSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  requests: z.union([z.boolean(),z.lazy(() => RequestFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  requests: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  name: z.boolean().optional(),
  password: z.boolean().optional(),
  is_verified: z.boolean().optional(),
  otp: z.boolean().optional(),
  last_login: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  requests: z.union([z.boolean(),z.lazy(() => RequestFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// REQUEST
//------------------------------------------------------

export const RequestIncludeSchema: z.ZodType<Prisma.RequestInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  requestLogs: z.union([z.boolean(),z.lazy(() => RequestLogFindManyArgsSchema)]).optional(),
  insights: z.union([z.boolean(),z.lazy(() => InsightFindManyArgsSchema)]).optional(),
  aiTips: z.union([z.boolean(),z.lazy(() => AITipFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RequestCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const RequestArgsSchema: z.ZodType<Prisma.RequestDefaultArgs> = z.object({
  select: z.lazy(() => RequestSelectSchema).optional(),
  include: z.lazy(() => RequestIncludeSchema).optional(),
}).strict();

export const RequestCountOutputTypeArgsSchema: z.ZodType<Prisma.RequestCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => RequestCountOutputTypeSelectSchema).nullish(),
}).strict();

export const RequestCountOutputTypeSelectSchema: z.ZodType<Prisma.RequestCountOutputTypeSelect> = z.object({
  requestLogs: z.boolean().optional(),
  insights: z.boolean().optional(),
  aiTips: z.boolean().optional(),
}).strict();

export const RequestSelectSchema: z.ZodType<Prisma.RequestSelect> = z.object({
  id: z.boolean().optional(),
  userId: z.boolean().optional(),
  method: z.boolean().optional(),
  url: z.boolean().optional(),
  summary: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  requestLogs: z.union([z.boolean(),z.lazy(() => RequestLogFindManyArgsSchema)]).optional(),
  insights: z.union([z.boolean(),z.lazy(() => InsightFindManyArgsSchema)]).optional(),
  aiTips: z.union([z.boolean(),z.lazy(() => AITipFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => RequestCountOutputTypeArgsSchema)]).optional(),
}).strict()

// REQUEST LOG
//------------------------------------------------------

export const RequestLogIncludeSchema: z.ZodType<Prisma.RequestLogInclude> = z.object({
  request: z.union([z.boolean(),z.lazy(() => RequestArgsSchema)]).optional(),
  insight: z.union([z.boolean(),z.lazy(() => InsightArgsSchema)]).optional(),
}).strict()

export const RequestLogArgsSchema: z.ZodType<Prisma.RequestLogDefaultArgs> = z.object({
  select: z.lazy(() => RequestLogSelectSchema).optional(),
  include: z.lazy(() => RequestLogIncludeSchema).optional(),
}).strict();

export const RequestLogSelectSchema: z.ZodType<Prisma.RequestLogSelect> = z.object({
  id: z.boolean().optional(),
  requestId: z.boolean().optional(),
  insightId: z.boolean().optional(),
  status: z.boolean().optional(),
  responseTimeMs: z.boolean().optional(),
  responseSizeKB: z.boolean().optional(),
  isError: z.boolean().optional(),
  responseBody: z.boolean().optional(),
  headers: z.boolean().optional(),
  ipAddress: z.boolean().optional(),
  userAgent: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  request: z.union([z.boolean(),z.lazy(() => RequestArgsSchema)]).optional(),
  insight: z.union([z.boolean(),z.lazy(() => InsightArgsSchema)]).optional(),
}).strict()

// INSIGHT
//------------------------------------------------------

export const InsightIncludeSchema: z.ZodType<Prisma.InsightInclude> = z.object({
  request: z.union([z.boolean(),z.lazy(() => RequestArgsSchema)]).optional(),
  requestLogs: z.union([z.boolean(),z.lazy(() => RequestLogFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => InsightCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const InsightArgsSchema: z.ZodType<Prisma.InsightDefaultArgs> = z.object({
  select: z.lazy(() => InsightSelectSchema).optional(),
  include: z.lazy(() => InsightIncludeSchema).optional(),
}).strict();

export const InsightCountOutputTypeArgsSchema: z.ZodType<Prisma.InsightCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => InsightCountOutputTypeSelectSchema).nullish(),
}).strict();

export const InsightCountOutputTypeSelectSchema: z.ZodType<Prisma.InsightCountOutputTypeSelect> = z.object({
  requestLogs: z.boolean().optional(),
}).strict();

export const InsightSelectSchema: z.ZodType<Prisma.InsightSelect> = z.object({
  id: z.boolean().optional(),
  requestId: z.boolean().optional(),
  avgResponseTime: z.boolean().optional(),
  errorRate: z.boolean().optional(),
  slowestResponse: z.boolean().optional(),
  avgPayloadSizeKB: z.boolean().optional(),
  statusCodeDistribution: z.boolean().optional(),
  mostCommonHeaders: z.boolean().optional(),
  recentOutputs: z.boolean().optional(),
  score: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  request: z.union([z.boolean(),z.lazy(() => RequestArgsSchema)]).optional(),
  requestLogs: z.union([z.boolean(),z.lazy(() => RequestLogFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => InsightCountOutputTypeArgsSchema)]).optional(),
}).strict()

// AI TIP
//------------------------------------------------------

export const AITipIncludeSchema: z.ZodType<Prisma.AITipInclude> = z.object({
  request: z.union([z.boolean(),z.lazy(() => RequestArgsSchema)]).optional(),
}).strict()

export const AITipArgsSchema: z.ZodType<Prisma.AITipDefaultArgs> = z.object({
  select: z.lazy(() => AITipSelectSchema).optional(),
  include: z.lazy(() => AITipIncludeSchema).optional(),
}).strict();

export const AITipSelectSchema: z.ZodType<Prisma.AITipSelect> = z.object({
  id: z.boolean().optional(),
  requestId: z.boolean().optional(),
  title: z.boolean().optional(),
  description: z.boolean().optional(),
  codeSnippet: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  request: z.union([z.boolean(),z.lazy(() => RequestArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  is_verified: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  otp: z.union([ z.lazy(() => IntNullableFilterSchema),z.number() ]).optional().nullable(),
  last_login: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  requests: z.lazy(() => RequestListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  is_verified: z.lazy(() => SortOrderSchema).optional(),
  otp: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  last_login: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  requests: z.lazy(() => RequestOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string().cuid(),
    email: z.string()
  }),
  z.object({
    id: z.string().cuid(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.string().cuid().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  is_verified: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  otp: z.union([ z.lazy(() => IntNullableFilterSchema),z.number().int() ]).optional().nullable(),
  last_login: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  requests: z.lazy(() => RequestListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  is_verified: z.lazy(() => SortOrderSchema).optional(),
  otp: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  last_login: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => UserAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => UserSumOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  password: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  is_verified: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  otp: z.union([ z.lazy(() => IntNullableWithAggregatesFilterSchema),z.number() ]).optional().nullable(),
  last_login: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const RequestWhereInputSchema: z.ZodType<Prisma.RequestWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RequestWhereInputSchema),z.lazy(() => RequestWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RequestWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RequestWhereInputSchema),z.lazy(() => RequestWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  method: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  summary: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  requestLogs: z.lazy(() => RequestLogListRelationFilterSchema).optional(),
  insights: z.lazy(() => InsightListRelationFilterSchema).optional(),
  aiTips: z.lazy(() => AITipListRelationFilterSchema).optional()
}).strict();

export const RequestOrderByWithRelationInputSchema: z.ZodType<Prisma.RequestOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  method: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  summary: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  requestLogs: z.lazy(() => RequestLogOrderByRelationAggregateInputSchema).optional(),
  insights: z.lazy(() => InsightOrderByRelationAggregateInputSchema).optional(),
  aiTips: z.lazy(() => AITipOrderByRelationAggregateInputSchema).optional()
}).strict();

export const RequestWhereUniqueInputSchema: z.ZodType<Prisma.RequestWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => RequestWhereInputSchema),z.lazy(() => RequestWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RequestWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RequestWhereInputSchema),z.lazy(() => RequestWhereInputSchema).array() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  method: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  summary: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  requestLogs: z.lazy(() => RequestLogListRelationFilterSchema).optional(),
  insights: z.lazy(() => InsightListRelationFilterSchema).optional(),
  aiTips: z.lazy(() => AITipListRelationFilterSchema).optional()
}).strict());

export const RequestOrderByWithAggregationInputSchema: z.ZodType<Prisma.RequestOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  method: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  summary: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => RequestCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => RequestMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => RequestMinOrderByAggregateInputSchema).optional()
}).strict();

export const RequestScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.RequestScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => RequestScalarWhereWithAggregatesInputSchema),z.lazy(() => RequestScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => RequestScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RequestScalarWhereWithAggregatesInputSchema),z.lazy(() => RequestScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  method: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  url: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  summary: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const RequestLogWhereInputSchema: z.ZodType<Prisma.RequestLogWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RequestLogWhereInputSchema),z.lazy(() => RequestLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RequestLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RequestLogWhereInputSchema),z.lazy(() => RequestLogWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  requestId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  insightId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  status: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  responseTimeMs: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  responseSizeKB: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  isError: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  responseBody: z.lazy(() => JsonNullableFilterSchema).optional(),
  headers: z.lazy(() => JsonNullableFilterSchema).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  request: z.union([ z.lazy(() => RequestScalarRelationFilterSchema),z.lazy(() => RequestWhereInputSchema) ]).optional(),
  insight: z.union([ z.lazy(() => InsightNullableScalarRelationFilterSchema),z.lazy(() => InsightWhereInputSchema) ]).optional().nullable(),
}).strict();

export const RequestLogOrderByWithRelationInputSchema: z.ZodType<Prisma.RequestLogOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  requestId: z.lazy(() => SortOrderSchema).optional(),
  insightId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  responseTimeMs: z.lazy(() => SortOrderSchema).optional(),
  responseSizeKB: z.lazy(() => SortOrderSchema).optional(),
  isError: z.lazy(() => SortOrderSchema).optional(),
  responseBody: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  headers: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ipAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userAgent: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  request: z.lazy(() => RequestOrderByWithRelationInputSchema).optional(),
  insight: z.lazy(() => InsightOrderByWithRelationInputSchema).optional()
}).strict();

export const RequestLogWhereUniqueInputSchema: z.ZodType<Prisma.RequestLogWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => RequestLogWhereInputSchema),z.lazy(() => RequestLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RequestLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RequestLogWhereInputSchema),z.lazy(() => RequestLogWhereInputSchema).array() ]).optional(),
  requestId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  insightId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  status: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  responseTimeMs: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  responseSizeKB: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  isError: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  responseBody: z.lazy(() => JsonNullableFilterSchema).optional(),
  headers: z.lazy(() => JsonNullableFilterSchema).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  request: z.union([ z.lazy(() => RequestScalarRelationFilterSchema),z.lazy(() => RequestWhereInputSchema) ]).optional(),
  insight: z.union([ z.lazy(() => InsightNullableScalarRelationFilterSchema),z.lazy(() => InsightWhereInputSchema) ]).optional().nullable(),
}).strict());

export const RequestLogOrderByWithAggregationInputSchema: z.ZodType<Prisma.RequestLogOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  requestId: z.lazy(() => SortOrderSchema).optional(),
  insightId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  responseTimeMs: z.lazy(() => SortOrderSchema).optional(),
  responseSizeKB: z.lazy(() => SortOrderSchema).optional(),
  isError: z.lazy(() => SortOrderSchema).optional(),
  responseBody: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  headers: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  ipAddress: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userAgent: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => RequestLogCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => RequestLogAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => RequestLogMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => RequestLogMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => RequestLogSumOrderByAggregateInputSchema).optional()
}).strict();

export const RequestLogScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.RequestLogScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => RequestLogScalarWhereWithAggregatesInputSchema),z.lazy(() => RequestLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => RequestLogScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RequestLogScalarWhereWithAggregatesInputSchema),z.lazy(() => RequestLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  requestId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  insightId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  status: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  responseTimeMs: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  responseSizeKB: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  isError: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  responseBody: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  headers: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const InsightWhereInputSchema: z.ZodType<Prisma.InsightWhereInput> = z.object({
  AND: z.union([ z.lazy(() => InsightWhereInputSchema),z.lazy(() => InsightWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => InsightWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InsightWhereInputSchema),z.lazy(() => InsightWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  requestId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  avgResponseTime: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  errorRate: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  slowestResponse: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  avgPayloadSizeKB: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  statusCodeDistribution: z.lazy(() => JsonFilterSchema).optional(),
  mostCommonHeaders: z.lazy(() => JsonNullableFilterSchema).optional(),
  recentOutputs: z.lazy(() => JsonNullableFilterSchema).optional(),
  score: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  request: z.union([ z.lazy(() => RequestScalarRelationFilterSchema),z.lazy(() => RequestWhereInputSchema) ]).optional(),
  requestLogs: z.lazy(() => RequestLogListRelationFilterSchema).optional()
}).strict();

export const InsightOrderByWithRelationInputSchema: z.ZodType<Prisma.InsightOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  requestId: z.lazy(() => SortOrderSchema).optional(),
  avgResponseTime: z.lazy(() => SortOrderSchema).optional(),
  errorRate: z.lazy(() => SortOrderSchema).optional(),
  slowestResponse: z.lazy(() => SortOrderSchema).optional(),
  avgPayloadSizeKB: z.lazy(() => SortOrderSchema).optional(),
  statusCodeDistribution: z.lazy(() => SortOrderSchema).optional(),
  mostCommonHeaders: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  recentOutputs: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  request: z.lazy(() => RequestOrderByWithRelationInputSchema).optional(),
  requestLogs: z.lazy(() => RequestLogOrderByRelationAggregateInputSchema).optional()
}).strict();

export const InsightWhereUniqueInputSchema: z.ZodType<Prisma.InsightWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => InsightWhereInputSchema),z.lazy(() => InsightWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => InsightWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InsightWhereInputSchema),z.lazy(() => InsightWhereInputSchema).array() ]).optional(),
  requestId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  avgResponseTime: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  errorRate: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  slowestResponse: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  avgPayloadSizeKB: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  statusCodeDistribution: z.lazy(() => JsonFilterSchema).optional(),
  mostCommonHeaders: z.lazy(() => JsonNullableFilterSchema).optional(),
  recentOutputs: z.lazy(() => JsonNullableFilterSchema).optional(),
  score: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  request: z.union([ z.lazy(() => RequestScalarRelationFilterSchema),z.lazy(() => RequestWhereInputSchema) ]).optional(),
  requestLogs: z.lazy(() => RequestLogListRelationFilterSchema).optional()
}).strict());

export const InsightOrderByWithAggregationInputSchema: z.ZodType<Prisma.InsightOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  requestId: z.lazy(() => SortOrderSchema).optional(),
  avgResponseTime: z.lazy(() => SortOrderSchema).optional(),
  errorRate: z.lazy(() => SortOrderSchema).optional(),
  slowestResponse: z.lazy(() => SortOrderSchema).optional(),
  avgPayloadSizeKB: z.lazy(() => SortOrderSchema).optional(),
  statusCodeDistribution: z.lazy(() => SortOrderSchema).optional(),
  mostCommonHeaders: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  recentOutputs: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => InsightCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => InsightAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => InsightMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => InsightMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => InsightSumOrderByAggregateInputSchema).optional()
}).strict();

export const InsightScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.InsightScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => InsightScalarWhereWithAggregatesInputSchema),z.lazy(() => InsightScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => InsightScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InsightScalarWhereWithAggregatesInputSchema),z.lazy(() => InsightScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  requestId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  avgResponseTime: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  errorRate: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  slowestResponse: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  avgPayloadSizeKB: z.union([ z.lazy(() => FloatWithAggregatesFilterSchema),z.number() ]).optional(),
  statusCodeDistribution: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  mostCommonHeaders: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  recentOutputs: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  score: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const AITipWhereInputSchema: z.ZodType<Prisma.AITipWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AITipWhereInputSchema),z.lazy(() => AITipWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AITipWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AITipWhereInputSchema),z.lazy(() => AITipWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  requestId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  codeSnippet: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  request: z.union([ z.lazy(() => RequestScalarRelationFilterSchema),z.lazy(() => RequestWhereInputSchema) ]).optional(),
}).strict();

export const AITipOrderByWithRelationInputSchema: z.ZodType<Prisma.AITipOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  requestId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  codeSnippet: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  request: z.lazy(() => RequestOrderByWithRelationInputSchema).optional()
}).strict();

export const AITipWhereUniqueInputSchema: z.ZodType<Prisma.AITipWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => AITipWhereInputSchema),z.lazy(() => AITipWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AITipWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AITipWhereInputSchema),z.lazy(() => AITipWhereInputSchema).array() ]).optional(),
  requestId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  codeSnippet: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  request: z.union([ z.lazy(() => RequestScalarRelationFilterSchema),z.lazy(() => RequestWhereInputSchema) ]).optional(),
}).strict());

export const AITipOrderByWithAggregationInputSchema: z.ZodType<Prisma.AITipOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  requestId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  codeSnippet: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AITipCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AITipMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AITipMinOrderByAggregateInputSchema).optional()
}).strict();

export const AITipScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AITipScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AITipScalarWhereWithAggregatesInputSchema),z.lazy(() => AITipScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AITipScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AITipScalarWhereWithAggregatesInputSchema),z.lazy(() => AITipScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  requestId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  codeSnippet: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  is_verified: z.boolean(),
  otp: z.number().int().optional().nullable(),
  last_login: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  requests: z.lazy(() => RequestCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  is_verified: z.boolean(),
  otp: z.number().int().optional().nullable(),
  last_login: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  requests: z.lazy(() => RequestUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  is_verified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  otp: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  last_login: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  requests: z.lazy(() => RequestUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  is_verified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  otp: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  last_login: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  requests: z.lazy(() => RequestUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  is_verified: z.boolean(),
  otp: z.number().int().optional().nullable(),
  last_login: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  is_verified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  otp: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  last_login: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  is_verified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  otp: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  last_login: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RequestCreateInputSchema: z.ZodType<Prisma.RequestCreateInput> = z.object({
  id: z.string().cuid().optional(),
  method: z.string(),
  url: z.string(),
  summary: z.string(),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutRequestsInputSchema),
  requestLogs: z.lazy(() => RequestLogCreateNestedManyWithoutRequestInputSchema).optional(),
  insights: z.lazy(() => InsightCreateNestedManyWithoutRequestInputSchema).optional(),
  aiTips: z.lazy(() => AITipCreateNestedManyWithoutRequestInputSchema).optional()
}).strict();

export const RequestUncheckedCreateInputSchema: z.ZodType<Prisma.RequestUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  method: z.string(),
  url: z.string(),
  summary: z.string(),
  createdAt: z.coerce.date().optional(),
  requestLogs: z.lazy(() => RequestLogUncheckedCreateNestedManyWithoutRequestInputSchema).optional(),
  insights: z.lazy(() => InsightUncheckedCreateNestedManyWithoutRequestInputSchema).optional(),
  aiTips: z.lazy(() => AITipUncheckedCreateNestedManyWithoutRequestInputSchema).optional()
}).strict();

export const RequestUpdateInputSchema: z.ZodType<Prisma.RequestUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutRequestsNestedInputSchema).optional(),
  requestLogs: z.lazy(() => RequestLogUpdateManyWithoutRequestNestedInputSchema).optional(),
  insights: z.lazy(() => InsightUpdateManyWithoutRequestNestedInputSchema).optional(),
  aiTips: z.lazy(() => AITipUpdateManyWithoutRequestNestedInputSchema).optional()
}).strict();

export const RequestUncheckedUpdateInputSchema: z.ZodType<Prisma.RequestUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  requestLogs: z.lazy(() => RequestLogUncheckedUpdateManyWithoutRequestNestedInputSchema).optional(),
  insights: z.lazy(() => InsightUncheckedUpdateManyWithoutRequestNestedInputSchema).optional(),
  aiTips: z.lazy(() => AITipUncheckedUpdateManyWithoutRequestNestedInputSchema).optional()
}).strict();

export const RequestCreateManyInputSchema: z.ZodType<Prisma.RequestCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  method: z.string(),
  url: z.string(),
  summary: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();

export const RequestUpdateManyMutationInputSchema: z.ZodType<Prisma.RequestUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RequestUncheckedUpdateManyInputSchema: z.ZodType<Prisma.RequestUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RequestLogCreateInputSchema: z.ZodType<Prisma.RequestLogCreateInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.number().int(),
  responseTimeMs: z.number().int(),
  responseSizeKB: z.number(),
  isError: z.boolean().optional(),
  responseBody: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  headers: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  request: z.lazy(() => RequestCreateNestedOneWithoutRequestLogsInputSchema),
  insight: z.lazy(() => InsightCreateNestedOneWithoutRequestLogsInputSchema).optional()
}).strict();

export const RequestLogUncheckedCreateInputSchema: z.ZodType<Prisma.RequestLogUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  requestId: z.string(),
  insightId: z.string().optional().nullable(),
  status: z.number().int(),
  responseTimeMs: z.number().int(),
  responseSizeKB: z.number(),
  isError: z.boolean().optional(),
  responseBody: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  headers: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const RequestLogUpdateInputSchema: z.ZodType<Prisma.RequestLogUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responseTimeMs: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responseSizeKB: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isError: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  responseBody: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  headers: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  request: z.lazy(() => RequestUpdateOneRequiredWithoutRequestLogsNestedInputSchema).optional(),
  insight: z.lazy(() => InsightUpdateOneWithoutRequestLogsNestedInputSchema).optional()
}).strict();

export const RequestLogUncheckedUpdateInputSchema: z.ZodType<Prisma.RequestLogUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  requestId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  insightId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responseTimeMs: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responseSizeKB: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isError: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  responseBody: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  headers: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RequestLogCreateManyInputSchema: z.ZodType<Prisma.RequestLogCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  requestId: z.string(),
  insightId: z.string().optional().nullable(),
  status: z.number().int(),
  responseTimeMs: z.number().int(),
  responseSizeKB: z.number(),
  isError: z.boolean().optional(),
  responseBody: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  headers: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const RequestLogUpdateManyMutationInputSchema: z.ZodType<Prisma.RequestLogUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responseTimeMs: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responseSizeKB: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isError: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  responseBody: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  headers: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RequestLogUncheckedUpdateManyInputSchema: z.ZodType<Prisma.RequestLogUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  requestId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  insightId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responseTimeMs: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responseSizeKB: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isError: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  responseBody: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  headers: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InsightCreateInputSchema: z.ZodType<Prisma.InsightCreateInput> = z.object({
  id: z.string().cuid().optional(),
  avgResponseTime: z.number().int(),
  errorRate: z.number(),
  slowestResponse: z.number().int(),
  avgPayloadSizeKB: z.number(),
  statusCodeDistribution: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  mostCommonHeaders: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  recentOutputs: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  request: z.lazy(() => RequestCreateNestedOneWithoutInsightsInputSchema),
  requestLogs: z.lazy(() => RequestLogCreateNestedManyWithoutInsightInputSchema).optional()
}).strict();

export const InsightUncheckedCreateInputSchema: z.ZodType<Prisma.InsightUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  requestId: z.string(),
  avgResponseTime: z.number().int(),
  errorRate: z.number(),
  slowestResponse: z.number().int(),
  avgPayloadSizeKB: z.number(),
  statusCodeDistribution: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  mostCommonHeaders: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  recentOutputs: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  requestLogs: z.lazy(() => RequestLogUncheckedCreateNestedManyWithoutInsightInputSchema).optional()
}).strict();

export const InsightUpdateInputSchema: z.ZodType<Prisma.InsightUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avgResponseTime: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  errorRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  slowestResponse: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  avgPayloadSizeKB: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  statusCodeDistribution: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  mostCommonHeaders: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  recentOutputs: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  request: z.lazy(() => RequestUpdateOneRequiredWithoutInsightsNestedInputSchema).optional(),
  requestLogs: z.lazy(() => RequestLogUpdateManyWithoutInsightNestedInputSchema).optional()
}).strict();

export const InsightUncheckedUpdateInputSchema: z.ZodType<Prisma.InsightUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  requestId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avgResponseTime: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  errorRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  slowestResponse: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  avgPayloadSizeKB: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  statusCodeDistribution: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  mostCommonHeaders: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  recentOutputs: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  requestLogs: z.lazy(() => RequestLogUncheckedUpdateManyWithoutInsightNestedInputSchema).optional()
}).strict();

export const InsightCreateManyInputSchema: z.ZodType<Prisma.InsightCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  requestId: z.string(),
  avgResponseTime: z.number().int(),
  errorRate: z.number(),
  slowestResponse: z.number().int(),
  avgPayloadSizeKB: z.number(),
  statusCodeDistribution: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  mostCommonHeaders: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  recentOutputs: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const InsightUpdateManyMutationInputSchema: z.ZodType<Prisma.InsightUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avgResponseTime: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  errorRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  slowestResponse: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  avgPayloadSizeKB: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  statusCodeDistribution: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  mostCommonHeaders: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  recentOutputs: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InsightUncheckedUpdateManyInputSchema: z.ZodType<Prisma.InsightUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  requestId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avgResponseTime: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  errorRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  slowestResponse: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  avgPayloadSizeKB: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  statusCodeDistribution: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  mostCommonHeaders: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  recentOutputs: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AITipCreateInputSchema: z.ZodType<Prisma.AITipCreateInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string(),
  codeSnippet: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  request: z.lazy(() => RequestCreateNestedOneWithoutAiTipsInputSchema)
}).strict();

export const AITipUncheckedCreateInputSchema: z.ZodType<Prisma.AITipUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  requestId: z.string(),
  title: z.string(),
  description: z.string(),
  codeSnippet: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AITipUpdateInputSchema: z.ZodType<Prisma.AITipUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  codeSnippet: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  request: z.lazy(() => RequestUpdateOneRequiredWithoutAiTipsNestedInputSchema).optional()
}).strict();

export const AITipUncheckedUpdateInputSchema: z.ZodType<Prisma.AITipUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  requestId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  codeSnippet: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AITipCreateManyInputSchema: z.ZodType<Prisma.AITipCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  requestId: z.string(),
  title: z.string(),
  description: z.string(),
  codeSnippet: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AITipUpdateManyMutationInputSchema: z.ZodType<Prisma.AITipUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  codeSnippet: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AITipUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AITipUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  requestId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  codeSnippet: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const IntNullableFilterSchema: z.ZodType<Prisma.IntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const RequestListRelationFilterSchema: z.ZodType<Prisma.RequestListRelationFilter> = z.object({
  every: z.lazy(() => RequestWhereInputSchema).optional(),
  some: z.lazy(() => RequestWhereInputSchema).optional(),
  none: z.lazy(() => RequestWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const RequestOrderByRelationAggregateInputSchema: z.ZodType<Prisma.RequestOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  is_verified: z.lazy(() => SortOrderSchema).optional(),
  otp: z.lazy(() => SortOrderSchema).optional(),
  last_login: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserAvgOrderByAggregateInputSchema: z.ZodType<Prisma.UserAvgOrderByAggregateInput> = z.object({
  otp: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  is_verified: z.lazy(() => SortOrderSchema).optional(),
  otp: z.lazy(() => SortOrderSchema).optional(),
  last_login: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  is_verified: z.lazy(() => SortOrderSchema).optional(),
  otp: z.lazy(() => SortOrderSchema).optional(),
  last_login: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserSumOrderByAggregateInputSchema: z.ZodType<Prisma.UserSumOrderByAggregateInput> = z.object({
  otp: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const IntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.IntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const RequestLogListRelationFilterSchema: z.ZodType<Prisma.RequestLogListRelationFilter> = z.object({
  every: z.lazy(() => RequestLogWhereInputSchema).optional(),
  some: z.lazy(() => RequestLogWhereInputSchema).optional(),
  none: z.lazy(() => RequestLogWhereInputSchema).optional()
}).strict();

export const InsightListRelationFilterSchema: z.ZodType<Prisma.InsightListRelationFilter> = z.object({
  every: z.lazy(() => InsightWhereInputSchema).optional(),
  some: z.lazy(() => InsightWhereInputSchema).optional(),
  none: z.lazy(() => InsightWhereInputSchema).optional()
}).strict();

export const AITipListRelationFilterSchema: z.ZodType<Prisma.AITipListRelationFilter> = z.object({
  every: z.lazy(() => AITipWhereInputSchema).optional(),
  some: z.lazy(() => AITipWhereInputSchema).optional(),
  none: z.lazy(() => AITipWhereInputSchema).optional()
}).strict();

export const RequestLogOrderByRelationAggregateInputSchema: z.ZodType<Prisma.RequestLogOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InsightOrderByRelationAggregateInputSchema: z.ZodType<Prisma.InsightOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AITipOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AITipOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RequestCountOrderByAggregateInputSchema: z.ZodType<Prisma.RequestCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  method: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  summary: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RequestMaxOrderByAggregateInputSchema: z.ZodType<Prisma.RequestMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  method: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  summary: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RequestMinOrderByAggregateInputSchema: z.ZodType<Prisma.RequestMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  method: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  summary: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const FloatFilterSchema: z.ZodType<Prisma.FloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const RequestScalarRelationFilterSchema: z.ZodType<Prisma.RequestScalarRelationFilter> = z.object({
  is: z.lazy(() => RequestWhereInputSchema).optional(),
  isNot: z.lazy(() => RequestWhereInputSchema).optional()
}).strict();

export const InsightNullableScalarRelationFilterSchema: z.ZodType<Prisma.InsightNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => InsightWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => InsightWhereInputSchema).optional().nullable()
}).strict();

export const RequestLogCountOrderByAggregateInputSchema: z.ZodType<Prisma.RequestLogCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  requestId: z.lazy(() => SortOrderSchema).optional(),
  insightId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  responseTimeMs: z.lazy(() => SortOrderSchema).optional(),
  responseSizeKB: z.lazy(() => SortOrderSchema).optional(),
  isError: z.lazy(() => SortOrderSchema).optional(),
  responseBody: z.lazy(() => SortOrderSchema).optional(),
  headers: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.lazy(() => SortOrderSchema).optional(),
  userAgent: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RequestLogAvgOrderByAggregateInputSchema: z.ZodType<Prisma.RequestLogAvgOrderByAggregateInput> = z.object({
  status: z.lazy(() => SortOrderSchema).optional(),
  responseTimeMs: z.lazy(() => SortOrderSchema).optional(),
  responseSizeKB: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RequestLogMaxOrderByAggregateInputSchema: z.ZodType<Prisma.RequestLogMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  requestId: z.lazy(() => SortOrderSchema).optional(),
  insightId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  responseTimeMs: z.lazy(() => SortOrderSchema).optional(),
  responseSizeKB: z.lazy(() => SortOrderSchema).optional(),
  isError: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.lazy(() => SortOrderSchema).optional(),
  userAgent: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RequestLogMinOrderByAggregateInputSchema: z.ZodType<Prisma.RequestLogMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  requestId: z.lazy(() => SortOrderSchema).optional(),
  insightId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  responseTimeMs: z.lazy(() => SortOrderSchema).optional(),
  responseSizeKB: z.lazy(() => SortOrderSchema).optional(),
  isError: z.lazy(() => SortOrderSchema).optional(),
  ipAddress: z.lazy(() => SortOrderSchema).optional(),
  userAgent: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RequestLogSumOrderByAggregateInputSchema: z.ZodType<Prisma.RequestLogSumOrderByAggregateInput> = z.object({
  status: z.lazy(() => SortOrderSchema).optional(),
  responseTimeMs: z.lazy(() => SortOrderSchema).optional(),
  responseSizeKB: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const FloatWithAggregatesFilterSchema: z.ZodType<Prisma.FloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonNullableFilterSchema).optional()
}).strict();

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const InsightCountOrderByAggregateInputSchema: z.ZodType<Prisma.InsightCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  requestId: z.lazy(() => SortOrderSchema).optional(),
  avgResponseTime: z.lazy(() => SortOrderSchema).optional(),
  errorRate: z.lazy(() => SortOrderSchema).optional(),
  slowestResponse: z.lazy(() => SortOrderSchema).optional(),
  avgPayloadSizeKB: z.lazy(() => SortOrderSchema).optional(),
  statusCodeDistribution: z.lazy(() => SortOrderSchema).optional(),
  mostCommonHeaders: z.lazy(() => SortOrderSchema).optional(),
  recentOutputs: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InsightAvgOrderByAggregateInputSchema: z.ZodType<Prisma.InsightAvgOrderByAggregateInput> = z.object({
  avgResponseTime: z.lazy(() => SortOrderSchema).optional(),
  errorRate: z.lazy(() => SortOrderSchema).optional(),
  slowestResponse: z.lazy(() => SortOrderSchema).optional(),
  avgPayloadSizeKB: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InsightMaxOrderByAggregateInputSchema: z.ZodType<Prisma.InsightMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  requestId: z.lazy(() => SortOrderSchema).optional(),
  avgResponseTime: z.lazy(() => SortOrderSchema).optional(),
  errorRate: z.lazy(() => SortOrderSchema).optional(),
  slowestResponse: z.lazy(() => SortOrderSchema).optional(),
  avgPayloadSizeKB: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InsightMinOrderByAggregateInputSchema: z.ZodType<Prisma.InsightMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  requestId: z.lazy(() => SortOrderSchema).optional(),
  avgResponseTime: z.lazy(() => SortOrderSchema).optional(),
  errorRate: z.lazy(() => SortOrderSchema).optional(),
  slowestResponse: z.lazy(() => SortOrderSchema).optional(),
  avgPayloadSizeKB: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const InsightSumOrderByAggregateInputSchema: z.ZodType<Prisma.InsightSumOrderByAggregateInput> = z.object({
  avgResponseTime: z.lazy(() => SortOrderSchema).optional(),
  errorRate: z.lazy(() => SortOrderSchema).optional(),
  slowestResponse: z.lazy(() => SortOrderSchema).optional(),
  avgPayloadSizeKB: z.lazy(() => SortOrderSchema).optional(),
  score: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional()
}).strict();

export const AITipCountOrderByAggregateInputSchema: z.ZodType<Prisma.AITipCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  requestId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  codeSnippet: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AITipMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AITipMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  requestId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  codeSnippet: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AITipMinOrderByAggregateInputSchema: z.ZodType<Prisma.AITipMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  requestId: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  codeSnippet: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const RequestCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.RequestCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => RequestCreateWithoutUserInputSchema),z.lazy(() => RequestCreateWithoutUserInputSchema).array(),z.lazy(() => RequestUncheckedCreateWithoutUserInputSchema),z.lazy(() => RequestUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RequestCreateOrConnectWithoutUserInputSchema),z.lazy(() => RequestCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RequestCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RequestWhereUniqueInputSchema),z.lazy(() => RequestWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RequestUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.RequestUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => RequestCreateWithoutUserInputSchema),z.lazy(() => RequestCreateWithoutUserInputSchema).array(),z.lazy(() => RequestUncheckedCreateWithoutUserInputSchema),z.lazy(() => RequestUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RequestCreateOrConnectWithoutUserInputSchema),z.lazy(() => RequestCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RequestCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RequestWhereUniqueInputSchema),z.lazy(() => RequestWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const NullableIntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableIntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const RequestUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.RequestUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => RequestCreateWithoutUserInputSchema),z.lazy(() => RequestCreateWithoutUserInputSchema).array(),z.lazy(() => RequestUncheckedCreateWithoutUserInputSchema),z.lazy(() => RequestUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RequestCreateOrConnectWithoutUserInputSchema),z.lazy(() => RequestCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RequestUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => RequestUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RequestCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RequestWhereUniqueInputSchema),z.lazy(() => RequestWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RequestWhereUniqueInputSchema),z.lazy(() => RequestWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RequestWhereUniqueInputSchema),z.lazy(() => RequestWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RequestWhereUniqueInputSchema),z.lazy(() => RequestWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RequestUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => RequestUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RequestUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => RequestUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RequestScalarWhereInputSchema),z.lazy(() => RequestScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RequestUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.RequestUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => RequestCreateWithoutUserInputSchema),z.lazy(() => RequestCreateWithoutUserInputSchema).array(),z.lazy(() => RequestUncheckedCreateWithoutUserInputSchema),z.lazy(() => RequestUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RequestCreateOrConnectWithoutUserInputSchema),z.lazy(() => RequestCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RequestUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => RequestUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RequestCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RequestWhereUniqueInputSchema),z.lazy(() => RequestWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RequestWhereUniqueInputSchema),z.lazy(() => RequestWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RequestWhereUniqueInputSchema),z.lazy(() => RequestWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RequestWhereUniqueInputSchema),z.lazy(() => RequestWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RequestUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => RequestUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RequestUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => RequestUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RequestScalarWhereInputSchema),z.lazy(() => RequestScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutRequestsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutRequestsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutRequestsInputSchema),z.lazy(() => UserUncheckedCreateWithoutRequestsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutRequestsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const RequestLogCreateNestedManyWithoutRequestInputSchema: z.ZodType<Prisma.RequestLogCreateNestedManyWithoutRequestInput> = z.object({
  create: z.union([ z.lazy(() => RequestLogCreateWithoutRequestInputSchema),z.lazy(() => RequestLogCreateWithoutRequestInputSchema).array(),z.lazy(() => RequestLogUncheckedCreateWithoutRequestInputSchema),z.lazy(() => RequestLogUncheckedCreateWithoutRequestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RequestLogCreateOrConnectWithoutRequestInputSchema),z.lazy(() => RequestLogCreateOrConnectWithoutRequestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RequestLogCreateManyRequestInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RequestLogWhereUniqueInputSchema),z.lazy(() => RequestLogWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const InsightCreateNestedManyWithoutRequestInputSchema: z.ZodType<Prisma.InsightCreateNestedManyWithoutRequestInput> = z.object({
  create: z.union([ z.lazy(() => InsightCreateWithoutRequestInputSchema),z.lazy(() => InsightCreateWithoutRequestInputSchema).array(),z.lazy(() => InsightUncheckedCreateWithoutRequestInputSchema),z.lazy(() => InsightUncheckedCreateWithoutRequestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InsightCreateOrConnectWithoutRequestInputSchema),z.lazy(() => InsightCreateOrConnectWithoutRequestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InsightCreateManyRequestInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => InsightWhereUniqueInputSchema),z.lazy(() => InsightWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AITipCreateNestedManyWithoutRequestInputSchema: z.ZodType<Prisma.AITipCreateNestedManyWithoutRequestInput> = z.object({
  create: z.union([ z.lazy(() => AITipCreateWithoutRequestInputSchema),z.lazy(() => AITipCreateWithoutRequestInputSchema).array(),z.lazy(() => AITipUncheckedCreateWithoutRequestInputSchema),z.lazy(() => AITipUncheckedCreateWithoutRequestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AITipCreateOrConnectWithoutRequestInputSchema),z.lazy(() => AITipCreateOrConnectWithoutRequestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AITipCreateManyRequestInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AITipWhereUniqueInputSchema),z.lazy(() => AITipWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RequestLogUncheckedCreateNestedManyWithoutRequestInputSchema: z.ZodType<Prisma.RequestLogUncheckedCreateNestedManyWithoutRequestInput> = z.object({
  create: z.union([ z.lazy(() => RequestLogCreateWithoutRequestInputSchema),z.lazy(() => RequestLogCreateWithoutRequestInputSchema).array(),z.lazy(() => RequestLogUncheckedCreateWithoutRequestInputSchema),z.lazy(() => RequestLogUncheckedCreateWithoutRequestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RequestLogCreateOrConnectWithoutRequestInputSchema),z.lazy(() => RequestLogCreateOrConnectWithoutRequestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RequestLogCreateManyRequestInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RequestLogWhereUniqueInputSchema),z.lazy(() => RequestLogWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const InsightUncheckedCreateNestedManyWithoutRequestInputSchema: z.ZodType<Prisma.InsightUncheckedCreateNestedManyWithoutRequestInput> = z.object({
  create: z.union([ z.lazy(() => InsightCreateWithoutRequestInputSchema),z.lazy(() => InsightCreateWithoutRequestInputSchema).array(),z.lazy(() => InsightUncheckedCreateWithoutRequestInputSchema),z.lazy(() => InsightUncheckedCreateWithoutRequestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InsightCreateOrConnectWithoutRequestInputSchema),z.lazy(() => InsightCreateOrConnectWithoutRequestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InsightCreateManyRequestInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => InsightWhereUniqueInputSchema),z.lazy(() => InsightWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AITipUncheckedCreateNestedManyWithoutRequestInputSchema: z.ZodType<Prisma.AITipUncheckedCreateNestedManyWithoutRequestInput> = z.object({
  create: z.union([ z.lazy(() => AITipCreateWithoutRequestInputSchema),z.lazy(() => AITipCreateWithoutRequestInputSchema).array(),z.lazy(() => AITipUncheckedCreateWithoutRequestInputSchema),z.lazy(() => AITipUncheckedCreateWithoutRequestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AITipCreateOrConnectWithoutRequestInputSchema),z.lazy(() => AITipCreateOrConnectWithoutRequestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AITipCreateManyRequestInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AITipWhereUniqueInputSchema),z.lazy(() => AITipWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutRequestsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutRequestsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutRequestsInputSchema),z.lazy(() => UserUncheckedCreateWithoutRequestsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutRequestsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutRequestsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutRequestsInputSchema),z.lazy(() => UserUpdateWithoutRequestsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutRequestsInputSchema) ]).optional(),
}).strict();

export const RequestLogUpdateManyWithoutRequestNestedInputSchema: z.ZodType<Prisma.RequestLogUpdateManyWithoutRequestNestedInput> = z.object({
  create: z.union([ z.lazy(() => RequestLogCreateWithoutRequestInputSchema),z.lazy(() => RequestLogCreateWithoutRequestInputSchema).array(),z.lazy(() => RequestLogUncheckedCreateWithoutRequestInputSchema),z.lazy(() => RequestLogUncheckedCreateWithoutRequestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RequestLogCreateOrConnectWithoutRequestInputSchema),z.lazy(() => RequestLogCreateOrConnectWithoutRequestInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RequestLogUpsertWithWhereUniqueWithoutRequestInputSchema),z.lazy(() => RequestLogUpsertWithWhereUniqueWithoutRequestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RequestLogCreateManyRequestInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RequestLogWhereUniqueInputSchema),z.lazy(() => RequestLogWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RequestLogWhereUniqueInputSchema),z.lazy(() => RequestLogWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RequestLogWhereUniqueInputSchema),z.lazy(() => RequestLogWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RequestLogWhereUniqueInputSchema),z.lazy(() => RequestLogWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RequestLogUpdateWithWhereUniqueWithoutRequestInputSchema),z.lazy(() => RequestLogUpdateWithWhereUniqueWithoutRequestInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RequestLogUpdateManyWithWhereWithoutRequestInputSchema),z.lazy(() => RequestLogUpdateManyWithWhereWithoutRequestInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RequestLogScalarWhereInputSchema),z.lazy(() => RequestLogScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const InsightUpdateManyWithoutRequestNestedInputSchema: z.ZodType<Prisma.InsightUpdateManyWithoutRequestNestedInput> = z.object({
  create: z.union([ z.lazy(() => InsightCreateWithoutRequestInputSchema),z.lazy(() => InsightCreateWithoutRequestInputSchema).array(),z.lazy(() => InsightUncheckedCreateWithoutRequestInputSchema),z.lazy(() => InsightUncheckedCreateWithoutRequestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InsightCreateOrConnectWithoutRequestInputSchema),z.lazy(() => InsightCreateOrConnectWithoutRequestInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => InsightUpsertWithWhereUniqueWithoutRequestInputSchema),z.lazy(() => InsightUpsertWithWhereUniqueWithoutRequestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InsightCreateManyRequestInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => InsightWhereUniqueInputSchema),z.lazy(() => InsightWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => InsightWhereUniqueInputSchema),z.lazy(() => InsightWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => InsightWhereUniqueInputSchema),z.lazy(() => InsightWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => InsightWhereUniqueInputSchema),z.lazy(() => InsightWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => InsightUpdateWithWhereUniqueWithoutRequestInputSchema),z.lazy(() => InsightUpdateWithWhereUniqueWithoutRequestInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => InsightUpdateManyWithWhereWithoutRequestInputSchema),z.lazy(() => InsightUpdateManyWithWhereWithoutRequestInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => InsightScalarWhereInputSchema),z.lazy(() => InsightScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AITipUpdateManyWithoutRequestNestedInputSchema: z.ZodType<Prisma.AITipUpdateManyWithoutRequestNestedInput> = z.object({
  create: z.union([ z.lazy(() => AITipCreateWithoutRequestInputSchema),z.lazy(() => AITipCreateWithoutRequestInputSchema).array(),z.lazy(() => AITipUncheckedCreateWithoutRequestInputSchema),z.lazy(() => AITipUncheckedCreateWithoutRequestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AITipCreateOrConnectWithoutRequestInputSchema),z.lazy(() => AITipCreateOrConnectWithoutRequestInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AITipUpsertWithWhereUniqueWithoutRequestInputSchema),z.lazy(() => AITipUpsertWithWhereUniqueWithoutRequestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AITipCreateManyRequestInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AITipWhereUniqueInputSchema),z.lazy(() => AITipWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AITipWhereUniqueInputSchema),z.lazy(() => AITipWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AITipWhereUniqueInputSchema),z.lazy(() => AITipWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AITipWhereUniqueInputSchema),z.lazy(() => AITipWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AITipUpdateWithWhereUniqueWithoutRequestInputSchema),z.lazy(() => AITipUpdateWithWhereUniqueWithoutRequestInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AITipUpdateManyWithWhereWithoutRequestInputSchema),z.lazy(() => AITipUpdateManyWithWhereWithoutRequestInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AITipScalarWhereInputSchema),z.lazy(() => AITipScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RequestLogUncheckedUpdateManyWithoutRequestNestedInputSchema: z.ZodType<Prisma.RequestLogUncheckedUpdateManyWithoutRequestNestedInput> = z.object({
  create: z.union([ z.lazy(() => RequestLogCreateWithoutRequestInputSchema),z.lazy(() => RequestLogCreateWithoutRequestInputSchema).array(),z.lazy(() => RequestLogUncheckedCreateWithoutRequestInputSchema),z.lazy(() => RequestLogUncheckedCreateWithoutRequestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RequestLogCreateOrConnectWithoutRequestInputSchema),z.lazy(() => RequestLogCreateOrConnectWithoutRequestInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RequestLogUpsertWithWhereUniqueWithoutRequestInputSchema),z.lazy(() => RequestLogUpsertWithWhereUniqueWithoutRequestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RequestLogCreateManyRequestInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RequestLogWhereUniqueInputSchema),z.lazy(() => RequestLogWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RequestLogWhereUniqueInputSchema),z.lazy(() => RequestLogWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RequestLogWhereUniqueInputSchema),z.lazy(() => RequestLogWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RequestLogWhereUniqueInputSchema),z.lazy(() => RequestLogWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RequestLogUpdateWithWhereUniqueWithoutRequestInputSchema),z.lazy(() => RequestLogUpdateWithWhereUniqueWithoutRequestInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RequestLogUpdateManyWithWhereWithoutRequestInputSchema),z.lazy(() => RequestLogUpdateManyWithWhereWithoutRequestInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RequestLogScalarWhereInputSchema),z.lazy(() => RequestLogScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const InsightUncheckedUpdateManyWithoutRequestNestedInputSchema: z.ZodType<Prisma.InsightUncheckedUpdateManyWithoutRequestNestedInput> = z.object({
  create: z.union([ z.lazy(() => InsightCreateWithoutRequestInputSchema),z.lazy(() => InsightCreateWithoutRequestInputSchema).array(),z.lazy(() => InsightUncheckedCreateWithoutRequestInputSchema),z.lazy(() => InsightUncheckedCreateWithoutRequestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => InsightCreateOrConnectWithoutRequestInputSchema),z.lazy(() => InsightCreateOrConnectWithoutRequestInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => InsightUpsertWithWhereUniqueWithoutRequestInputSchema),z.lazy(() => InsightUpsertWithWhereUniqueWithoutRequestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => InsightCreateManyRequestInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => InsightWhereUniqueInputSchema),z.lazy(() => InsightWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => InsightWhereUniqueInputSchema),z.lazy(() => InsightWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => InsightWhereUniqueInputSchema),z.lazy(() => InsightWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => InsightWhereUniqueInputSchema),z.lazy(() => InsightWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => InsightUpdateWithWhereUniqueWithoutRequestInputSchema),z.lazy(() => InsightUpdateWithWhereUniqueWithoutRequestInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => InsightUpdateManyWithWhereWithoutRequestInputSchema),z.lazy(() => InsightUpdateManyWithWhereWithoutRequestInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => InsightScalarWhereInputSchema),z.lazy(() => InsightScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AITipUncheckedUpdateManyWithoutRequestNestedInputSchema: z.ZodType<Prisma.AITipUncheckedUpdateManyWithoutRequestNestedInput> = z.object({
  create: z.union([ z.lazy(() => AITipCreateWithoutRequestInputSchema),z.lazy(() => AITipCreateWithoutRequestInputSchema).array(),z.lazy(() => AITipUncheckedCreateWithoutRequestInputSchema),z.lazy(() => AITipUncheckedCreateWithoutRequestInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AITipCreateOrConnectWithoutRequestInputSchema),z.lazy(() => AITipCreateOrConnectWithoutRequestInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AITipUpsertWithWhereUniqueWithoutRequestInputSchema),z.lazy(() => AITipUpsertWithWhereUniqueWithoutRequestInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AITipCreateManyRequestInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AITipWhereUniqueInputSchema),z.lazy(() => AITipWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AITipWhereUniqueInputSchema),z.lazy(() => AITipWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AITipWhereUniqueInputSchema),z.lazy(() => AITipWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AITipWhereUniqueInputSchema),z.lazy(() => AITipWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AITipUpdateWithWhereUniqueWithoutRequestInputSchema),z.lazy(() => AITipUpdateWithWhereUniqueWithoutRequestInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AITipUpdateManyWithWhereWithoutRequestInputSchema),z.lazy(() => AITipUpdateManyWithWhereWithoutRequestInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AITipScalarWhereInputSchema),z.lazy(() => AITipScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RequestCreateNestedOneWithoutRequestLogsInputSchema: z.ZodType<Prisma.RequestCreateNestedOneWithoutRequestLogsInput> = z.object({
  create: z.union([ z.lazy(() => RequestCreateWithoutRequestLogsInputSchema),z.lazy(() => RequestUncheckedCreateWithoutRequestLogsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RequestCreateOrConnectWithoutRequestLogsInputSchema).optional(),
  connect: z.lazy(() => RequestWhereUniqueInputSchema).optional()
}).strict();

export const InsightCreateNestedOneWithoutRequestLogsInputSchema: z.ZodType<Prisma.InsightCreateNestedOneWithoutRequestLogsInput> = z.object({
  create: z.union([ z.lazy(() => InsightCreateWithoutRequestLogsInputSchema),z.lazy(() => InsightUncheckedCreateWithoutRequestLogsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => InsightCreateOrConnectWithoutRequestLogsInputSchema).optional(),
  connect: z.lazy(() => InsightWhereUniqueInputSchema).optional()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const FloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.FloatFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const RequestUpdateOneRequiredWithoutRequestLogsNestedInputSchema: z.ZodType<Prisma.RequestUpdateOneRequiredWithoutRequestLogsNestedInput> = z.object({
  create: z.union([ z.lazy(() => RequestCreateWithoutRequestLogsInputSchema),z.lazy(() => RequestUncheckedCreateWithoutRequestLogsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RequestCreateOrConnectWithoutRequestLogsInputSchema).optional(),
  upsert: z.lazy(() => RequestUpsertWithoutRequestLogsInputSchema).optional(),
  connect: z.lazy(() => RequestWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => RequestUpdateToOneWithWhereWithoutRequestLogsInputSchema),z.lazy(() => RequestUpdateWithoutRequestLogsInputSchema),z.lazy(() => RequestUncheckedUpdateWithoutRequestLogsInputSchema) ]).optional(),
}).strict();

export const InsightUpdateOneWithoutRequestLogsNestedInputSchema: z.ZodType<Prisma.InsightUpdateOneWithoutRequestLogsNestedInput> = z.object({
  create: z.union([ z.lazy(() => InsightCreateWithoutRequestLogsInputSchema),z.lazy(() => InsightUncheckedCreateWithoutRequestLogsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => InsightCreateOrConnectWithoutRequestLogsInputSchema).optional(),
  upsert: z.lazy(() => InsightUpsertWithoutRequestLogsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => InsightWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => InsightWhereInputSchema) ]).optional(),
  connect: z.lazy(() => InsightWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => InsightUpdateToOneWithWhereWithoutRequestLogsInputSchema),z.lazy(() => InsightUpdateWithoutRequestLogsInputSchema),z.lazy(() => InsightUncheckedUpdateWithoutRequestLogsInputSchema) ]).optional(),
}).strict();

export const RequestCreateNestedOneWithoutInsightsInputSchema: z.ZodType<Prisma.RequestCreateNestedOneWithoutInsightsInput> = z.object({
  create: z.union([ z.lazy(() => RequestCreateWithoutInsightsInputSchema),z.lazy(() => RequestUncheckedCreateWithoutInsightsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RequestCreateOrConnectWithoutInsightsInputSchema).optional(),
  connect: z.lazy(() => RequestWhereUniqueInputSchema).optional()
}).strict();

export const RequestLogCreateNestedManyWithoutInsightInputSchema: z.ZodType<Prisma.RequestLogCreateNestedManyWithoutInsightInput> = z.object({
  create: z.union([ z.lazy(() => RequestLogCreateWithoutInsightInputSchema),z.lazy(() => RequestLogCreateWithoutInsightInputSchema).array(),z.lazy(() => RequestLogUncheckedCreateWithoutInsightInputSchema),z.lazy(() => RequestLogUncheckedCreateWithoutInsightInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RequestLogCreateOrConnectWithoutInsightInputSchema),z.lazy(() => RequestLogCreateOrConnectWithoutInsightInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RequestLogCreateManyInsightInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RequestLogWhereUniqueInputSchema),z.lazy(() => RequestLogWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RequestLogUncheckedCreateNestedManyWithoutInsightInputSchema: z.ZodType<Prisma.RequestLogUncheckedCreateNestedManyWithoutInsightInput> = z.object({
  create: z.union([ z.lazy(() => RequestLogCreateWithoutInsightInputSchema),z.lazy(() => RequestLogCreateWithoutInsightInputSchema).array(),z.lazy(() => RequestLogUncheckedCreateWithoutInsightInputSchema),z.lazy(() => RequestLogUncheckedCreateWithoutInsightInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RequestLogCreateOrConnectWithoutInsightInputSchema),z.lazy(() => RequestLogCreateOrConnectWithoutInsightInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RequestLogCreateManyInsightInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => RequestLogWhereUniqueInputSchema),z.lazy(() => RequestLogWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const RequestUpdateOneRequiredWithoutInsightsNestedInputSchema: z.ZodType<Prisma.RequestUpdateOneRequiredWithoutInsightsNestedInput> = z.object({
  create: z.union([ z.lazy(() => RequestCreateWithoutInsightsInputSchema),z.lazy(() => RequestUncheckedCreateWithoutInsightsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RequestCreateOrConnectWithoutInsightsInputSchema).optional(),
  upsert: z.lazy(() => RequestUpsertWithoutInsightsInputSchema).optional(),
  connect: z.lazy(() => RequestWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => RequestUpdateToOneWithWhereWithoutInsightsInputSchema),z.lazy(() => RequestUpdateWithoutInsightsInputSchema),z.lazy(() => RequestUncheckedUpdateWithoutInsightsInputSchema) ]).optional(),
}).strict();

export const RequestLogUpdateManyWithoutInsightNestedInputSchema: z.ZodType<Prisma.RequestLogUpdateManyWithoutInsightNestedInput> = z.object({
  create: z.union([ z.lazy(() => RequestLogCreateWithoutInsightInputSchema),z.lazy(() => RequestLogCreateWithoutInsightInputSchema).array(),z.lazy(() => RequestLogUncheckedCreateWithoutInsightInputSchema),z.lazy(() => RequestLogUncheckedCreateWithoutInsightInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RequestLogCreateOrConnectWithoutInsightInputSchema),z.lazy(() => RequestLogCreateOrConnectWithoutInsightInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RequestLogUpsertWithWhereUniqueWithoutInsightInputSchema),z.lazy(() => RequestLogUpsertWithWhereUniqueWithoutInsightInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RequestLogCreateManyInsightInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RequestLogWhereUniqueInputSchema),z.lazy(() => RequestLogWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RequestLogWhereUniqueInputSchema),z.lazy(() => RequestLogWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RequestLogWhereUniqueInputSchema),z.lazy(() => RequestLogWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RequestLogWhereUniqueInputSchema),z.lazy(() => RequestLogWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RequestLogUpdateWithWhereUniqueWithoutInsightInputSchema),z.lazy(() => RequestLogUpdateWithWhereUniqueWithoutInsightInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RequestLogUpdateManyWithWhereWithoutInsightInputSchema),z.lazy(() => RequestLogUpdateManyWithWhereWithoutInsightInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RequestLogScalarWhereInputSchema),z.lazy(() => RequestLogScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RequestLogUncheckedUpdateManyWithoutInsightNestedInputSchema: z.ZodType<Prisma.RequestLogUncheckedUpdateManyWithoutInsightNestedInput> = z.object({
  create: z.union([ z.lazy(() => RequestLogCreateWithoutInsightInputSchema),z.lazy(() => RequestLogCreateWithoutInsightInputSchema).array(),z.lazy(() => RequestLogUncheckedCreateWithoutInsightInputSchema),z.lazy(() => RequestLogUncheckedCreateWithoutInsightInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => RequestLogCreateOrConnectWithoutInsightInputSchema),z.lazy(() => RequestLogCreateOrConnectWithoutInsightInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => RequestLogUpsertWithWhereUniqueWithoutInsightInputSchema),z.lazy(() => RequestLogUpsertWithWhereUniqueWithoutInsightInputSchema).array() ]).optional(),
  createMany: z.lazy(() => RequestLogCreateManyInsightInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => RequestLogWhereUniqueInputSchema),z.lazy(() => RequestLogWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => RequestLogWhereUniqueInputSchema),z.lazy(() => RequestLogWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => RequestLogWhereUniqueInputSchema),z.lazy(() => RequestLogWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => RequestLogWhereUniqueInputSchema),z.lazy(() => RequestLogWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => RequestLogUpdateWithWhereUniqueWithoutInsightInputSchema),z.lazy(() => RequestLogUpdateWithWhereUniqueWithoutInsightInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => RequestLogUpdateManyWithWhereWithoutInsightInputSchema),z.lazy(() => RequestLogUpdateManyWithWhereWithoutInsightInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => RequestLogScalarWhereInputSchema),z.lazy(() => RequestLogScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const RequestCreateNestedOneWithoutAiTipsInputSchema: z.ZodType<Prisma.RequestCreateNestedOneWithoutAiTipsInput> = z.object({
  create: z.union([ z.lazy(() => RequestCreateWithoutAiTipsInputSchema),z.lazy(() => RequestUncheckedCreateWithoutAiTipsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RequestCreateOrConnectWithoutAiTipsInputSchema).optional(),
  connect: z.lazy(() => RequestWhereUniqueInputSchema).optional()
}).strict();

export const RequestUpdateOneRequiredWithoutAiTipsNestedInputSchema: z.ZodType<Prisma.RequestUpdateOneRequiredWithoutAiTipsNestedInput> = z.object({
  create: z.union([ z.lazy(() => RequestCreateWithoutAiTipsInputSchema),z.lazy(() => RequestUncheckedCreateWithoutAiTipsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => RequestCreateOrConnectWithoutAiTipsInputSchema).optional(),
  upsert: z.lazy(() => RequestUpsertWithoutAiTipsInputSchema).optional(),
  connect: z.lazy(() => RequestWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => RequestUpdateToOneWithWhereWithoutAiTipsInputSchema),z.lazy(() => RequestUpdateWithoutAiTipsInputSchema),z.lazy(() => RequestUncheckedUpdateWithoutAiTipsInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedIntNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntNullableWithAggregatesFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedIntNullableFilterSchema).optional()
}).strict();

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatFilterSchema).optional()
}).strict();

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().array().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  array_contains: InputJsonValueSchema.optional().nullable(),
  lt: InputJsonValueSchema.optional(),
  lte: InputJsonValueSchema.optional(),
  gt: InputJsonValueSchema.optional(),
  gte: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional()
}).strict();

export const RequestCreateWithoutUserInputSchema: z.ZodType<Prisma.RequestCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  method: z.string(),
  url: z.string(),
  summary: z.string(),
  createdAt: z.coerce.date().optional(),
  requestLogs: z.lazy(() => RequestLogCreateNestedManyWithoutRequestInputSchema).optional(),
  insights: z.lazy(() => InsightCreateNestedManyWithoutRequestInputSchema).optional(),
  aiTips: z.lazy(() => AITipCreateNestedManyWithoutRequestInputSchema).optional()
}).strict();

export const RequestUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.RequestUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().cuid().optional(),
  method: z.string(),
  url: z.string(),
  summary: z.string(),
  createdAt: z.coerce.date().optional(),
  requestLogs: z.lazy(() => RequestLogUncheckedCreateNestedManyWithoutRequestInputSchema).optional(),
  insights: z.lazy(() => InsightUncheckedCreateNestedManyWithoutRequestInputSchema).optional(),
  aiTips: z.lazy(() => AITipUncheckedCreateNestedManyWithoutRequestInputSchema).optional()
}).strict();

export const RequestCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.RequestCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => RequestWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RequestCreateWithoutUserInputSchema),z.lazy(() => RequestUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const RequestCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.RequestCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => RequestCreateManyUserInputSchema),z.lazy(() => RequestCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const RequestUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.RequestUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => RequestWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => RequestUpdateWithoutUserInputSchema),z.lazy(() => RequestUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => RequestCreateWithoutUserInputSchema),z.lazy(() => RequestUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const RequestUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.RequestUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => RequestWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => RequestUpdateWithoutUserInputSchema),z.lazy(() => RequestUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const RequestUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.RequestUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => RequestScalarWhereInputSchema),
  data: z.union([ z.lazy(() => RequestUpdateManyMutationInputSchema),z.lazy(() => RequestUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const RequestScalarWhereInputSchema: z.ZodType<Prisma.RequestScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RequestScalarWhereInputSchema),z.lazy(() => RequestScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RequestScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RequestScalarWhereInputSchema),z.lazy(() => RequestScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  method: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  summary: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateWithoutRequestsInputSchema: z.ZodType<Prisma.UserCreateWithoutRequestsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  is_verified: z.boolean(),
  otp: z.number().int().optional().nullable(),
  last_login: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUncheckedCreateWithoutRequestsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutRequestsInput> = z.object({
  id: z.string().cuid().optional(),
  email: z.string(),
  name: z.string().optional().nullable(),
  password: z.string(),
  is_verified: z.boolean(),
  otp: z.number().int().optional().nullable(),
  last_login: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserCreateOrConnectWithoutRequestsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutRequestsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutRequestsInputSchema),z.lazy(() => UserUncheckedCreateWithoutRequestsInputSchema) ]),
}).strict();

export const RequestLogCreateWithoutRequestInputSchema: z.ZodType<Prisma.RequestLogCreateWithoutRequestInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.number().int(),
  responseTimeMs: z.number().int(),
  responseSizeKB: z.number(),
  isError: z.boolean().optional(),
  responseBody: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  headers: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  insight: z.lazy(() => InsightCreateNestedOneWithoutRequestLogsInputSchema).optional()
}).strict();

export const RequestLogUncheckedCreateWithoutRequestInputSchema: z.ZodType<Prisma.RequestLogUncheckedCreateWithoutRequestInput> = z.object({
  id: z.string().cuid().optional(),
  insightId: z.string().optional().nullable(),
  status: z.number().int(),
  responseTimeMs: z.number().int(),
  responseSizeKB: z.number(),
  isError: z.boolean().optional(),
  responseBody: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  headers: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const RequestLogCreateOrConnectWithoutRequestInputSchema: z.ZodType<Prisma.RequestLogCreateOrConnectWithoutRequestInput> = z.object({
  where: z.lazy(() => RequestLogWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RequestLogCreateWithoutRequestInputSchema),z.lazy(() => RequestLogUncheckedCreateWithoutRequestInputSchema) ]),
}).strict();

export const RequestLogCreateManyRequestInputEnvelopeSchema: z.ZodType<Prisma.RequestLogCreateManyRequestInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => RequestLogCreateManyRequestInputSchema),z.lazy(() => RequestLogCreateManyRequestInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const InsightCreateWithoutRequestInputSchema: z.ZodType<Prisma.InsightCreateWithoutRequestInput> = z.object({
  id: z.string().cuid().optional(),
  avgResponseTime: z.number().int(),
  errorRate: z.number(),
  slowestResponse: z.number().int(),
  avgPayloadSizeKB: z.number(),
  statusCodeDistribution: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  mostCommonHeaders: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  recentOutputs: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  requestLogs: z.lazy(() => RequestLogCreateNestedManyWithoutInsightInputSchema).optional()
}).strict();

export const InsightUncheckedCreateWithoutRequestInputSchema: z.ZodType<Prisma.InsightUncheckedCreateWithoutRequestInput> = z.object({
  id: z.string().cuid().optional(),
  avgResponseTime: z.number().int(),
  errorRate: z.number(),
  slowestResponse: z.number().int(),
  avgPayloadSizeKB: z.number(),
  statusCodeDistribution: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  mostCommonHeaders: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  recentOutputs: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  requestLogs: z.lazy(() => RequestLogUncheckedCreateNestedManyWithoutInsightInputSchema).optional()
}).strict();

export const InsightCreateOrConnectWithoutRequestInputSchema: z.ZodType<Prisma.InsightCreateOrConnectWithoutRequestInput> = z.object({
  where: z.lazy(() => InsightWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => InsightCreateWithoutRequestInputSchema),z.lazy(() => InsightUncheckedCreateWithoutRequestInputSchema) ]),
}).strict();

export const InsightCreateManyRequestInputEnvelopeSchema: z.ZodType<Prisma.InsightCreateManyRequestInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => InsightCreateManyRequestInputSchema),z.lazy(() => InsightCreateManyRequestInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const AITipCreateWithoutRequestInputSchema: z.ZodType<Prisma.AITipCreateWithoutRequestInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string(),
  codeSnippet: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AITipUncheckedCreateWithoutRequestInputSchema: z.ZodType<Prisma.AITipUncheckedCreateWithoutRequestInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string(),
  codeSnippet: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AITipCreateOrConnectWithoutRequestInputSchema: z.ZodType<Prisma.AITipCreateOrConnectWithoutRequestInput> = z.object({
  where: z.lazy(() => AITipWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AITipCreateWithoutRequestInputSchema),z.lazy(() => AITipUncheckedCreateWithoutRequestInputSchema) ]),
}).strict();

export const AITipCreateManyRequestInputEnvelopeSchema: z.ZodType<Prisma.AITipCreateManyRequestInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AITipCreateManyRequestInputSchema),z.lazy(() => AITipCreateManyRequestInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutRequestsInputSchema: z.ZodType<Prisma.UserUpsertWithoutRequestsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutRequestsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutRequestsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutRequestsInputSchema),z.lazy(() => UserUncheckedCreateWithoutRequestsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutRequestsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutRequestsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutRequestsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutRequestsInputSchema) ]),
}).strict();

export const UserUpdateWithoutRequestsInputSchema: z.ZodType<Prisma.UserUpdateWithoutRequestsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  is_verified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  otp: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  last_login: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateWithoutRequestsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutRequestsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  is_verified: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  otp: z.union([ z.number().int(),z.lazy(() => NullableIntFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  last_login: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RequestLogUpsertWithWhereUniqueWithoutRequestInputSchema: z.ZodType<Prisma.RequestLogUpsertWithWhereUniqueWithoutRequestInput> = z.object({
  where: z.lazy(() => RequestLogWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => RequestLogUpdateWithoutRequestInputSchema),z.lazy(() => RequestLogUncheckedUpdateWithoutRequestInputSchema) ]),
  create: z.union([ z.lazy(() => RequestLogCreateWithoutRequestInputSchema),z.lazy(() => RequestLogUncheckedCreateWithoutRequestInputSchema) ]),
}).strict();

export const RequestLogUpdateWithWhereUniqueWithoutRequestInputSchema: z.ZodType<Prisma.RequestLogUpdateWithWhereUniqueWithoutRequestInput> = z.object({
  where: z.lazy(() => RequestLogWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => RequestLogUpdateWithoutRequestInputSchema),z.lazy(() => RequestLogUncheckedUpdateWithoutRequestInputSchema) ]),
}).strict();

export const RequestLogUpdateManyWithWhereWithoutRequestInputSchema: z.ZodType<Prisma.RequestLogUpdateManyWithWhereWithoutRequestInput> = z.object({
  where: z.lazy(() => RequestLogScalarWhereInputSchema),
  data: z.union([ z.lazy(() => RequestLogUpdateManyMutationInputSchema),z.lazy(() => RequestLogUncheckedUpdateManyWithoutRequestInputSchema) ]),
}).strict();

export const RequestLogScalarWhereInputSchema: z.ZodType<Prisma.RequestLogScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => RequestLogScalarWhereInputSchema),z.lazy(() => RequestLogScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => RequestLogScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => RequestLogScalarWhereInputSchema),z.lazy(() => RequestLogScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  requestId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  insightId: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  status: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  responseTimeMs: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  responseSizeKB: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  isError: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  responseBody: z.lazy(() => JsonNullableFilterSchema).optional(),
  headers: z.lazy(() => JsonNullableFilterSchema).optional(),
  ipAddress: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userAgent: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const InsightUpsertWithWhereUniqueWithoutRequestInputSchema: z.ZodType<Prisma.InsightUpsertWithWhereUniqueWithoutRequestInput> = z.object({
  where: z.lazy(() => InsightWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => InsightUpdateWithoutRequestInputSchema),z.lazy(() => InsightUncheckedUpdateWithoutRequestInputSchema) ]),
  create: z.union([ z.lazy(() => InsightCreateWithoutRequestInputSchema),z.lazy(() => InsightUncheckedCreateWithoutRequestInputSchema) ]),
}).strict();

export const InsightUpdateWithWhereUniqueWithoutRequestInputSchema: z.ZodType<Prisma.InsightUpdateWithWhereUniqueWithoutRequestInput> = z.object({
  where: z.lazy(() => InsightWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => InsightUpdateWithoutRequestInputSchema),z.lazy(() => InsightUncheckedUpdateWithoutRequestInputSchema) ]),
}).strict();

export const InsightUpdateManyWithWhereWithoutRequestInputSchema: z.ZodType<Prisma.InsightUpdateManyWithWhereWithoutRequestInput> = z.object({
  where: z.lazy(() => InsightScalarWhereInputSchema),
  data: z.union([ z.lazy(() => InsightUpdateManyMutationInputSchema),z.lazy(() => InsightUncheckedUpdateManyWithoutRequestInputSchema) ]),
}).strict();

export const InsightScalarWhereInputSchema: z.ZodType<Prisma.InsightScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => InsightScalarWhereInputSchema),z.lazy(() => InsightScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => InsightScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => InsightScalarWhereInputSchema),z.lazy(() => InsightScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  requestId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  avgResponseTime: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  errorRate: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  slowestResponse: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  avgPayloadSizeKB: z.union([ z.lazy(() => FloatFilterSchema),z.number() ]).optional(),
  statusCodeDistribution: z.lazy(() => JsonFilterSchema).optional(),
  mostCommonHeaders: z.lazy(() => JsonNullableFilterSchema).optional(),
  recentOutputs: z.lazy(() => JsonNullableFilterSchema).optional(),
  score: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const AITipUpsertWithWhereUniqueWithoutRequestInputSchema: z.ZodType<Prisma.AITipUpsertWithWhereUniqueWithoutRequestInput> = z.object({
  where: z.lazy(() => AITipWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AITipUpdateWithoutRequestInputSchema),z.lazy(() => AITipUncheckedUpdateWithoutRequestInputSchema) ]),
  create: z.union([ z.lazy(() => AITipCreateWithoutRequestInputSchema),z.lazy(() => AITipUncheckedCreateWithoutRequestInputSchema) ]),
}).strict();

export const AITipUpdateWithWhereUniqueWithoutRequestInputSchema: z.ZodType<Prisma.AITipUpdateWithWhereUniqueWithoutRequestInput> = z.object({
  where: z.lazy(() => AITipWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AITipUpdateWithoutRequestInputSchema),z.lazy(() => AITipUncheckedUpdateWithoutRequestInputSchema) ]),
}).strict();

export const AITipUpdateManyWithWhereWithoutRequestInputSchema: z.ZodType<Prisma.AITipUpdateManyWithWhereWithoutRequestInput> = z.object({
  where: z.lazy(() => AITipScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AITipUpdateManyMutationInputSchema),z.lazy(() => AITipUncheckedUpdateManyWithoutRequestInputSchema) ]),
}).strict();

export const AITipScalarWhereInputSchema: z.ZodType<Prisma.AITipScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AITipScalarWhereInputSchema),z.lazy(() => AITipScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AITipScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AITipScalarWhereInputSchema),z.lazy(() => AITipScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  requestId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  codeSnippet: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const RequestCreateWithoutRequestLogsInputSchema: z.ZodType<Prisma.RequestCreateWithoutRequestLogsInput> = z.object({
  id: z.string().cuid().optional(),
  method: z.string(),
  url: z.string(),
  summary: z.string(),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutRequestsInputSchema),
  insights: z.lazy(() => InsightCreateNestedManyWithoutRequestInputSchema).optional(),
  aiTips: z.lazy(() => AITipCreateNestedManyWithoutRequestInputSchema).optional()
}).strict();

export const RequestUncheckedCreateWithoutRequestLogsInputSchema: z.ZodType<Prisma.RequestUncheckedCreateWithoutRequestLogsInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  method: z.string(),
  url: z.string(),
  summary: z.string(),
  createdAt: z.coerce.date().optional(),
  insights: z.lazy(() => InsightUncheckedCreateNestedManyWithoutRequestInputSchema).optional(),
  aiTips: z.lazy(() => AITipUncheckedCreateNestedManyWithoutRequestInputSchema).optional()
}).strict();

export const RequestCreateOrConnectWithoutRequestLogsInputSchema: z.ZodType<Prisma.RequestCreateOrConnectWithoutRequestLogsInput> = z.object({
  where: z.lazy(() => RequestWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RequestCreateWithoutRequestLogsInputSchema),z.lazy(() => RequestUncheckedCreateWithoutRequestLogsInputSchema) ]),
}).strict();

export const InsightCreateWithoutRequestLogsInputSchema: z.ZodType<Prisma.InsightCreateWithoutRequestLogsInput> = z.object({
  id: z.string().cuid().optional(),
  avgResponseTime: z.number().int(),
  errorRate: z.number(),
  slowestResponse: z.number().int(),
  avgPayloadSizeKB: z.number(),
  statusCodeDistribution: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  mostCommonHeaders: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  recentOutputs: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  request: z.lazy(() => RequestCreateNestedOneWithoutInsightsInputSchema)
}).strict();

export const InsightUncheckedCreateWithoutRequestLogsInputSchema: z.ZodType<Prisma.InsightUncheckedCreateWithoutRequestLogsInput> = z.object({
  id: z.string().cuid().optional(),
  requestId: z.string(),
  avgResponseTime: z.number().int(),
  errorRate: z.number(),
  slowestResponse: z.number().int(),
  avgPayloadSizeKB: z.number(),
  statusCodeDistribution: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  mostCommonHeaders: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  recentOutputs: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const InsightCreateOrConnectWithoutRequestLogsInputSchema: z.ZodType<Prisma.InsightCreateOrConnectWithoutRequestLogsInput> = z.object({
  where: z.lazy(() => InsightWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => InsightCreateWithoutRequestLogsInputSchema),z.lazy(() => InsightUncheckedCreateWithoutRequestLogsInputSchema) ]),
}).strict();

export const RequestUpsertWithoutRequestLogsInputSchema: z.ZodType<Prisma.RequestUpsertWithoutRequestLogsInput> = z.object({
  update: z.union([ z.lazy(() => RequestUpdateWithoutRequestLogsInputSchema),z.lazy(() => RequestUncheckedUpdateWithoutRequestLogsInputSchema) ]),
  create: z.union([ z.lazy(() => RequestCreateWithoutRequestLogsInputSchema),z.lazy(() => RequestUncheckedCreateWithoutRequestLogsInputSchema) ]),
  where: z.lazy(() => RequestWhereInputSchema).optional()
}).strict();

export const RequestUpdateToOneWithWhereWithoutRequestLogsInputSchema: z.ZodType<Prisma.RequestUpdateToOneWithWhereWithoutRequestLogsInput> = z.object({
  where: z.lazy(() => RequestWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => RequestUpdateWithoutRequestLogsInputSchema),z.lazy(() => RequestUncheckedUpdateWithoutRequestLogsInputSchema) ]),
}).strict();

export const RequestUpdateWithoutRequestLogsInputSchema: z.ZodType<Prisma.RequestUpdateWithoutRequestLogsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutRequestsNestedInputSchema).optional(),
  insights: z.lazy(() => InsightUpdateManyWithoutRequestNestedInputSchema).optional(),
  aiTips: z.lazy(() => AITipUpdateManyWithoutRequestNestedInputSchema).optional()
}).strict();

export const RequestUncheckedUpdateWithoutRequestLogsInputSchema: z.ZodType<Prisma.RequestUncheckedUpdateWithoutRequestLogsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  insights: z.lazy(() => InsightUncheckedUpdateManyWithoutRequestNestedInputSchema).optional(),
  aiTips: z.lazy(() => AITipUncheckedUpdateManyWithoutRequestNestedInputSchema).optional()
}).strict();

export const InsightUpsertWithoutRequestLogsInputSchema: z.ZodType<Prisma.InsightUpsertWithoutRequestLogsInput> = z.object({
  update: z.union([ z.lazy(() => InsightUpdateWithoutRequestLogsInputSchema),z.lazy(() => InsightUncheckedUpdateWithoutRequestLogsInputSchema) ]),
  create: z.union([ z.lazy(() => InsightCreateWithoutRequestLogsInputSchema),z.lazy(() => InsightUncheckedCreateWithoutRequestLogsInputSchema) ]),
  where: z.lazy(() => InsightWhereInputSchema).optional()
}).strict();

export const InsightUpdateToOneWithWhereWithoutRequestLogsInputSchema: z.ZodType<Prisma.InsightUpdateToOneWithWhereWithoutRequestLogsInput> = z.object({
  where: z.lazy(() => InsightWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => InsightUpdateWithoutRequestLogsInputSchema),z.lazy(() => InsightUncheckedUpdateWithoutRequestLogsInputSchema) ]),
}).strict();

export const InsightUpdateWithoutRequestLogsInputSchema: z.ZodType<Prisma.InsightUpdateWithoutRequestLogsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avgResponseTime: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  errorRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  slowestResponse: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  avgPayloadSizeKB: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  statusCodeDistribution: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  mostCommonHeaders: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  recentOutputs: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  request: z.lazy(() => RequestUpdateOneRequiredWithoutInsightsNestedInputSchema).optional()
}).strict();

export const InsightUncheckedUpdateWithoutRequestLogsInputSchema: z.ZodType<Prisma.InsightUncheckedUpdateWithoutRequestLogsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  requestId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avgResponseTime: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  errorRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  slowestResponse: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  avgPayloadSizeKB: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  statusCodeDistribution: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  mostCommonHeaders: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  recentOutputs: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RequestCreateWithoutInsightsInputSchema: z.ZodType<Prisma.RequestCreateWithoutInsightsInput> = z.object({
  id: z.string().cuid().optional(),
  method: z.string(),
  url: z.string(),
  summary: z.string(),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutRequestsInputSchema),
  requestLogs: z.lazy(() => RequestLogCreateNestedManyWithoutRequestInputSchema).optional(),
  aiTips: z.lazy(() => AITipCreateNestedManyWithoutRequestInputSchema).optional()
}).strict();

export const RequestUncheckedCreateWithoutInsightsInputSchema: z.ZodType<Prisma.RequestUncheckedCreateWithoutInsightsInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  method: z.string(),
  url: z.string(),
  summary: z.string(),
  createdAt: z.coerce.date().optional(),
  requestLogs: z.lazy(() => RequestLogUncheckedCreateNestedManyWithoutRequestInputSchema).optional(),
  aiTips: z.lazy(() => AITipUncheckedCreateNestedManyWithoutRequestInputSchema).optional()
}).strict();

export const RequestCreateOrConnectWithoutInsightsInputSchema: z.ZodType<Prisma.RequestCreateOrConnectWithoutInsightsInput> = z.object({
  where: z.lazy(() => RequestWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RequestCreateWithoutInsightsInputSchema),z.lazy(() => RequestUncheckedCreateWithoutInsightsInputSchema) ]),
}).strict();

export const RequestLogCreateWithoutInsightInputSchema: z.ZodType<Prisma.RequestLogCreateWithoutInsightInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.number().int(),
  responseTimeMs: z.number().int(),
  responseSizeKB: z.number(),
  isError: z.boolean().optional(),
  responseBody: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  headers: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  request: z.lazy(() => RequestCreateNestedOneWithoutRequestLogsInputSchema)
}).strict();

export const RequestLogUncheckedCreateWithoutInsightInputSchema: z.ZodType<Prisma.RequestLogUncheckedCreateWithoutInsightInput> = z.object({
  id: z.string().cuid().optional(),
  requestId: z.string(),
  status: z.number().int(),
  responseTimeMs: z.number().int(),
  responseSizeKB: z.number(),
  isError: z.boolean().optional(),
  responseBody: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  headers: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const RequestLogCreateOrConnectWithoutInsightInputSchema: z.ZodType<Prisma.RequestLogCreateOrConnectWithoutInsightInput> = z.object({
  where: z.lazy(() => RequestLogWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RequestLogCreateWithoutInsightInputSchema),z.lazy(() => RequestLogUncheckedCreateWithoutInsightInputSchema) ]),
}).strict();

export const RequestLogCreateManyInsightInputEnvelopeSchema: z.ZodType<Prisma.RequestLogCreateManyInsightInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => RequestLogCreateManyInsightInputSchema),z.lazy(() => RequestLogCreateManyInsightInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const RequestUpsertWithoutInsightsInputSchema: z.ZodType<Prisma.RequestUpsertWithoutInsightsInput> = z.object({
  update: z.union([ z.lazy(() => RequestUpdateWithoutInsightsInputSchema),z.lazy(() => RequestUncheckedUpdateWithoutInsightsInputSchema) ]),
  create: z.union([ z.lazy(() => RequestCreateWithoutInsightsInputSchema),z.lazy(() => RequestUncheckedCreateWithoutInsightsInputSchema) ]),
  where: z.lazy(() => RequestWhereInputSchema).optional()
}).strict();

export const RequestUpdateToOneWithWhereWithoutInsightsInputSchema: z.ZodType<Prisma.RequestUpdateToOneWithWhereWithoutInsightsInput> = z.object({
  where: z.lazy(() => RequestWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => RequestUpdateWithoutInsightsInputSchema),z.lazy(() => RequestUncheckedUpdateWithoutInsightsInputSchema) ]),
}).strict();

export const RequestUpdateWithoutInsightsInputSchema: z.ZodType<Prisma.RequestUpdateWithoutInsightsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutRequestsNestedInputSchema).optional(),
  requestLogs: z.lazy(() => RequestLogUpdateManyWithoutRequestNestedInputSchema).optional(),
  aiTips: z.lazy(() => AITipUpdateManyWithoutRequestNestedInputSchema).optional()
}).strict();

export const RequestUncheckedUpdateWithoutInsightsInputSchema: z.ZodType<Prisma.RequestUncheckedUpdateWithoutInsightsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  requestLogs: z.lazy(() => RequestLogUncheckedUpdateManyWithoutRequestNestedInputSchema).optional(),
  aiTips: z.lazy(() => AITipUncheckedUpdateManyWithoutRequestNestedInputSchema).optional()
}).strict();

export const RequestLogUpsertWithWhereUniqueWithoutInsightInputSchema: z.ZodType<Prisma.RequestLogUpsertWithWhereUniqueWithoutInsightInput> = z.object({
  where: z.lazy(() => RequestLogWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => RequestLogUpdateWithoutInsightInputSchema),z.lazy(() => RequestLogUncheckedUpdateWithoutInsightInputSchema) ]),
  create: z.union([ z.lazy(() => RequestLogCreateWithoutInsightInputSchema),z.lazy(() => RequestLogUncheckedCreateWithoutInsightInputSchema) ]),
}).strict();

export const RequestLogUpdateWithWhereUniqueWithoutInsightInputSchema: z.ZodType<Prisma.RequestLogUpdateWithWhereUniqueWithoutInsightInput> = z.object({
  where: z.lazy(() => RequestLogWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => RequestLogUpdateWithoutInsightInputSchema),z.lazy(() => RequestLogUncheckedUpdateWithoutInsightInputSchema) ]),
}).strict();

export const RequestLogUpdateManyWithWhereWithoutInsightInputSchema: z.ZodType<Prisma.RequestLogUpdateManyWithWhereWithoutInsightInput> = z.object({
  where: z.lazy(() => RequestLogScalarWhereInputSchema),
  data: z.union([ z.lazy(() => RequestLogUpdateManyMutationInputSchema),z.lazy(() => RequestLogUncheckedUpdateManyWithoutInsightInputSchema) ]),
}).strict();

export const RequestCreateWithoutAiTipsInputSchema: z.ZodType<Prisma.RequestCreateWithoutAiTipsInput> = z.object({
  id: z.string().cuid().optional(),
  method: z.string(),
  url: z.string(),
  summary: z.string(),
  createdAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutRequestsInputSchema),
  requestLogs: z.lazy(() => RequestLogCreateNestedManyWithoutRequestInputSchema).optional(),
  insights: z.lazy(() => InsightCreateNestedManyWithoutRequestInputSchema).optional()
}).strict();

export const RequestUncheckedCreateWithoutAiTipsInputSchema: z.ZodType<Prisma.RequestUncheckedCreateWithoutAiTipsInput> = z.object({
  id: z.string().cuid().optional(),
  userId: z.string(),
  method: z.string(),
  url: z.string(),
  summary: z.string(),
  createdAt: z.coerce.date().optional(),
  requestLogs: z.lazy(() => RequestLogUncheckedCreateNestedManyWithoutRequestInputSchema).optional(),
  insights: z.lazy(() => InsightUncheckedCreateNestedManyWithoutRequestInputSchema).optional()
}).strict();

export const RequestCreateOrConnectWithoutAiTipsInputSchema: z.ZodType<Prisma.RequestCreateOrConnectWithoutAiTipsInput> = z.object({
  where: z.lazy(() => RequestWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => RequestCreateWithoutAiTipsInputSchema),z.lazy(() => RequestUncheckedCreateWithoutAiTipsInputSchema) ]),
}).strict();

export const RequestUpsertWithoutAiTipsInputSchema: z.ZodType<Prisma.RequestUpsertWithoutAiTipsInput> = z.object({
  update: z.union([ z.lazy(() => RequestUpdateWithoutAiTipsInputSchema),z.lazy(() => RequestUncheckedUpdateWithoutAiTipsInputSchema) ]),
  create: z.union([ z.lazy(() => RequestCreateWithoutAiTipsInputSchema),z.lazy(() => RequestUncheckedCreateWithoutAiTipsInputSchema) ]),
  where: z.lazy(() => RequestWhereInputSchema).optional()
}).strict();

export const RequestUpdateToOneWithWhereWithoutAiTipsInputSchema: z.ZodType<Prisma.RequestUpdateToOneWithWhereWithoutAiTipsInput> = z.object({
  where: z.lazy(() => RequestWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => RequestUpdateWithoutAiTipsInputSchema),z.lazy(() => RequestUncheckedUpdateWithoutAiTipsInputSchema) ]),
}).strict();

export const RequestUpdateWithoutAiTipsInputSchema: z.ZodType<Prisma.RequestUpdateWithoutAiTipsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutRequestsNestedInputSchema).optional(),
  requestLogs: z.lazy(() => RequestLogUpdateManyWithoutRequestNestedInputSchema).optional(),
  insights: z.lazy(() => InsightUpdateManyWithoutRequestNestedInputSchema).optional()
}).strict();

export const RequestUncheckedUpdateWithoutAiTipsInputSchema: z.ZodType<Prisma.RequestUncheckedUpdateWithoutAiTipsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  requestLogs: z.lazy(() => RequestLogUncheckedUpdateManyWithoutRequestNestedInputSchema).optional(),
  insights: z.lazy(() => InsightUncheckedUpdateManyWithoutRequestNestedInputSchema).optional()
}).strict();

export const RequestCreateManyUserInputSchema: z.ZodType<Prisma.RequestCreateManyUserInput> = z.object({
  id: z.string().cuid().optional(),
  method: z.string(),
  url: z.string(),
  summary: z.string(),
  createdAt: z.coerce.date().optional()
}).strict();

export const RequestUpdateWithoutUserInputSchema: z.ZodType<Prisma.RequestUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  requestLogs: z.lazy(() => RequestLogUpdateManyWithoutRequestNestedInputSchema).optional(),
  insights: z.lazy(() => InsightUpdateManyWithoutRequestNestedInputSchema).optional(),
  aiTips: z.lazy(() => AITipUpdateManyWithoutRequestNestedInputSchema).optional()
}).strict();

export const RequestUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.RequestUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  requestLogs: z.lazy(() => RequestLogUncheckedUpdateManyWithoutRequestNestedInputSchema).optional(),
  insights: z.lazy(() => InsightUncheckedUpdateManyWithoutRequestNestedInputSchema).optional(),
  aiTips: z.lazy(() => AITipUncheckedUpdateManyWithoutRequestNestedInputSchema).optional()
}).strict();

export const RequestUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.RequestUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  method: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  summary: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RequestLogCreateManyRequestInputSchema: z.ZodType<Prisma.RequestLogCreateManyRequestInput> = z.object({
  id: z.string().cuid().optional(),
  insightId: z.string().optional().nullable(),
  status: z.number().int(),
  responseTimeMs: z.number().int(),
  responseSizeKB: z.number(),
  isError: z.boolean().optional(),
  responseBody: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  headers: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const InsightCreateManyRequestInputSchema: z.ZodType<Prisma.InsightCreateManyRequestInput> = z.object({
  id: z.string().cuid().optional(),
  avgResponseTime: z.number().int(),
  errorRate: z.number(),
  slowestResponse: z.number().int(),
  avgPayloadSizeKB: z.number(),
  statusCodeDistribution: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  mostCommonHeaders: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  recentOutputs: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.number().int(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const AITipCreateManyRequestInputSchema: z.ZodType<Prisma.AITipCreateManyRequestInput> = z.object({
  id: z.string().cuid().optional(),
  title: z.string(),
  description: z.string(),
  codeSnippet: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const RequestLogUpdateWithoutRequestInputSchema: z.ZodType<Prisma.RequestLogUpdateWithoutRequestInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responseTimeMs: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responseSizeKB: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isError: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  responseBody: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  headers: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  insight: z.lazy(() => InsightUpdateOneWithoutRequestLogsNestedInputSchema).optional()
}).strict();

export const RequestLogUncheckedUpdateWithoutRequestInputSchema: z.ZodType<Prisma.RequestLogUncheckedUpdateWithoutRequestInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  insightId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responseTimeMs: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responseSizeKB: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isError: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  responseBody: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  headers: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RequestLogUncheckedUpdateManyWithoutRequestInputSchema: z.ZodType<Prisma.RequestLogUncheckedUpdateManyWithoutRequestInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  insightId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  status: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responseTimeMs: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responseSizeKB: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isError: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  responseBody: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  headers: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const InsightUpdateWithoutRequestInputSchema: z.ZodType<Prisma.InsightUpdateWithoutRequestInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avgResponseTime: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  errorRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  slowestResponse: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  avgPayloadSizeKB: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  statusCodeDistribution: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  mostCommonHeaders: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  recentOutputs: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  requestLogs: z.lazy(() => RequestLogUpdateManyWithoutInsightNestedInputSchema).optional()
}).strict();

export const InsightUncheckedUpdateWithoutRequestInputSchema: z.ZodType<Prisma.InsightUncheckedUpdateWithoutRequestInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avgResponseTime: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  errorRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  slowestResponse: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  avgPayloadSizeKB: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  statusCodeDistribution: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  mostCommonHeaders: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  recentOutputs: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  requestLogs: z.lazy(() => RequestLogUncheckedUpdateManyWithoutInsightNestedInputSchema).optional()
}).strict();

export const InsightUncheckedUpdateManyWithoutRequestInputSchema: z.ZodType<Prisma.InsightUncheckedUpdateManyWithoutRequestInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  avgResponseTime: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  errorRate: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  slowestResponse: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  avgPayloadSizeKB: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  statusCodeDistribution: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  mostCommonHeaders: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  recentOutputs: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  score: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AITipUpdateWithoutRequestInputSchema: z.ZodType<Prisma.AITipUpdateWithoutRequestInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  codeSnippet: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AITipUncheckedUpdateWithoutRequestInputSchema: z.ZodType<Prisma.AITipUncheckedUpdateWithoutRequestInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  codeSnippet: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AITipUncheckedUpdateManyWithoutRequestInputSchema: z.ZodType<Prisma.AITipUncheckedUpdateManyWithoutRequestInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  codeSnippet: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RequestLogCreateManyInsightInputSchema: z.ZodType<Prisma.RequestLogCreateManyInsightInput> = z.object({
  id: z.string().cuid().optional(),
  requestId: z.string(),
  status: z.number().int(),
  responseTimeMs: z.number().int(),
  responseSizeKB: z.number(),
  isError: z.boolean().optional(),
  responseBody: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  headers: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.string().optional().nullable(),
  userAgent: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional()
}).strict();

export const RequestLogUpdateWithoutInsightInputSchema: z.ZodType<Prisma.RequestLogUpdateWithoutInsightInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responseTimeMs: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responseSizeKB: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isError: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  responseBody: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  headers: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  request: z.lazy(() => RequestUpdateOneRequiredWithoutRequestLogsNestedInputSchema).optional()
}).strict();

export const RequestLogUncheckedUpdateWithoutInsightInputSchema: z.ZodType<Prisma.RequestLogUncheckedUpdateWithoutInsightInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  requestId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responseTimeMs: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responseSizeKB: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isError: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  responseBody: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  headers: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const RequestLogUncheckedUpdateManyWithoutInsightInputSchema: z.ZodType<Prisma.RequestLogUncheckedUpdateManyWithoutInsightInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  requestId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responseTimeMs: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  responseSizeKB: z.union([ z.number(),z.lazy(() => FloatFieldUpdateOperationsInputSchema) ]).optional(),
  isError: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  responseBody: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  headers: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  ipAddress: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userAgent: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const RequestFindFirstArgsSchema: z.ZodType<Prisma.RequestFindFirstArgs> = z.object({
  select: RequestSelectSchema.optional(),
  include: RequestIncludeSchema.optional(),
  where: RequestWhereInputSchema.optional(),
  orderBy: z.union([ RequestOrderByWithRelationInputSchema.array(),RequestOrderByWithRelationInputSchema ]).optional(),
  cursor: RequestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RequestScalarFieldEnumSchema,RequestScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RequestFindFirstOrThrowArgsSchema: z.ZodType<Prisma.RequestFindFirstOrThrowArgs> = z.object({
  select: RequestSelectSchema.optional(),
  include: RequestIncludeSchema.optional(),
  where: RequestWhereInputSchema.optional(),
  orderBy: z.union([ RequestOrderByWithRelationInputSchema.array(),RequestOrderByWithRelationInputSchema ]).optional(),
  cursor: RequestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RequestScalarFieldEnumSchema,RequestScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RequestFindManyArgsSchema: z.ZodType<Prisma.RequestFindManyArgs> = z.object({
  select: RequestSelectSchema.optional(),
  include: RequestIncludeSchema.optional(),
  where: RequestWhereInputSchema.optional(),
  orderBy: z.union([ RequestOrderByWithRelationInputSchema.array(),RequestOrderByWithRelationInputSchema ]).optional(),
  cursor: RequestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RequestScalarFieldEnumSchema,RequestScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RequestAggregateArgsSchema: z.ZodType<Prisma.RequestAggregateArgs> = z.object({
  where: RequestWhereInputSchema.optional(),
  orderBy: z.union([ RequestOrderByWithRelationInputSchema.array(),RequestOrderByWithRelationInputSchema ]).optional(),
  cursor: RequestWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RequestGroupByArgsSchema: z.ZodType<Prisma.RequestGroupByArgs> = z.object({
  where: RequestWhereInputSchema.optional(),
  orderBy: z.union([ RequestOrderByWithAggregationInputSchema.array(),RequestOrderByWithAggregationInputSchema ]).optional(),
  by: RequestScalarFieldEnumSchema.array(),
  having: RequestScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RequestFindUniqueArgsSchema: z.ZodType<Prisma.RequestFindUniqueArgs> = z.object({
  select: RequestSelectSchema.optional(),
  include: RequestIncludeSchema.optional(),
  where: RequestWhereUniqueInputSchema,
}).strict() ;

export const RequestFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.RequestFindUniqueOrThrowArgs> = z.object({
  select: RequestSelectSchema.optional(),
  include: RequestIncludeSchema.optional(),
  where: RequestWhereUniqueInputSchema,
}).strict() ;

export const RequestLogFindFirstArgsSchema: z.ZodType<Prisma.RequestLogFindFirstArgs> = z.object({
  select: RequestLogSelectSchema.optional(),
  include: RequestLogIncludeSchema.optional(),
  where: RequestLogWhereInputSchema.optional(),
  orderBy: z.union([ RequestLogOrderByWithRelationInputSchema.array(),RequestLogOrderByWithRelationInputSchema ]).optional(),
  cursor: RequestLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RequestLogScalarFieldEnumSchema,RequestLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RequestLogFindFirstOrThrowArgsSchema: z.ZodType<Prisma.RequestLogFindFirstOrThrowArgs> = z.object({
  select: RequestLogSelectSchema.optional(),
  include: RequestLogIncludeSchema.optional(),
  where: RequestLogWhereInputSchema.optional(),
  orderBy: z.union([ RequestLogOrderByWithRelationInputSchema.array(),RequestLogOrderByWithRelationInputSchema ]).optional(),
  cursor: RequestLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RequestLogScalarFieldEnumSchema,RequestLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RequestLogFindManyArgsSchema: z.ZodType<Prisma.RequestLogFindManyArgs> = z.object({
  select: RequestLogSelectSchema.optional(),
  include: RequestLogIncludeSchema.optional(),
  where: RequestLogWhereInputSchema.optional(),
  orderBy: z.union([ RequestLogOrderByWithRelationInputSchema.array(),RequestLogOrderByWithRelationInputSchema ]).optional(),
  cursor: RequestLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ RequestLogScalarFieldEnumSchema,RequestLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const RequestLogAggregateArgsSchema: z.ZodType<Prisma.RequestLogAggregateArgs> = z.object({
  where: RequestLogWhereInputSchema.optional(),
  orderBy: z.union([ RequestLogOrderByWithRelationInputSchema.array(),RequestLogOrderByWithRelationInputSchema ]).optional(),
  cursor: RequestLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RequestLogGroupByArgsSchema: z.ZodType<Prisma.RequestLogGroupByArgs> = z.object({
  where: RequestLogWhereInputSchema.optional(),
  orderBy: z.union([ RequestLogOrderByWithAggregationInputSchema.array(),RequestLogOrderByWithAggregationInputSchema ]).optional(),
  by: RequestLogScalarFieldEnumSchema.array(),
  having: RequestLogScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const RequestLogFindUniqueArgsSchema: z.ZodType<Prisma.RequestLogFindUniqueArgs> = z.object({
  select: RequestLogSelectSchema.optional(),
  include: RequestLogIncludeSchema.optional(),
  where: RequestLogWhereUniqueInputSchema,
}).strict() ;

export const RequestLogFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.RequestLogFindUniqueOrThrowArgs> = z.object({
  select: RequestLogSelectSchema.optional(),
  include: RequestLogIncludeSchema.optional(),
  where: RequestLogWhereUniqueInputSchema,
}).strict() ;

export const InsightFindFirstArgsSchema: z.ZodType<Prisma.InsightFindFirstArgs> = z.object({
  select: InsightSelectSchema.optional(),
  include: InsightIncludeSchema.optional(),
  where: InsightWhereInputSchema.optional(),
  orderBy: z.union([ InsightOrderByWithRelationInputSchema.array(),InsightOrderByWithRelationInputSchema ]).optional(),
  cursor: InsightWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InsightScalarFieldEnumSchema,InsightScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const InsightFindFirstOrThrowArgsSchema: z.ZodType<Prisma.InsightFindFirstOrThrowArgs> = z.object({
  select: InsightSelectSchema.optional(),
  include: InsightIncludeSchema.optional(),
  where: InsightWhereInputSchema.optional(),
  orderBy: z.union([ InsightOrderByWithRelationInputSchema.array(),InsightOrderByWithRelationInputSchema ]).optional(),
  cursor: InsightWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InsightScalarFieldEnumSchema,InsightScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const InsightFindManyArgsSchema: z.ZodType<Prisma.InsightFindManyArgs> = z.object({
  select: InsightSelectSchema.optional(),
  include: InsightIncludeSchema.optional(),
  where: InsightWhereInputSchema.optional(),
  orderBy: z.union([ InsightOrderByWithRelationInputSchema.array(),InsightOrderByWithRelationInputSchema ]).optional(),
  cursor: InsightWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ InsightScalarFieldEnumSchema,InsightScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const InsightAggregateArgsSchema: z.ZodType<Prisma.InsightAggregateArgs> = z.object({
  where: InsightWhereInputSchema.optional(),
  orderBy: z.union([ InsightOrderByWithRelationInputSchema.array(),InsightOrderByWithRelationInputSchema ]).optional(),
  cursor: InsightWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const InsightGroupByArgsSchema: z.ZodType<Prisma.InsightGroupByArgs> = z.object({
  where: InsightWhereInputSchema.optional(),
  orderBy: z.union([ InsightOrderByWithAggregationInputSchema.array(),InsightOrderByWithAggregationInputSchema ]).optional(),
  by: InsightScalarFieldEnumSchema.array(),
  having: InsightScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const InsightFindUniqueArgsSchema: z.ZodType<Prisma.InsightFindUniqueArgs> = z.object({
  select: InsightSelectSchema.optional(),
  include: InsightIncludeSchema.optional(),
  where: InsightWhereUniqueInputSchema,
}).strict() ;

export const InsightFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.InsightFindUniqueOrThrowArgs> = z.object({
  select: InsightSelectSchema.optional(),
  include: InsightIncludeSchema.optional(),
  where: InsightWhereUniqueInputSchema,
}).strict() ;

export const AITipFindFirstArgsSchema: z.ZodType<Prisma.AITipFindFirstArgs> = z.object({
  select: AITipSelectSchema.optional(),
  include: AITipIncludeSchema.optional(),
  where: AITipWhereInputSchema.optional(),
  orderBy: z.union([ AITipOrderByWithRelationInputSchema.array(),AITipOrderByWithRelationInputSchema ]).optional(),
  cursor: AITipWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AITipScalarFieldEnumSchema,AITipScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AITipFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AITipFindFirstOrThrowArgs> = z.object({
  select: AITipSelectSchema.optional(),
  include: AITipIncludeSchema.optional(),
  where: AITipWhereInputSchema.optional(),
  orderBy: z.union([ AITipOrderByWithRelationInputSchema.array(),AITipOrderByWithRelationInputSchema ]).optional(),
  cursor: AITipWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AITipScalarFieldEnumSchema,AITipScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AITipFindManyArgsSchema: z.ZodType<Prisma.AITipFindManyArgs> = z.object({
  select: AITipSelectSchema.optional(),
  include: AITipIncludeSchema.optional(),
  where: AITipWhereInputSchema.optional(),
  orderBy: z.union([ AITipOrderByWithRelationInputSchema.array(),AITipOrderByWithRelationInputSchema ]).optional(),
  cursor: AITipWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AITipScalarFieldEnumSchema,AITipScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AITipAggregateArgsSchema: z.ZodType<Prisma.AITipAggregateArgs> = z.object({
  where: AITipWhereInputSchema.optional(),
  orderBy: z.union([ AITipOrderByWithRelationInputSchema.array(),AITipOrderByWithRelationInputSchema ]).optional(),
  cursor: AITipWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AITipGroupByArgsSchema: z.ZodType<Prisma.AITipGroupByArgs> = z.object({
  where: AITipWhereInputSchema.optional(),
  orderBy: z.union([ AITipOrderByWithAggregationInputSchema.array(),AITipOrderByWithAggregationInputSchema ]).optional(),
  by: AITipScalarFieldEnumSchema.array(),
  having: AITipScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AITipFindUniqueArgsSchema: z.ZodType<Prisma.AITipFindUniqueArgs> = z.object({
  select: AITipSelectSchema.optional(),
  include: AITipIncludeSchema.optional(),
  where: AITipWhereUniqueInputSchema,
}).strict() ;

export const AITipFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AITipFindUniqueOrThrowArgs> = z.object({
  select: AITipSelectSchema.optional(),
  include: AITipIncludeSchema.optional(),
  where: AITipWhereUniqueInputSchema,
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const RequestCreateArgsSchema: z.ZodType<Prisma.RequestCreateArgs> = z.object({
  select: RequestSelectSchema.optional(),
  include: RequestIncludeSchema.optional(),
  data: z.union([ RequestCreateInputSchema,RequestUncheckedCreateInputSchema ]),
}).strict() ;

export const RequestUpsertArgsSchema: z.ZodType<Prisma.RequestUpsertArgs> = z.object({
  select: RequestSelectSchema.optional(),
  include: RequestIncludeSchema.optional(),
  where: RequestWhereUniqueInputSchema,
  create: z.union([ RequestCreateInputSchema,RequestUncheckedCreateInputSchema ]),
  update: z.union([ RequestUpdateInputSchema,RequestUncheckedUpdateInputSchema ]),
}).strict() ;

export const RequestCreateManyArgsSchema: z.ZodType<Prisma.RequestCreateManyArgs> = z.object({
  data: z.union([ RequestCreateManyInputSchema,RequestCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RequestCreateManyAndReturnArgsSchema: z.ZodType<Prisma.RequestCreateManyAndReturnArgs> = z.object({
  data: z.union([ RequestCreateManyInputSchema,RequestCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RequestDeleteArgsSchema: z.ZodType<Prisma.RequestDeleteArgs> = z.object({
  select: RequestSelectSchema.optional(),
  include: RequestIncludeSchema.optional(),
  where: RequestWhereUniqueInputSchema,
}).strict() ;

export const RequestUpdateArgsSchema: z.ZodType<Prisma.RequestUpdateArgs> = z.object({
  select: RequestSelectSchema.optional(),
  include: RequestIncludeSchema.optional(),
  data: z.union([ RequestUpdateInputSchema,RequestUncheckedUpdateInputSchema ]),
  where: RequestWhereUniqueInputSchema,
}).strict() ;

export const RequestUpdateManyArgsSchema: z.ZodType<Prisma.RequestUpdateManyArgs> = z.object({
  data: z.union([ RequestUpdateManyMutationInputSchema,RequestUncheckedUpdateManyInputSchema ]),
  where: RequestWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const RequestUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.RequestUpdateManyAndReturnArgs> = z.object({
  data: z.union([ RequestUpdateManyMutationInputSchema,RequestUncheckedUpdateManyInputSchema ]),
  where: RequestWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const RequestDeleteManyArgsSchema: z.ZodType<Prisma.RequestDeleteManyArgs> = z.object({
  where: RequestWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const RequestLogCreateArgsSchema: z.ZodType<Prisma.RequestLogCreateArgs> = z.object({
  select: RequestLogSelectSchema.optional(),
  include: RequestLogIncludeSchema.optional(),
  data: z.union([ RequestLogCreateInputSchema,RequestLogUncheckedCreateInputSchema ]),
}).strict() ;

export const RequestLogUpsertArgsSchema: z.ZodType<Prisma.RequestLogUpsertArgs> = z.object({
  select: RequestLogSelectSchema.optional(),
  include: RequestLogIncludeSchema.optional(),
  where: RequestLogWhereUniqueInputSchema,
  create: z.union([ RequestLogCreateInputSchema,RequestLogUncheckedCreateInputSchema ]),
  update: z.union([ RequestLogUpdateInputSchema,RequestLogUncheckedUpdateInputSchema ]),
}).strict() ;

export const RequestLogCreateManyArgsSchema: z.ZodType<Prisma.RequestLogCreateManyArgs> = z.object({
  data: z.union([ RequestLogCreateManyInputSchema,RequestLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RequestLogCreateManyAndReturnArgsSchema: z.ZodType<Prisma.RequestLogCreateManyAndReturnArgs> = z.object({
  data: z.union([ RequestLogCreateManyInputSchema,RequestLogCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const RequestLogDeleteArgsSchema: z.ZodType<Prisma.RequestLogDeleteArgs> = z.object({
  select: RequestLogSelectSchema.optional(),
  include: RequestLogIncludeSchema.optional(),
  where: RequestLogWhereUniqueInputSchema,
}).strict() ;

export const RequestLogUpdateArgsSchema: z.ZodType<Prisma.RequestLogUpdateArgs> = z.object({
  select: RequestLogSelectSchema.optional(),
  include: RequestLogIncludeSchema.optional(),
  data: z.union([ RequestLogUpdateInputSchema,RequestLogUncheckedUpdateInputSchema ]),
  where: RequestLogWhereUniqueInputSchema,
}).strict() ;

export const RequestLogUpdateManyArgsSchema: z.ZodType<Prisma.RequestLogUpdateManyArgs> = z.object({
  data: z.union([ RequestLogUpdateManyMutationInputSchema,RequestLogUncheckedUpdateManyInputSchema ]),
  where: RequestLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const RequestLogUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.RequestLogUpdateManyAndReturnArgs> = z.object({
  data: z.union([ RequestLogUpdateManyMutationInputSchema,RequestLogUncheckedUpdateManyInputSchema ]),
  where: RequestLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const RequestLogDeleteManyArgsSchema: z.ZodType<Prisma.RequestLogDeleteManyArgs> = z.object({
  where: RequestLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const InsightCreateArgsSchema: z.ZodType<Prisma.InsightCreateArgs> = z.object({
  select: InsightSelectSchema.optional(),
  include: InsightIncludeSchema.optional(),
  data: z.union([ InsightCreateInputSchema,InsightUncheckedCreateInputSchema ]),
}).strict() ;

export const InsightUpsertArgsSchema: z.ZodType<Prisma.InsightUpsertArgs> = z.object({
  select: InsightSelectSchema.optional(),
  include: InsightIncludeSchema.optional(),
  where: InsightWhereUniqueInputSchema,
  create: z.union([ InsightCreateInputSchema,InsightUncheckedCreateInputSchema ]),
  update: z.union([ InsightUpdateInputSchema,InsightUncheckedUpdateInputSchema ]),
}).strict() ;

export const InsightCreateManyArgsSchema: z.ZodType<Prisma.InsightCreateManyArgs> = z.object({
  data: z.union([ InsightCreateManyInputSchema,InsightCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const InsightCreateManyAndReturnArgsSchema: z.ZodType<Prisma.InsightCreateManyAndReturnArgs> = z.object({
  data: z.union([ InsightCreateManyInputSchema,InsightCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const InsightDeleteArgsSchema: z.ZodType<Prisma.InsightDeleteArgs> = z.object({
  select: InsightSelectSchema.optional(),
  include: InsightIncludeSchema.optional(),
  where: InsightWhereUniqueInputSchema,
}).strict() ;

export const InsightUpdateArgsSchema: z.ZodType<Prisma.InsightUpdateArgs> = z.object({
  select: InsightSelectSchema.optional(),
  include: InsightIncludeSchema.optional(),
  data: z.union([ InsightUpdateInputSchema,InsightUncheckedUpdateInputSchema ]),
  where: InsightWhereUniqueInputSchema,
}).strict() ;

export const InsightUpdateManyArgsSchema: z.ZodType<Prisma.InsightUpdateManyArgs> = z.object({
  data: z.union([ InsightUpdateManyMutationInputSchema,InsightUncheckedUpdateManyInputSchema ]),
  where: InsightWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const InsightUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.InsightUpdateManyAndReturnArgs> = z.object({
  data: z.union([ InsightUpdateManyMutationInputSchema,InsightUncheckedUpdateManyInputSchema ]),
  where: InsightWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const InsightDeleteManyArgsSchema: z.ZodType<Prisma.InsightDeleteManyArgs> = z.object({
  where: InsightWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AITipCreateArgsSchema: z.ZodType<Prisma.AITipCreateArgs> = z.object({
  select: AITipSelectSchema.optional(),
  include: AITipIncludeSchema.optional(),
  data: z.union([ AITipCreateInputSchema,AITipUncheckedCreateInputSchema ]),
}).strict() ;

export const AITipUpsertArgsSchema: z.ZodType<Prisma.AITipUpsertArgs> = z.object({
  select: AITipSelectSchema.optional(),
  include: AITipIncludeSchema.optional(),
  where: AITipWhereUniqueInputSchema,
  create: z.union([ AITipCreateInputSchema,AITipUncheckedCreateInputSchema ]),
  update: z.union([ AITipUpdateInputSchema,AITipUncheckedUpdateInputSchema ]),
}).strict() ;

export const AITipCreateManyArgsSchema: z.ZodType<Prisma.AITipCreateManyArgs> = z.object({
  data: z.union([ AITipCreateManyInputSchema,AITipCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AITipCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AITipCreateManyAndReturnArgs> = z.object({
  data: z.union([ AITipCreateManyInputSchema,AITipCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AITipDeleteArgsSchema: z.ZodType<Prisma.AITipDeleteArgs> = z.object({
  select: AITipSelectSchema.optional(),
  include: AITipIncludeSchema.optional(),
  where: AITipWhereUniqueInputSchema,
}).strict() ;

export const AITipUpdateArgsSchema: z.ZodType<Prisma.AITipUpdateArgs> = z.object({
  select: AITipSelectSchema.optional(),
  include: AITipIncludeSchema.optional(),
  data: z.union([ AITipUpdateInputSchema,AITipUncheckedUpdateInputSchema ]),
  where: AITipWhereUniqueInputSchema,
}).strict() ;

export const AITipUpdateManyArgsSchema: z.ZodType<Prisma.AITipUpdateManyArgs> = z.object({
  data: z.union([ AITipUpdateManyMutationInputSchema,AITipUncheckedUpdateManyInputSchema ]),
  where: AITipWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AITipUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.AITipUpdateManyAndReturnArgs> = z.object({
  data: z.union([ AITipUpdateManyMutationInputSchema,AITipUncheckedUpdateManyInputSchema ]),
  where: AITipWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AITipDeleteManyArgsSchema: z.ZodType<Prisma.AITipDeleteManyArgs> = z.object({
  where: AITipWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;