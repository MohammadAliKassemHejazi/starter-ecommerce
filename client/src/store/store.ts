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
const reducer = {
	user: userReducer,
	article: articleReducer,
	products: shopReducer,
	store : storeReducer,
	utils: utilsReducer,
	cart: cartReducer,
	payment: paymentReducer,
	order:orderReducer,
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