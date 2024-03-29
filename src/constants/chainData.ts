import { CELO, CELO_ALFAJORES, SHIMMER_TESTNET, SHIMMER } from './chains';
import REWARD_TOKEN_LIST_CELO from './reward_tokens_celo_alfajores.json';
import REWARD_TOKEN_LIST_SHIMMER from './reward_tokens_shimmer.json';
import REWARD_TOKEN_LIST_SHIMMER_TESTNET from './reward_tokens_shimmer_testnet.json';

import { subgraphUrls } from './subgraphUrls';

const CHAIN_CONTEXT_CELO_ALFAJORES: ChainContextType = {
  chainId: CELO,
  tokenSymbol: 'CELO',
  collectionSwapAddress:
    // rome-ignore lint/style/noNonNullAssertion: <explanation>
    process.env.NEXT_PUBLIC_COLLECTION_SWAP_ADDRESS_CELO!,
  collectionStakeAddress:
    // rome-ignore lint/style/noNonNullAssertion: <explanation>
    process.env.NEXT_PUBLIC_COLLECTION_STAKER_ADDRESS_CELO!,
  exponentialCurveAddress:
    // rome-ignore lint/style/noNonNullAssertion: <explanation>
    process.env.NEXT_PUBLIC_EXPONENTIAL_CURVE_ADDRESS_CELO!,
  // rome-ignore lint/style/noNonNullAssertion: <explanation>
  linearCurveAddress: process.env.NEXT_PUBLIC_LINEAR_CURVE_ADDRESS_CELO!,
  rewardTokenList: REWARD_TOKEN_LIST_CELO,
};

const CHAIN_CONTEXT_SHIMMER_TESTNET = {
  chainId: SHIMMER_TESTNET,
  tokenSymbol: 'SMR',
  collectionSwapAddress:
    // rome-ignore lint/style/noNonNullAssertion: <explanation>
    process.env.NEXT_PUBLIC_COLLECTION_SWAP_ADDRESS_SHIMMER!,
  collectionStakeAddress:
    // rome-ignore lint/style/noNonNullAssertion: <explanation>
    process.env.NEXT_PUBLIC_COLLECTION_STAKER_ADDRESS_SHIMMER!,
  exponentialCurveAddress:
    // rome-ignore lint/style/noNonNullAssertion: <explanation>
    process.env.NEXT_PUBLIC_EXPONENTIAL_CURVE_ADDRESS_SHIMMER!,
  // rome-ignore lint/style/noNonNullAssertion: <explanation>
  linearCurveAddress: process.env.NEXT_PUBLIC_LINEAR_CURVE_ADDRESS_SHIMMER!,
  rewardTokenList: REWARD_TOKEN_LIST_SHIMMER_TESTNET,
};

const CHAIN_CONTEXT_SHIMMER = {
  chainId: SHIMMER,
  tokenSymbol: 'SMR',
  collectionSwapAddress:
    // rome-ignore lint/style/noNonNullAssertion: <explanation>
    process.env.NEXT_PUBLIC_COLLECTION_SWAP_ADDRESS_SHIMMER!,
  collectionStakeAddress:
    // rome-ignore lint/style/noNonNullAssertion: <explanation>
    process.env.NEXT_PUBLIC_COLLECTION_STAKER_ADDRESS_SHIMMER!,
  exponentialCurveAddress:
    // rome-ignore lint/style/noNonNullAssertion: <explanation>
    process.env.NEXT_PUBLIC_EXPONENTIAL_CURVE_ADDRESS_SHIMMER!,
  // rome-ignore lint/style/noNonNullAssertion: <explanation>
  linearCurveAddress: process.env.NEXT_PUBLIC_LINEAR_CURVE_ADDRESS_SHIMMER!,
  rewardTokenList: REWARD_TOKEN_LIST_SHIMMER,
};

const CHAIN_DATA = {
  [CELO]: CHAIN_CONTEXT_CELO_ALFAJORES,
  [CELO_ALFAJORES]: CHAIN_CONTEXT_CELO_ALFAJORES,
  [SHIMMER]: CHAIN_CONTEXT_SHIMMER,
  [SHIMMER_TESTNET]: CHAIN_CONTEXT_SHIMMER_TESTNET,
} as { [key: number]: ChainContextType };

export default CHAIN_DATA;
