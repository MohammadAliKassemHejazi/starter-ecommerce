import { IProductModel } from '@/models/product.model';
import { CartItem } from '@/models/cart.model';

// Local storage keys
const GUEST_FAVORITES_KEY = 'guest_favorites';
const GUEST_CART_KEY = 'guest_cart';
const GUEST_ACTIONS_KEY = 'guest_actions';

// Types for local storage data
export interface GuestFavorite {
  productId: string;
  product: IProductModel;
  addedAt: string;
}

export interface GuestCartItem extends CartItem {
  addedAt: string;
}

export interface GuestAction {
  type: 'add_to_favorites' | 'remove_from_favorites' | 'add_to_cart' | 'remove_from_cart' | 'update_cart_quantity';
  productId: string;
  product?: IProductModel;
  quantity?: number;
  timestamp: string;
}

class LocalStorageService {
  // Check if we're in browser environment
  private isBrowser(): boolean {
    return typeof window !== 'undefined' && 
           typeof localStorage !== 'undefined' && 
           typeof document !== 'undefined';
  }

  // Generic localStorage methods
  private setItem<T>(key: string, value: T): void {
    if (!this.isBrowser()) return;
    
    try {
      if (localStorage && typeof localStorage.setItem === 'function') {
        localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.warn(`Error saving to localStorage (${key}):`, error);
    }
  }

  private getItem<T>(key: string): T | null {
    if (!this.isBrowser()) return null;
    
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
    if (!this.isBrowser()) return;
    
    try {
      if (localStorage && typeof localStorage.removeItem === 'function') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing from localStorage (${key}):`, error);
    }
  }

  // Favorites methods
  getGuestFavorites(): GuestFavorite[] {
    return this.getItem<GuestFavorite[]>(GUEST_FAVORITES_KEY) || [];
  }

  addToGuestFavorites(product: IProductModel): void {
    const favorites = this.getGuestFavorites();
    const existingIndex = favorites.findIndex(fav => fav.productId === product.id);
    
    if (existingIndex === -1) {
      favorites.push({
        productId: product.id!,
        product,
        addedAt: new Date().toISOString()
      });
      this.setItem(GUEST_FAVORITES_KEY, favorites);
      this.logGuestAction('add_to_favorites', product.id!, product);
    }
  }

  removeFromGuestFavorites(productId: string): void {
    const favorites = this.getGuestFavorites();
    const filteredFavorites = favorites.filter(fav => fav.productId !== productId);
    this.setItem(GUEST_FAVORITES_KEY, filteredFavorites);
    this.logGuestAction('remove_from_favorites', productId);
  }

  isProductInGuestFavorites(productId: string): boolean {
    const favorites = this.getGuestFavorites();
    return favorites.some(fav => fav.productId === productId);
  }

  clearGuestFavorites(): void {
    this.removeItem(GUEST_FAVORITES_KEY);
  }

  // Cart methods
  getGuestCart(): GuestCartItem[] {
    return this.getItem<GuestCartItem[]>(GUEST_CART_KEY) || [];
  }

  addToGuestCart(product: IProductModel, quantity: number = 1): void {
    const cart = this.getGuestCart();
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].cartQuantity += quantity;
    } else {
      cart.push({
        ...product,
        cartQuantity: quantity,
        addedAt: new Date().toISOString()
      });
    }
    
    this.setItem(GUEST_CART_KEY, cart);
    this.logGuestAction('add_to_cart', product.id!, product, quantity);
  }

  updateGuestCartQuantity(productId: string, quantity: number): void {
    const cart = this.getGuestCart();
    const itemIndex = cart.findIndex(item => item.id === productId);
    
    if (itemIndex !== -1) {
      if (quantity <= 0) {
        cart.splice(itemIndex, 1);
        this.logGuestAction('remove_from_cart', productId);
      } else {
        cart[itemIndex].cartQuantity = quantity;
        this.logGuestAction('update_cart_quantity', productId, undefined, quantity);
      }
      this.setItem(GUEST_CART_KEY, cart);
    }
  }

  removeFromGuestCart(productId: string): void {
    const cart = this.getGuestCart();
    const filteredCart = cart.filter(item => item.id !== productId);
    this.setItem(GUEST_CART_KEY, filteredCart);
    this.logGuestAction('remove_from_cart', productId);
  }

  clearGuestCart(): void {
    this.removeItem(GUEST_CART_KEY);
  }

  // Guest actions logging (for sync when user logs in)
  private logGuestAction(type: GuestAction['type'], productId: string, product?: IProductModel, quantity?: number): void {
    const actions = this.getGuestActions();
    actions.push({
      type,
      productId,
      product,
      quantity,
      timestamp: new Date().toISOString()
    });
    this.setItem(GUEST_ACTIONS_KEY, actions);
  }

  getGuestActions(): GuestAction[] {
    return this.getItem<GuestAction[]>(GUEST_ACTIONS_KEY) || [];
  }

  clearGuestActions(): void {
    this.removeItem(GUEST_ACTIONS_KEY);
  }

  // Clear all guest data
  clearAllGuestData(): void {
    this.clearGuestFavorites();
    this.clearGuestCart();
    this.clearGuestActions();
  }

  // Get guest cart totals
  getGuestCartTotals(): { totalQuantity: number; totalAmount: number } {
    const cart = this.getGuestCart();
    let totalQuantity = 0;
    let totalAmount = 0;

    cart.forEach(item => {
      totalQuantity += item.cartQuantity;
      totalAmount += (item.price || 0) * item.cartQuantity;
    });

    return { totalQuantity, totalAmount };
  }

  // Check if guest has any data
  hasGuestData(): boolean {
    const favorites = this.getGuestFavorites();
    const cart = this.getGuestCart();
    return favorites.length > 0 || cart.length > 0;
  }
}

// Export singleton instance
export const localStorageService = new LocalStorageService();
export default localStorageService;
