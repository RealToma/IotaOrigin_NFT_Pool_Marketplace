import React, { createContext, useState } from 'react';

export const SuspenseContext = createContext({});

export const SuspenseProvider = ({ children }: any) => {
  const [isLoading, setIsLoading] = useState(true);

  const showLoading = () => setIsLoading(true);
  const hideLoading = () => setIsLoading(false);

  return (
    <SuspenseContext.Provider value={{ isLoading, showLoading, hideLoading }}>
      {children}
    </SuspenseContext.Provider>
  );
};
