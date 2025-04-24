type Insights = {
  avgResponseTime: number;
  slowestResponse: number;
  errorRate: number;
  avgPayloadSizeKB: number;
  statusCodeDistribution: Record<string, number>;
};

export function paperclipAPIscore(insights: Insights): number {
  const {
    avgResponseTime,
    slowestResponse,
    errorRate,
    avgPayloadSizeKB,
    statusCodeDistribution,
  } = insights;

  const totalNumberOFCode = Object.values(statusCodeDistribution).reduce(
    (a, b) => a + b,
    0
  );

  const successNumber = statusCodeDistribution["200"] || 0;

  // scores by different areas (out of 100)

  const responseScore =
    avgResponseTime < 1000 ? 30 : avgResponseTime < 2000 ? 20 : 10;
  const slowestScore =
    slowestResponse < 2000 ? 20 : slowestResponse < 3000 ? 10 : 5;
  const reliabilityScore = (1 - errorRate) * 25;
  const successRateScore = (successNumber / (totalNumberOFCode || 1)) * 15;
  const payloadScore =
    avgPayloadSizeKB < 50 ? 10 : avgPayloadSizeKB < 100 ? 5 : 2;

  const finalScore = Math.round(
    responseScore +
      slowestScore +
      reliabilityScore +
      successRateScore +
      payloadScore
  );

  return Math.max(0, Math.min(100, finalScore));
}
