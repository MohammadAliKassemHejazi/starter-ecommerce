
export interface ICategories {
    id?: string;
    name: string;
    description?: string;
    isActive?: boolean;
    createdById?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ISubCategories {
    id?: string;
    name: string;
    description?: string;
    categoryId?: string;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICategoriesErrors {
    id?: string;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

