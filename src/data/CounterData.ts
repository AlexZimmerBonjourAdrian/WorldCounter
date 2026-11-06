// Capa de Data Types - Modelos para el contador de palabras

export interface CounterStats {
  wordCount: number;
  charCount: number;
  charCountNoSpaces: number;
}

export interface SocialTemplate {
  id: string;
  name: string;
  platform: string;
  maxChars: number;
  icon?: string;
}

export interface CounterText {
  text: string;
  title?: string;
  template?: string;
  savedAt?: number;
}

export interface StoredCounterText {
  id?: number;
  text: string;
  title?: string;
  template?: string;
  timestamp: number;
}
