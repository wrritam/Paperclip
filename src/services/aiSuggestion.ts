import { GoogleGenerativeAI } from "@google/generative-ai";
import { parseToAITips } from "../helpers/parseAI";

if (!process.env.GEMINI_API_KEY) {
  throw new Error(
    "GEMINI_API_KEY is not defined in the environment variables."
  );
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function generateAISuggestionsForAPI(
  method: string,
  url: string,
  insight: {
    avgResponseTime: number;
    errorRate: number;
    slowestResponse: number;
    avgPayloadSizeKB: number;
    statusCodeDistribution: Record<string, number>;
  }
) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  const basePrompt = `
You're an API performance and security expert. Based on the following API request data and metrics, provide suggestions in this format:

---
Title: [Short Suggestion Title]
Description: [Brief explanation of the suggestion, 2-4 lines]
CodeSnippet: [Optional code snippet if applicable]
---

API METHOD: ${method}
URL: ${url}
Average Response Time: ${insight.avgResponseTime} ms
Slowest Response: ${insight.slowestResponse} ms
Error Rate: ${insight.errorRate}
Payload Size (avg): ${insight.avgPayloadSizeKB} KB
Status Codes: ${JSON.stringify(insight.statusCodeDistribution)}

Give 3–5 suggestions for improvement (optimizations, security tips, etc.).
`;

  const summaryPrompt = `
You're an API analyst. Based on the following performance metrics, write a **single-sentence summary** that describes the overall health of this API in a clear and helpful tone.

API METHOD: ${method}
URL: ${url}
Average Response Time: ${insight.avgResponseTime} ms
Slowest Response: ${insight.slowestResponse} ms
Error Rate: ${insight.errorRate}
Payload Size (avg): ${insight.avgPayloadSizeKB} KB
Status Codes: ${JSON.stringify(insight.statusCodeDistribution)}
`;

  // Generate suggestions and summary
  const [suggestionsResult, summaryResult] = await Promise.all([
    model.generateContent(basePrompt),
    model.generateContent(summaryPrompt),
  ]);

  const suggestionsText = (await suggestionsResult.response).text();
  const summaryText = (await summaryResult.response).text();
  const tips = parseToAITips(suggestionsText);

  return {
    tips,
    summary: summaryText.trim(),
  };
}
