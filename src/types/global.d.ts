declare module '*.svg' {
  // rome-ignore lint/suspicious/noExplicitAny: <explanation>
  const content: any;
  export default content;
}

interface BondingCurve {
  type: string;
  title: string;
  description: string;
  icon: string;
  unit: string | null;
  unitAmount: number;
  address?: string;
}

interface PaymentToken {
  address: string;
  name: string;
  symbol: string;
  icon: string;
  priceFeed: string;
  decimals: number;
}

interface NFTData {
  address: string;
  tokenId: string;
  imageUrl: string;
  price?: number;
  priceUsd?: number;
  pool?: string;
  paymentToken?: PaymentToken;
}

interface CollectionData {
  id: string;
  name: string;
  symbol: string;
}

interface PoolData extends CollectionData {
  listings: number;
  volume?: number;
  ethOfferTvl?: number;
  bestOffer?: number;
  floorPrice?: number;
}

interface ChainContextType {
  chainId: number;
  tokenSymbol: string;
  collectionSwapAddress: string;
  collectionStakeAddress: string;
  exponentialCurveAddress: string;
  linearCurveAddress: string;
  rewardTokenList: {
    value: string;
    label: string;
  }[];
  subgraphClient?: any;
}

interface PoolContextType {
  fee?: number;
  delta?: number;
  spotPrice?: number;
  // token_value : number,
  poolAddress?: string;
  collection?: CollectionData;
  bondingCurveAddress?: string;
}

interface PoolInfoType {
  address: string;
  poolType: poolType;
  buyPrice: BigNumber;
  sellPrice: BigNumber;
  spotPrice: BigNumber;
  tokenIds: number[];
  tokenBalance: BigNumber;
}

interface VaultData {
  id: string;
  bondingCurve: string;
  owner: {
    id: string;
  };
  delta: string;
  endTime: string;
  fee: string;
  id: string;
  nft: CollectionData;
  rewardToken: string;
  reward: string;
  startTime: string;
  stakedPairs: {
    pair: {
      owner: {
        id: string;
      };
    };
  }[];
}
