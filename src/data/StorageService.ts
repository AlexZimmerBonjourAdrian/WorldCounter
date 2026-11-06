import { LoggerService } from '@/business/services/LoggerService';
import { StoredCounterText } from './CounterData';

export class StorageService {
  private static DB_NAME = 'WorldCounter_DB';
  private static STORE_NAME = 'texts';
  private static DB_VERSION = 1;

  private static async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const store = db.createObjectStore(this.STORE_NAME, { keyPath: 'id', autoIncrement: true });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  static async saveText(text: string, title?: string, template?: string): Promise<number> {
    const end = LoggerService.start('Storage', 'saveText');
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);

      const counterText: StoredCounterText = {
        text,
        title,
        template,
        timestamp: Date.now(),
      };

      const request = store.add(counterText);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          db.close();
          const id = request.result as number;
          LoggerService.info('Storage', `saved text id=${id} (${text.length} chars)`);
          resolve(id);
        };
        request.onerror = () => {
          db.close();
          reject(request.error);
        };
      });
    } catch (error) {
      LoggerService.error('Storage', 'Error saving text to IndexedDB:', error);
      throw error;
    } finally {
      end();
    }
  }

  static async loadText(id: number): Promise<StoredCounterText | null> {
    LoggerService.debug('Storage', `loadText id=${id}`);
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(id);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          db.close();
          const text = request.result as StoredCounterText | undefined;
          resolve(text || null);
        };
        request.onerror = () => {
          db.close();
          reject(request.error);
        };
      });
    } catch (error) {
      LoggerService.error('Storage', 'Error loading text from IndexedDB:', error);
      return null;
    }
  }

  static async listTexts(): Promise<StoredCounterText[]> {
    LoggerService.debug('Storage', 'listTexts');
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const index = store.index('timestamp');
      const request = index.getAll();

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          db.close();
          const texts = request.result as StoredCounterText[];
          // Ordenar por timestamp descendente (más recientes primero)
          resolve(texts.sort((a, b) => b.timestamp - a.timestamp));
        };
        request.onerror = () => {
          db.close();
          reject(request.error);
        };
      });
    } catch (error) {
      LoggerService.error('Storage', 'Error listing texts from IndexedDB:', error);
      return [];
    }
  }

  static async deleteText(id: number): Promise<void> {
    LoggerService.debug('Storage', `deleteText id=${id}`);
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.delete(id);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          db.close();
          LoggerService.info('Storage', `deleted text id=${id}`);
          resolve();
        };
        request.onerror = () => {
          db.close();
          reject(request.error);
        };
      });
    } catch (error) {
      LoggerService.error('Storage', 'Error deleting text from IndexedDB:', error);
      throw error;
    }
  }

  static async purgeOldTexts(days: number): Promise<number> {
    LoggerService.debug('Storage', `purgeOldTexts days=${days}`);
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const index = store.index('timestamp');
      const request = index.getAll();

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const texts = request.result as StoredCounterText[];
          const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
          let deletedCount = 0;

          texts.forEach((text) => {
            if (text.timestamp < cutoffTime) {
              store.delete(text.id!);
              deletedCount++;
            }
          });

          transaction.oncomplete = () => {
            db.close();
            LoggerService.info('Storage', `purged ${deletedCount} old texts`);
            resolve(deletedCount);
          };
          transaction.onerror = () => {
            db.close();
            reject(transaction.error);
          };
        };
        request.onerror = () => {
          db.close();
          reject(request.error);
        };
      });
    } catch (error) {
      LoggerService.error('Storage', 'Error purging old texts from IndexedDB:', error);
      throw error;
    }
  }

  static async purgeAllTexts(): Promise<void> {
    LoggerService.debug('Storage', 'purgeAllTexts');
    try {
      const db = await this.openDB();
      const transaction = db.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      store.clear();

      return new Promise((resolve, reject) => {
        transaction.oncomplete = () => {
          db.close();
          LoggerService.info('Storage', 'all texts purged');
          resolve();
        };
        transaction.onerror = () => {
          db.close();
          reject(transaction.error);
        };
      });
    } catch (error) {
      LoggerService.error('Storage', 'Error purging all texts from IndexedDB:', error);
      throw error;
    }
  }
}
