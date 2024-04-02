import { FC, PropsWithChildren } from 'react';
import type { AppProps } from 'next/app';

import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import {
  RainbowKitProvider,
  midnightTheme,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';

import { NotificationContainer } from 'react-notifications';
import Layout from '@/layout';
import { IS_MAINNET, projectId } from '@/constants';
import { supportChains, testSupportChains } from '@/constants/chains';

import '../styles/globals.scss';
import '@rainbow-me/rainbowkit/styles.css';
import 'react-notifications/lib/notifications.css';
import ContextProviders from '@/contexts';
import { bloomWallet } from '@/constants/bloomWallet';

//create provider
const { chains, provider } = configureChains(
  IS_MAINNET ? supportChains : [...testSupportChains, ...supportChains],
  [publicProvider()]
);

//connectors
const connectors = connectorsForWallets([
  {
    groupName: 'Suggested',
    wallets: [bloomWallet({ projectId: projectId, chains })],
  },
  {
    groupName: 'Other',
    wallets: [
      injectedWallet({ chains }),
      metaMaskWallet({ projectId: projectId, chains }),
      // rabbyWallet({ chains }),
      walletConnectWallet({
        projectId: projectId,
        chains,
        options: {
          projectId: projectId,
        },
      }),
    ],
  },
]);

//create client
const wagmiClient = createClient({
  provider,
  connectors,
  autoConnect: true,
});

export default function App({
  Component,
  pageProps: { xf, ...pageProps },
}: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={midnightTheme({
          accentColor: '#181818',
          accentColorForeground: 'white',
        })}
        modalSize='compact'
      >
        <ContextProviders>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ContextProviders>
        <NotificationContainer />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
