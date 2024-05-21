import {  IStoreResponseModel } from "@/models/store.model";

export interface StoresState {
    store?: IStoreResponseModel;
	stores?: IStoreResponseModel[];
	error?: string;
}