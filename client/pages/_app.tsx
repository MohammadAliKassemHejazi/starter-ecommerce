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
import { useGuestDataSync } from "@/hooks/useGuestDataSync";
import ClientOnlyWrapper from "@/components/ClientOnlyWrapper";

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

    store.dispatch(fetchSession());
    // Load favorites after a short delay, but only for authenticated users
    // Guest users will load favorites via useGuestDataSync hook
    setTimeout(() => {
      const state = store.getState();
      if (state.user.isAuthenticated ) {
        store.dispatch(fetchFavorites());
      }
    }, 1000);
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
      <GuestDataSyncWrapper />
      <div className="">
        <Component {...pageProps} router={router} />
      </div>
    </ClientOnlyWrapper>
  );
}

function GuestDataSyncWrapper() {
  // Initialize guest data sync only on client side
  useGuestDataSync();
  return null;
}

export default MyApp;
