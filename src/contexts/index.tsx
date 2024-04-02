import { FC, PropsWithChildren } from 'react';
import { ChainContextProvider } from './ChainContext';
import { PoolContextProvider } from './PoolContext';
import { TokenPriceContextProvider } from './TokenPriceContext';
import { StatsContextProvider } from './StatsContext';

const ContextProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ChainContextProvider>
      <StatsContextProvider>
        <PoolContextProvider>
          <TokenPriceContextProvider>{children}</TokenPriceContextProvider>
        </PoolContextProvider>
      </StatsContextProvider>
    </ChainContextProvider>
  );
};

export default ContextProviders;
