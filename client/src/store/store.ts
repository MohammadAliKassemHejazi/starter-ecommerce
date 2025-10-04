import { configureStore } from "@reduxjs/toolkit";
import config from "@/config/config";
import { useDispatch } from "react-redux";

import userReducer from "./slices/userSlice";
import articleReducer from "./slices/articleSlice";
import shopReducer from "./slices/shopSlice";
import storeReducer from "./slices/storeSlice";
import utilsReducer from "./slices/utilsSlice";
import cartReducer from "./slices/cartSlice";
import paymentReducer from "./slices/paymentSlice";
import orderReducer from "./slices/orderSlice";
import permissionReducer from "./slices/permissionSlice";
import categoriesReducer from "./slices/categorySlice";
import DashboardReducer from "./slices/vendorDashboardSlice";
import usersReducer from "./slices/myUsersSlice";
import rolesReducer from "./slices/roleSlice";
import subCategories from "./slices/subCategorySlice";
import favoritesReducer from "./slices/favoritesSlice";
import publicReducer from "./slices/publicSlice";
import packageReducer from "./slices/packageSlice";

const reducer = {
	user: userReducer,
	article: articleReducer,
	products: shopReducer,
	store : storeReducer,
	utils: utilsReducer,
	cart: cartReducer,
	payment: paymentReducer,
	order: orderReducer,
	permission: permissionReducer,
	categories: categoriesReducer,
	Dashboard: DashboardReducer,
	users: usersReducer,
	roles: rolesReducer,
	subCategories:subCategories,
	favorites: favoritesReducer,
	public: publicReducer,
	packages: packageReducer,
};

export const store = configureStore({
	reducer,
	devTools: config.env === "development",
	middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();