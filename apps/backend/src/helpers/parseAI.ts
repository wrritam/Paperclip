export function parseToAITips(text: string) {
  const tips: {
    title: string;
    description: string;
    codeSnippet?: string;
  }[] = [];

  const matches = text.split("---").filter(Boolean);

  for (const block of matches) {
    const titleMatch = block.match(/Title:\s*(.*)/);
    const descriptionMatch = block.match(
      /Description:\s*([\s\S]*?)(CodeSnippet:|$)/
    );
    const codeMatch = block.match(/CodeSnippet:\s*([\s\S]*)/);

    if (titleMatch && descriptionMatch) {
      tips.push({
        title: titleMatch[1].trim(),
        description: descriptionMatch[1].trim(),
        codeSnippet: codeMatch ? codeMatch[1].trim() : undefined,
      });
    }
  }

  return tips;
}
