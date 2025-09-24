import "../styles/globals.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.css";
import { store } from "@/store/store";
import { Provider } from "react-redux";
import * as React from "react";
import { fetchSession } from "@/store/slices/userSlice";
import { fetchFavorites } from "@/store/slices/favoritesSlice";
import "../src/i18n";
import { ToastProvider } from "../src/contexts/ToastContext";

function MyApp({ Component, pageProps }: AppProps) {
  
  // update session & set token, and load favorites
  React.useEffect(() => {
    store.dispatch(fetchSession());
    // Load favorites after a short delay to ensure user session is established
    setTimeout(() => {
      store.dispatch(fetchFavorites());
    }, 1000);
  }, []);

  return (
    <Provider store={store}>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </Provider>
  );
}

export default MyApp;
