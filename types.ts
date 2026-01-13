
export interface Meaning {
  meaning: string;
  context: string;
  explanation: string;
}

export interface GrammarVariation {
  form: string;
  explanation: string;
  exampleVariation: string;
  usageRule: string;
}

export interface ConjugationRow {
  formName: string;
  japanese: string;
  romaji: string;
  meaningInBengali: string;
}

export interface ExampleSentence {
  japanese: string;
  romaji: string;
  bengali: string;
  explanation: string;
}

export interface HomonymInfo {
  kanji: string;
  meaning: string;
  differenceExplanation: string;
}

export interface WordAnalysis {
  word: string;
  reading: string;
  wordType: string;
  meanings: Meaning[];
  grammarBreakdown: GrammarVariation[];
  conjugationTable: ConjugationRow[];
  homonyms: HomonymInfo[];
  examples: ExampleSentence[];
  additionalNotes: {
    politeness: string;
    mistakes: string;
    spokenShortcuts: string;
    cultural: string;
  };
}

export interface EvaluationResult {
  isCorrect: boolean;
  statusMessage: string;
  detailedExplanation: string;
  naturalJapanese: string;
  romaji: string;
  bengaliMeaning: string;
  corrections: {
    casual: string;
    polite: string;
    explanation: string;
  };
  commonMistakesInThisContext?: string;
}

export interface GrammarQnAResult {
  topic: string;
  explanation: string;
  rules: string[];
  conversation: {
    speaker: string;
    text: string;
    romaji: string;
    translation: string;
  }[];
  examples: ExampleSentence[];
}

export interface SearchHistory {
  word: string;
  timestamp: number;
}
