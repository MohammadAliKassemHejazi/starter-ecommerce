import { ISize } from "@/models/size.model";
import { ICategories,ISubCategories } from "@/models/utils.model";

export interface CategoriesState {
    Categorie?: ICategories;
	Categories?: ICategories[];
	SubCategories?: ISubCategories[];
	Size?: ISize[];
	error?: string;
}