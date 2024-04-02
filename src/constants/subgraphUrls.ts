import { SHIMMER, CELO, CELO_ALFAJORES, SHIMMER_TESTNET } from './chains';

export const subgraphUrls = {
  [SHIMMER]:
    ' https://subgraph.iotaorigin.de/subgraphs/name/generated/shimmer-v2',
  [CELO]: 'https://api.studio.thegraph.com/query/45203/iota-origin/v0.0.1',
  [CELO_ALFAJORES]:
    'https://api.studio.thegraph.com/query/45203/iota-origin-testnet/v0.0.16',
  [SHIMMER_TESTNET]:
    'https://subgraph.iotaorigin.de/subgraphs/name/generated/shimmer-testnet-v2',
} as { [key: number]: string };
