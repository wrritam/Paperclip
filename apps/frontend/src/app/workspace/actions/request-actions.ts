"use server";

import { HttpMethod } from "@/app/workspace/types";
import { cookies } from 'next/headers';

interface RequestParams {
  method: HttpMethod;
  url: string;
  queryParams: Array<{ id: string; key: string; value: string }>;
  headers: Array<{ id: string; key: string; value: string }>;
  body: string;
}

interface AiTip {
  title: string;
  description: string;
  codeSnippet?: string;
}

interface AiAnalysis {
  summary: string;
  aiTips: AiTip[];
}

interface RunRequestResponse<T = Record<string, unknown>> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    method: string;
    url: string;
    ip: string;
    userAgent: string;
    timestamp: string;
  };
  insight?: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    requestId: string;
    avgResponseTime: number;
    errorRate: number;
    slowestResponse: number;
    avgPayloadSizeKB: number;
    statusCodeDistribution: Record<string, number>;
    mostCommonHeaders: Record<string, string> | null;
    recentOutputs: Record<string, unknown> | null;
    score: number;
  } | null;
  aiAnalysis?: AiAnalysis;
}

export async function RunRequest(params: RequestParams): Promise<RunRequestResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('paperclip_login')?.value;

    if (!token) {
      return {
        success: false,
        error: 'Authentication token not found. Please log in again.'
      };
    }

    const urlWithParams = new URL(params.url);
    params.queryParams.forEach(param => {
      if (param.key && param.value) {
        urlWithParams.searchParams.append(param.key, param.value);
      }
    });

    const headersObj: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };

    params.headers.forEach(header => {
      if (header.key && header.value) {
        headersObj[header.key] = header.value;
      }
    });

    const requestBody = {
      method: params.method,
      url: urlWithParams.toString(),
      headers: headersObj,
      body: params.method !== HttpMethod.GET && params.method !== HttpMethod.HEAD ?
        (params.body ? JSON.parse(params.body) : undefined) : undefined // Use undefined for no body
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/user/run-request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      return {
        success: false,
        error: errorData?.message || `HTTP error! status: ${response.status}`
      };
    }

    const data = await response.json();

    const aiAnalysisData: AiAnalysis = {
        summary: data.aiAnalysis?.summary || "No summary available.",
        aiTips: Array.isArray(data.aiAnalysis?.aiTips) ? data.aiAnalysis.aiTips : [],
    };

    return {
      success: true,
      data: data.body,
      meta: data.meta,
      insight: data.insight,
      aiAnalysis: aiAnalysisData,
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred during API request'
    };
  }
}
