import {
  Chain,
  Wallet,
  getWalletConnectConnector,
} from '@rainbow-me/rainbowkit';

export interface MyWalletOptions {
  projectId: string;
  chains: Chain[];
}

export const bloomWallet = ({
  chains,
  projectId,
}: MyWalletOptions): Wallet => ({
  id: 'bloomWallet',
  name: 'Bloom Wallet',
  iconUrl: 'https://bloomwallet.io/assets/logos/bloom.png',
  iconBackground: '#000',
  downloadUrls: {
    android: 'https://bloomwallet.io/',
    ios: 'https://bloomwallet.io/',
    mobile: 'https://bloomwallet.io/',
    qrCode: 'https://bloomwallet.io/',
    chrome: 'https://bloomwallet.io/',
    edge: 'https://bloomwallet.io/',
    firefox: 'https://bloomwallet.io/',
    opera: 'https://bloomwallet.io/',
    safari: 'https://bloomwallet.io/',
    browserExtension: 'https://bloomwallet.io/',
  },
  createConnector: () => {
    const connector = getWalletConnectConnector({ projectId, chains });
    return {
      connector,
      desktop: {
        getUri: async () => {
          const provider = await connector.getProvider();
          const uri = await new Promise<string>(resolve =>
            provider.once('display_uri', resolve)
          );
          return `bloom://wallet-connect/connect?uri=${encodeURIComponent(
            uri
          )}`;
        },
      },
    };
  },
});
