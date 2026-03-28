import { IStore } from '@shared/types/store.types';

export interface StoresState {
  store?: IStore;
  stores?: IStore[];
  error?: string;
}
