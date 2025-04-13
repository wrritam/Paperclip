type input = {
  avgResponseTime: number;
  errorRate: number;
  slowestResponse: number;
};

export function generateMockSuggestion(insight: input): string[] {
  const suggestips: string[] = [];

  if (insight.errorRate > 0.2) {
    suggestips.push("Error rate is high. please look into the failed request.");
  }

  if (insight.avgResponseTime > 1000) {
    suggestips.push(
      "Very slow response. Use caching the response to get good speed"
    );
  }

  if (insight.slowestResponse > 3000) {
    suggestips.push(
      "Slowest response exceeds 3 seconds. Optimize backend and DB queries"
    );
  }

  return suggestips;
}
