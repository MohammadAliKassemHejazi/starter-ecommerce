import "../styles/globals.css";
import "../styles/ModernTable.css";
import type { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.css";
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
    store.dispatch(fetchSession());
    // Load favorites after a short delay, but only for authenticated users
    // Guest users will load favorites via useGuestDataSync hook
    setTimeout(() => {
      const state = store.getState();
      if (state.user.isAuthenticated && !state.user.isGuest) {
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
      <Component {...pageProps} router={router} />
    </ClientOnlyWrapper>
  );
}

function GuestDataSyncWrapper() {
  // Initialize guest data sync only on client side
  useGuestDataSync();
  return null;
}

export default MyApp;
