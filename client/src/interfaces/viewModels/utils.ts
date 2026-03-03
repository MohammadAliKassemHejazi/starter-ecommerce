import {
  defaultUserViewModel,
  defaultCategoryViewModel,
  defaultSubCategoryViewModel,
  defaultStoreViewModel,
  defaultProductViewModel
} from './index';

export const withDefaultViewModel = <T extends Record<string, any>>(
  data: Partial<T> | null | undefined,
  defaultViewModel: T
): T => {
  if (!data) {
    return defaultViewModel;
  }

  return {
    ...defaultViewModel,
    ...data,
  } as T;
};

// Specialized mappers to ensure strict conformance and renaming where needed
export const mapToUserViewModel = (data: any) => withDefaultViewModel(data, defaultUserViewModel);
export const mapToCategoryViewModel = (data: any) => withDefaultViewModel(data, defaultCategoryViewModel);
export const mapToSubCategoryViewModel = (data: any) => withDefaultViewModel(data, defaultSubCategoryViewModel);
export const mapToStoreViewModel = (data: any) => withDefaultViewModel(data, defaultStoreViewModel);
export const mapToProductViewModel = (data: any) => withDefaultViewModel(data, defaultProductViewModel);
