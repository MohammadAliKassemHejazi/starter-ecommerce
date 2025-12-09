import { IProductModel } from '@/models/product.model';

class LocalStorageService {
  // Check if we're in browser environment
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && 
           typeof localStorage !== 'undefined' && 
           typeof document !== 'undefined';
  }

  // Generic localStorage methods
  private setItem<T>(key: string, value: T): void {
    if (!this.isBrowser()) {
      return;
    }
    
    try {
      if (localStorage && typeof localStorage.setItem === 'function') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`Error saving to localStorage (${key}):`, error);
    }
  }

  private getItem<T>(key: string): T | null {
    if (!this.isBrowser()) {
      return null;
    }
    
    try {
      if (localStorage && typeof localStorage.getItem === 'function') {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      }
    } catch (error) {
      console.warn(`Error reading from localStorage (${key}):`, error);
    }
    return null;
  }

  private removeItem(key: string): void {
    if (!this.isBrowser()) {
      return;
    }
    
    try {
      if (localStorage && typeof localStorage.removeItem === 'function') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing from localStorage (${key}):`, error);
    }
  }

  // You can add authentication token methods here if needed in the future
  // For now, guest logic is removed.
}

// Export singleton instance
export const localStorageService = new LocalStorageService();
export default localStorageService;
