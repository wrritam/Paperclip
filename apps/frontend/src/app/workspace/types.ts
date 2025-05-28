export enum HttpMethod {
   GET = 'GET',
   POST = 'POST',
   PUT = 'PUT',
   DELETE = 'DELETE',
   PATCH = 'PATCH',
   HEAD = 'HEAD',
}


export interface ApiMeta {
   method: string;
   url: string;
   ip: string;
   userAgent: string;
   timestamp: string;
 }

 export interface ApiInsight {
   id: string;
   requestId: string;
   avgResponseTime: number;
   errorRate: number;
   slowestResponse: number;
   avgPayloadSizeKB: number;
   statusCodeDistribution: Record<string, number>;
   mostCommonHeaders: Record<string, string> | null;
   recentOutputs: Record<string, unknown> | null;
   score: number;
   createdAt: Date;
   updatedAt: Date;
 }

 export interface AiTip {
   title: string;
   description: string;
   codeSnippet?: string;
 }

 export interface AiAnalysis {
   summary: string;
   aiTips: AiTip[];
 }

 // Generic API Response type - T represents the actual API data which can be anything
 export interface ApiResponse<T = any> {
   success: boolean;
   data?: T;
   error?: string;
   meta?: ApiMeta;
   insight?: ApiInsight | null;
   aiAnalysis?: AiAnalysis | null;
 }

 // Error response type for failed requests
 export interface ApiErrorResponse {
   success: false;
   error: string;
   meta?: Partial<ApiMeta>;
   insight?: null;
   aiAnalysis?: null;
 }

 // Success response type for successful requests
 export interface ApiSuccessResponse<T = any> {
   success: true;
   data: T;
   meta: ApiMeta;
   insight: ApiInsight | null;
   aiAnalysis: AiAnalysis | null;
 }

 // Union type for all possible responses
 export type ApiResult<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;
