import {
  FC,
  PropsWithChildren,
  createContext,
  useEffect,
  useMemo,
} from 'react';
import { useNetwork } from 'wagmi';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SHIMMER, isSupportChain } from '@/constants/chains';
import CHAIN_DATA from '@/constants/chainData';
import { useRouter } from 'next/router';
import { subgraphUrls } from '@/constants/subgraphUrls';
import { publicPaths } from '@/constants';
import { NotificationManager } from 'react-notifications';

const ChainContext = createContext<ChainContextType | null>(null);

export const ChainContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const { chain } = useNetwork();
  const router = useRouter();

  const chainId = useMemo(
    () => (isSupportChain(chain?.id ?? 1) ? chain?.id ?? SHIMMER : SHIMMER),
    [chain?.id]
  );

  const chainData = useMemo(() => CHAIN_DATA[chainId], [chainId]);

  const subgraphClient = useMemo(() => {
    const httpLink = createHttpLink({
      uri: subgraphUrls[chainId],
    });

    return new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
    });
  }, [chainId]);

  useEffect(() => {
    const isPublic = publicPaths.indexOf(router.pathname) >= 0;

    if (!chain && !isPublic) {
      NotificationManager.error('Please connect your wallet');
      router.push('/');
    }
  }, [chain, router]);

  return (
    <ChainContext.Provider value={{ ...chainData, subgraphClient }}>
      {children}
    </ChainContext.Provider>
  );
};

export default ChainContext;
