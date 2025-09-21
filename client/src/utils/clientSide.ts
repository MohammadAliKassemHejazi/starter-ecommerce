import React, { useEffect, useState } from 'react';

/**
 * Hook to check if we're running on the client side
 * This helps prevent hydration mismatches and SSR issues
 */
export const useIsClient = (): boolean => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

/**
 * Higher-order component to ensure client-side only rendering
 */
export const withClientSideOnly = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  const ClientSideComponent = (props: P) => {
    const isClient = useIsClient();

    if (!isClient) {
      return null;
    }

    return React.createElement(Component, props);
  };

  ClientSideComponent.displayName = `withClientSideOnly(${Component.displayName || Component.name})`;

  return ClientSideComponent;
};

/**
 * Utility function to check if we're on the client side
 * This is a synchronous check, use useIsClient hook for React components
 */
export const isClientSide = (): boolean => {
  return typeof window !== 'undefined';
};
