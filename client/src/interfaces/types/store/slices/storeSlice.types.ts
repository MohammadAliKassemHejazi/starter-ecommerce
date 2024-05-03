import { IStoreModel } from "@/models/store.model";

export interface StoresState {
    store?: IStoreModel;
	stores?: IStoreModel[];
	error?: string;
}