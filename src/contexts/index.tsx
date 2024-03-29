import { FC, PropsWithChildren } from 'react';
import { ChainContextProvider } from './ChainContext';
import { PoolContextProvider } from './PoolContext';
import { TokenPriceContextProvider } from './TokenPriceContext';

const ContextProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ChainContextProvider>
      <PoolContextProvider>
        <TokenPriceContextProvider>{children}</TokenPriceContextProvider>
      </PoolContextProvider>
    </ChainContextProvider>
  );
};

export default ContextProviders;
