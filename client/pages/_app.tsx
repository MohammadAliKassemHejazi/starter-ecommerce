import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/test-styles.css";
import "../styles/scss/main-theme.scss";
import "../styles/scss/_theme-switcher.scss";
import type { AppProps } from "next/app";
import { store } from "@/store/store";
import { Provider } from "react-redux";
import * as React from "react";
import { fetchSession } from "@/store/slices/userSlice";
import { fetchFavorites } from "@/store/slices/favoritesSlice";
import "../src/i18n";
import { ToastProvider } from "../src/contexts/ToastContext";
import ClientOnlyWrapper from "@/components/ClientOnlyWrapper";
   store.dispatch(fetchSession());
function MyApp({ Component, pageProps, router }: AppProps) {
  
  // update session & set token, and conditionally load favorites
  React.useEffect(() => {
    // Apply saved theme as early as possible on client
    try {
      const savedTheme = localStorage.getItem('selected-theme');
      if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
      }
    } catch {}

 
    
  }, []);

  return (
    <Provider store={store}>
      <ToastProvider>
        <AppContent Component={Component} pageProps={pageProps} router={router} />
      </ToastProvider>
    </Provider>
  );
}

function AppContent({ Component, pageProps, router }: AppProps) {
  return (
    <ClientOnlyWrapper>
      <div className="">
        <Component {...pageProps} router={router} />
      </div>
    </ClientOnlyWrapper>
  );
}

export default MyApp;
