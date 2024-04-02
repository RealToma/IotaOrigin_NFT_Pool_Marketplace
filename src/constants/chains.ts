import { Chain } from 'wagmi';
import { celo, celoAlfajores, sepolia } from '@wagmi/core/chains';
import { IS_MAINNET } from '.';

export const CELO = 42220;
export const CELO_ALFAJORES = 44787;
export const SHIMMER_TESTNET = 1073;
// export const SHIMMER_TESTNET = sepolia.id;
export const SHIMMER = 148;

// shimmer mainnet chain
const shimmerMainnetChain: Chain = {
  id: SHIMMER,
  name: 'ShimmerEVM',
  network: 'ShimmerEVM',

  nativeCurrency: {
    name: 'SMR',
    symbol: 'SMR',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://json-rpc.evm.shimmer.network/'],
    },
    public: {
      http: ['https://json-rpc.evm.shimmer.network/'],
    },
  },
  blockExplorers: {
    default: {
      url: 'https://explorer.evm.shimmer.network',
      name: 'ShimmerScan',
    },
    etherscan: {
      url: 'https://explorer.evm.shimmer.network',
      name: 'ShimmerScan',
    },
  },
  testnet: false,
};

// shimmer Beta chain
const shimmerTestnetChain: Chain = {
  id: SHIMMER_TESTNET,
  name: 'Shimmer Testnet',
  network: 'ShimmerTestnet',

  nativeCurrency: {
    name: 'SMR',
    symbol: 'SMR',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://json-rpc.evm.testnet.shimmer.network/'],
    },
    public: {
      http: ['https://json-rpc.evm.testnet.shimmer.network/'],
    },
  },
  blockExplorers: {
    default: {
      url: 'https://explorer.evm.testnet.shimmer.network',
      name: 'ShimmerScan',
    },
    etherscan: {
      url: 'https://explorer.evm.testnet.shimmer.network',
      name: 'ShimmerScan',
    },
  },
  testnet: true,
};

export const supportChains = [shimmerMainnetChain]; //, celo];
// export const testSupportChains = [shimmerTestnetChain, celoAlfajores];
export const testSupportChains = [shimmerTestnetChain];

export const isSupportChain = (chainId: number) => {
  return IS_MAINNET
    ? chainId === CELO || chainId === SHIMMER
    : chainId === CELO_ALFAJORES || chainId === SHIMMER_TESTNET;
};
