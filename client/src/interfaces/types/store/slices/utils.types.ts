import { ICategories } from "@/models/utils.model";

export interface CategoriesState {
    Categorie?: ICategories;
	Categories?: ICategories[];
	error?: string;
}