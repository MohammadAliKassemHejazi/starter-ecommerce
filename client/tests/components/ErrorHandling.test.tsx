import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import FeaturedStores from '../../../src/components/UI/home/FeaturedStores';
import LatestArticles from '../../../src/components/UI/home/LatestArticles';
import ProductList from '../../../src/components/UI/General/listingProducts/ListingProducts';
import publicReducer from '../../../src/store/slices/publicSlice';
import shopReducer from '../../../src/store/slices/shopSlice';

// Mock Next/Image and Link
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children }: any) => <div>{children}</div>,
}));

// Mock DataFetchError to easily find it
jest.mock('../../../src/components/UI/DataFetchError', () => ({
  __esModule: true,
  default: ({ error }: any) => <div data-testid="error-component">{error}</div>,
}));

describe('Error Handling Components', () => {

  test('FeaturedStores displays error when publicSlice has store error', () => {
    const store = configureStore({
      reducer: {
        public: publicReducer,
      },
      preloadedState: {
        public: {
          stores: [],
          products: [],
          articles: [],
          categories: [],
          packages: [],
          loading: { stores: false, products: false, articles: false, categories: false, packages: false },
          error: { stores: 'Store Fetch Error', products: null, articles: null, categories: null, packages: null },
          pagination: { products: { page: 1, pageSize: 10, total: 0, hasMore: true } }
        }
      }
    });

    render(
      <Provider store={store}>
        <FeaturedStores />
      </Provider>
    );

    expect(screen.getByTestId('error-component')).toHaveTextContent('Store Fetch Error');
  });

  test('LatestArticles displays error when publicSlice has article error', () => {
    const store = configureStore({
      reducer: {
        public: publicReducer,
      },
      preloadedState: {
        public: {
          stores: [],
          products: [],
          articles: [],
          categories: [],
          packages: [],
          loading: { stores: false, products: false, articles: false, categories: false, packages: false },
          error: { stores: null, products: null, articles: 'Article Fetch Error', categories: null, packages: null },
          pagination: { products: { page: 1, pageSize: 10, total: 0, hasMore: true } }
        }
      }
    });

    render(
      <Provider store={store}>
        <LatestArticles />
      </Provider>
    );

    expect(screen.getByTestId('error-component')).toHaveTextContent('Article Fetch Error');
  });

  test('ProductList displays error when shopSlice has error', () => {
    const store = configureStore({
      reducer: {
        products: shopReducer,
      },
      preloadedState: {
        products: {
          products: [],
          Storeproducts: [],
          total: 0,
          page: 1,
          pageSize: 10,
          error: "Product Fetch Error",
          loading: false,
          product: undefined
        }
      }
    });

    render(
      <Provider store={store}>
        <ProductList />
      </Provider>
    );

    expect(screen.getByTestId('error-component')).toHaveTextContent('Product Fetch Error');
  });
});
