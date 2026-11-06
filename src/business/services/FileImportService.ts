import { LoggerService } from './LoggerService';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const SUPPORTED_EXTENSIONS = [
  '.txt', '.md', '.markdown', '.csv', '.tsv', '.json', '.log',
  '.html', '.htm', '.xml', '.css', '.js', '.ts', '.rtf',
  '.pdf', '.docx',
];

export class FileImportService {
  static getSupportedExtensions(): string[] {
    return [...SUPPORTED_EXTENSIONS];
  }

  static isSupported(file: File): boolean {
    const name = (file?.name || '').toLowerCase();
    return SUPPORTED_EXTENSIONS.some((ext) => name.endsWith(ext));
  }

  static async extractText(file: File): Promise<string> {
    if (!file) throw new Error('No se proporcionó ningún archivo');

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('El archivo es demasiado grande (máximo 10 MB)');
    }

    if (!this.isSupported(file)) {
      throw new Error('Formato de archivo no soportado');
    }

    const name = (file.name || '').toLowerCase();

    try {
      if (name.endsWith('.pdf')) {
        return await this.extractPdf(file);
      }
      if (name.endsWith('.docx')) {
        return await this.extractDocx(file);
      }
      if (name.endsWith('.html') || name.endsWith('.htm') || name.endsWith('.xml')) {
        return await this.extractHtml(file);
      }
      if (name.endsWith('.rtf')) {
        return await this.extractRtf(file);
      }
      return await this.readPlainText(file);
    } catch (error) {
      LoggerService.error('FileImport', 'Error extrayendo texto:', error);
      throw error instanceof Error ? error : new Error('Error al leer el archivo');
    }
  }

  // Aliases for compatibility with different naming conventions
  static async loadText(file: File): Promise<string> {
    return this.extractText(file);
  }

  static async readFile(file: File): Promise<string> {
    return this.extractText(file);
  }

  static async importFile(file: File): Promise<string> {
    return this.extractText(file);
  }

  static async importFiles(files: File[] | FileList): Promise<string> {
    const list = Array.from(files || []);
    if (list.length === 0) return '';

    const parts: string[] = [];
    for (const file of list) {
      const text = await this.extractText(file);
      if (text.trim()) parts.push(text);
    }
    return parts.join('\n\n---\n\n');
  }

  private static async readPlainText(file: File): Promise<string> {
    return this.readFileAsText(file);
  }

  private static readFileAsText(file: File): Promise<string> {
    if (typeof file.text === 'function') {
      return file.text();
    }
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ''));
      reader.onerror = () => reject(reader.error);
      reader.readAsText(file);
    });
  }

  private static async extractHtml(file: File): Promise<string> {
    const raw = await this.readFileAsText(file);
    if (typeof DOMParser === 'undefined') return raw;
    const doc = new DOMParser().parseFromString(raw, 'text/html');
    return (doc.body?.textContent || doc.documentElement?.textContent || '').trim();
  }

  private static async extractRtf(file: File): Promise<string> {
    const raw = await this.readFileAsText(file);
    // Limpieza básica de RTF: elimina grupos y control words
    let text = raw;
    // Eliminar encabezados RTF
    text = text.replace(/\\rtf1[^]*?/i, '');
    // Eliminar control words (\word o \word123)
    text = text.replace(/\\[a-zA-Z]+-?\d* ?/g, '');
    // Eliminar llaves
    text = text.replace(/[{}]/g, '');
    // Decodificar escapes hexadecimales \'XX
    text = text.replace(/\\'([0-9a-fA-F]{2})/g, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );
    return text.trim();
  }

  private static async extractPdf(file: File): Promise<string> {
    const pdfjs = await import('pdfjs-dist');
    // Configure worker
    try {
      if (!pdfjs.GlobalWorkerOptions.workerSrc) {
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url
        ).toString();
      }
    } catch {
      // Fallback to CDN if local worker resolution fails
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    }

    const data = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data });
    const pdf = await loadingTask.promise;

    const pages: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = (content.items || [])
        .map((item: any) => (typeof item.str === 'string' ? item.str : ''))
        .join(' ');
      pages.push(pageText);
    }

    return pages.join('\n\n').trim();
  }

  private static async extractDocx(file: File): Promise<string> {
    const mammoth = await import('mammoth');
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return (result?.value || '').trim();
  }
}