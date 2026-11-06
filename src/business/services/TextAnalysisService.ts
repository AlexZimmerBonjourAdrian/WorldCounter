import { CounterStats } from '@/data/CounterData';

export class TextAnalysisService {
  static analyzeText(text: string): CounterStats {
    const wordCount = this.countWords(text);
    const charCount = text.length;
    const charCountNoSpaces = text.replace(/\s/g, '').length;

    return {
      wordCount,
      charCount,
      charCountNoSpaces,
    };
  }

  private static countWords(text: string): number {
    if (!text || text.trim().length === 0) {
      return 0;
    }
    // Dividir por espacios, saltos de línea y otros caracteres de espacio
    const words = text.trim().split(/\s+/);
    // Filtrar strings vacíos
    return words.filter(word => word.length > 0).length;
  }

  static isWithinLimit(text: string, maxChars: number): boolean {
    return text.length <= maxChars;
  }

  static getRemainingChars(text: string, maxChars: number): number {
    return Math.max(0, maxChars - text.length);
  }

  static getPercentageUsed(text: string, maxChars: number): number {
    if (maxChars === 0) return 0;
    return Math.min(100, (text.length / maxChars) * 100);
  }
}
