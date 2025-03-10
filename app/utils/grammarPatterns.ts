interface GrammarPattern {
  pattern: RegExp;
  name: string;
  explanation: string;
  example?: string;
}

const grammarPatterns: GrammarPattern[] = [
  {
    pattern: /([てで])(います|いる|いました|いた)$/,
    name: "て/で form + いる",
    explanation: "Indicates an ongoing action or state",
    example: "食べています (eating) / 歩いています (walking)"
  },
  {
    pattern: /になりました?$/,
    name: "になる",
    explanation: "Indicates becoming or changing into a state",
    example: "医者になりました (became a doctor)"
  },
  {
    pattern: /ようになりました?$/,
    name: "ようになる",
    explanation: "Indicates a change in ability or a new habit",
    example: "日本語が話せるようになりました (became able to speak Japanese)"
  },
  {
    pattern: /ことができ(る|ます|ました)$/,
    name: "ことができる",
    explanation: "Indicates ability or potential to do something",
    example: "泳ぐことができます (can swim)"
  },
  {
    pattern: /てみ(る|ます|ました)$/,
    name: "てみる",
    explanation: "Indicates trying to do something",
    example: "食べてみました (tried eating)"
  },
  {
    pattern: /なければなりません?$/,
    name: "なければならない",
    explanation: "Indicates obligation or necessity",
    example: "勉強しなければなりません (must study)"
  },
  {
    pattern: /かもしれません?$/,
    name: "かもしれない",
    explanation: "Indicates possibility or uncertainty",
    example: "雨が降るかもしれません (it might rain)"
  },
  {
    pattern: /と思います?$/,
    name: "と思う",
    explanation: "Indicates thoughts or opinions",
    example: "おいしいと思います (I think it's delicious)"
  },
  {
    pattern: /たいと思います?$/,
    name: "たいと思う",
    explanation: "Indicates desire or want to do something",
    example: "行きたいと思います (I want to go)"
  },
  {
    pattern: /てしまいました?$/,
    name: "てしまう",
    explanation: "Indicates completion, regret, or doing something accidentally",
    example: "忘れてしまいました (completely forgot / unfortunately forgot)"
  }
];

export function detectGrammarPatterns(text: string): { name: string; explanation: string; example?: string }[] {
  const patterns: { name: string; explanation: string; example?: string }[] = [];
  
  for (const pattern of grammarPatterns) {
    if (pattern.pattern.test(text)) {
      patterns.push({
        name: pattern.name,
        explanation: pattern.explanation,
        example: pattern.example
      });
    }
  }

  return patterns;
}

export function generateGrammarNote(patterns: { name: string; explanation: string; example?: string }[]): string {
  if (patterns.length === 0) {
    return '';
  }

  if (patterns.length === 1) {
    const pattern = patterns[0];
    return `Grammar Point: ${pattern.name}\n${pattern.explanation}${pattern.example ? `\nExample: ${pattern.example}` : ''}`;
  }

  return patterns
    .map((pattern, index) => {
      return `Grammar Point ${index + 1}: ${pattern.name}\n${pattern.explanation}${pattern.example ? `\nExample: ${pattern.example}` : ''}`;
    })
    .join('\n\n');
} 