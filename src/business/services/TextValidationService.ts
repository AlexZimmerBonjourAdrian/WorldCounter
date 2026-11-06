import { LoggerService } from './LoggerService';

// Umbral mínimo de caracteres para considerar que un texto tiene contenido útil.
export const MIN_TEXT_LENGTH = 10;

export class TextValidationService {
  static textLength(text: string | undefined | null): number {
    return (text ?? '').trim().length;
  }

  static hasMinimumText(text: string | undefined | null, minChars: number = MIN_TEXT_LENGTH): boolean {
    const len = this.textLength(text);
    const ok = len >= minChars;
    if (!ok) {
      LoggerService.warn('Validation', `texto insuficiente (${len} chars, mínimo ${minChars})`);
    }
    return ok;
  }

  static isEmpty(text: string | undefined | null): boolean {
    return this.textLength(text) === 0;
  }
}
