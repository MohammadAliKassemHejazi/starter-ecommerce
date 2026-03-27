
export interface ICategories {
    id?: string;
    name: string;
    description?: string;

    userId?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ISubCategories {
    id?: string;
    name: string;
    description?: string;
    categoryId?: string;

    createdAt?: string;
    updatedAt?: string;
    category?: {
        id: string;
        name: string;
        description?: string;
    };
}

export interface ICategoriesErrors {
    id?: string;
    name: string;
    description?: string;
    createdAt?: string;
    updatedAt?: string;
}

