import { ICategories,ISubCategories } from "@/models/utils.model";

export interface CategoriesState {
    Categorie?: ICategories;
	Categories?: ICategories[];
	SubCategories?:ISubCategories[];
	error?: string;
}