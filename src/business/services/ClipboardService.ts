export class ClipboardService {
  static isSupported(): boolean {
    return typeof navigator !== 'undefined' && 'clipboard' in navigator;
  }

  static async copyToClipboard(text: string): Promise<boolean> {
    if (!text || text.trim().length === 0) {
      console.warn('ClipboardService: No text to copy');
      return false;
    }

    // Intentar primero con el método de fallback (más compatible)
    if (this.fallbackCopy(text)) {
      console.log('ClipboardService: Copied using fallback method');
      return true;
    }

    // Si fallback falla, intentar con clipboard API
    if (this.isSupported()) {
      try {
        await navigator.clipboard.writeText(text);
        console.log('ClipboardService: Copied using clipboard API');
        return true;
      } catch (error) {
        console.error('ClipboardService: Clipboard API failed:', error);
        return false;
      }
    }

    console.error('ClipboardService: No clipboard method available');
    return false;
  }

  private static fallbackCopy(text: string): boolean {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (!successful) {
        console.warn('ClipboardService: execCommand copy returned false');
      }

      return successful;
    } catch (error) {
      console.error('ClipboardService: Fallback copy failed:', error);
      return false;
    }
  }
}
