import gql from 'graphql-tag';

export const GET_ALL_NFT_CONTRACTS = gql`
  query GetCollections($first: Int, $skip: Int, $filter: String) {
    collections: collections(
      where: {
        and: [
          { supportsMetadata: true }
          { name_not: null }
          { symbol_not: null }
          {
            or: [
              { name_contains_nocase: $filter }
              { symbol_contains_nocase: $filter }
            ]
          }
          { nfts_: { identifier_gte: "0" } }
        ]
      }
      orderBy: symbol
      orderDirection: asc
      skip: $skip
      first: $first
    ) {
      id
      supportsMetadata
      name
      symbol
    }
  }
`;

export const GET_ALL_COLLECTIONS = gql`
  query GetAllCollections($first: Int, $skip: Int, $filter: String) {
    collections: collections(
      where: {
        and: [
          { supportsMetadata: true }
          { name_not: null }
          { symbol_not: null }
          {
            or: [
              { name_contains_nocase: $filter }
              { symbol_contains_nocase: $filter }
            ]
          }
          { nfts_: { identifier_gt: "0" } }
          { pairs_: { bondingCurve_contains_nocase: "0x" } }
        ]
      }
      orderBy: symbol
      orderDirection: asc
      skip: $skip
      first: $first
    ) {
      id
      name
      symbol
      ethVolume
      ethOfferTVL
      pairs(
        where: {
          pairToken_: {
            owner_not: "0x0000000000000000000000000000000000000000"
          }
        }
      ) {
        id
        type
        numNfts
        volume
        balance
        spotPrice
        swapNonce
        delta
        bondingCurve
        assetRecipient
        asAccount {
          nfts {
            identifier
          }
        }
        token {
          id
        }
      }
    }
  }
`;

export const GET_POOL_DETAILS = gql`
  query GetAllPools($address: String) {
    collection(id: $address) {
      id
      supportsMetadata
      name
      symbol
      pairs(
        where: {
          pairToken_: {
            owner_not: "0x0000000000000000000000000000000000000000"
          }
        }
      ) {
        id
        type
        asAccount {
          nfts {
            identifier
          }
        }
        numNfts
        volume
        balance
        spotPrice
        swapNonce
        delta
        bondingCurve
        assetRecipient
        token {
          id
        }
      }
    }
  }
`;

export const GET_NFTS_IN_COLLECTION = gql`
  query GetNFTsInCollections($address: ID!, $collectionAddress: Bytes) {
    account(id: $address) {
      nfts(
        where: { contract_: { id: $collectionAddress } }
        orderBy: identifier
        orderDirection: asc
      ) {
        identifier
        contract {
          id
          name
          symbol
        }
      }
    }
  }
`;

export const GET_NFTS_IN_COLLECTION_WITH_IDS = gql`
  query GetNFTsInCollections($collectionAddress: Bytes, $ids: [String]) {
    nfts(
      where: { contract_: { id: $collectionAddress }, identifier_in: $ids }
      orderBy: identifier
      orderDirection: asc
    ) {
      identifier
    }
  }
`;

export const GET_NFTS_IN_WALLET = gql`
  query GetNFTsInWallet($address: ID!) {
    account(id: $address) {
      nfts(orderBy: identifier, orderDirection: asc) {
        identifier
        contract {
          id
          name
          symbol
        }
      }
    }
  }
`;

export const GET_COLLECTION_DEFAULT_IMAGE = gql`
  query GetCollectionDefaultImage($collectionAddress: Bytes) {
    nfts: nfts(
      where: { contract_: { id: $collectionAddress } }
      orderBy: identifier
      orderDirection: asc
      first: 1
    ) {
      identifier
    }
  }
`;

export const GET_ALL_VAULTS = gql`
  query getAllVaults($first: Int, $skip: Int) {
    vaults: vaults {
      id
      bondingCurve
      delta
      endTime
      fee
      id
      nft {
        name
        id
        symbol
      }
      rewardToken
      reward
      tokenAddress
      startTime
      owner {
        id
      }
      stakedPairs {
        pair {
          owner {
            id
          }
        }
      }
    }
  }
`;

export const GET_VAULT = gql`
  query GetVault($id: ID) {
    vault(id: $id) {
      bondingCurve
      delta
      endTime
      fee
      id
      rewardToken
      reward
      tokenAddress
      startTime
      nft {
        id
        name
        symbol
        supportsMetadata
      }
      stakedPairs {
        id
        tokenId
        pair {
          owner {
            id
          }
          bondingCurve
          id
          delta
          fee
        }
      }
    }
  }
`;

export const GET_STAKABLE_POOLS = gql`
  query GetStakablePools(
    $address: String
    $nftAddress: String
    $delta: BigInt
    $fee: BigInt
    $bondingCurve: String
  ) {
    pairs(
      where: {
        owner: $address
        delta: $delta
        fee: $fee
        collection: $nftAddress
        bondingCurve: $bondingCurve
        type: 2
        pairToken_: {
          vault: null
          owner_not: "0x0000000000000000000000000000000000000000"
        }
      }
    ) {
      pairToken {
        tokenId
      }
      numNfts
      id
      fee
      delta
      bondingCurve
      spotPrice
      collection {
        symbol
        name
        id
      }
      token {
        id
      }
    }
  }
`;

export const GET_NFT_DATA = gql`
  query GetCollection($id: String) {
    collection(id: $id) {
      id
      supportsMetadata
      name
      symbol
    }
  }
`;

export const GET_COLLECTIONS_MULTI = gql`
  query GetCollection($ids: [String!]) {
    collections: collections(where: { id_in: $ids }) {
      id
      supportsMetadata
      name
      symbol
    }
  }
`;

export const GET_BUY_ORDER = gql`
  query GetBuyOrder($nft: String!, $token: String!) {
    orders: pairs(
      where: {
        collection_: { id: $nft }
        type_not: "1"
        pairToken_: { owner_not: "0x0000000000000000000000000000000000000000" }
        token_: { id: $token }
      }
      orderBy: "spotPrice"
      orderDirection: "asc"
    ) {
      spotPrice
    }
  }
`;
export const GET_SELL_ORDER = gql`
  query GetBuyOrder($nft: String!, $token: String!) {
    orders: pairs(
      where: {
        collection_: { id: $nft }
        type_not: "0"
        pairToken_: { owner_not: "0x0000000000000000000000000000000000000000" }
        token_: { id: $token }
      }
      orderBy: "spotPrice"
      orderDirection: "desc"
    ) {
      spotPrice
    }
  }
`;

export const GET_SWAP_HISTORY = gql`
  query GetSwapHistory($nft: String!) {
    history: swaps(where: { pair_: { collection: $nft } }) {
      timestamp
      isTokenToNFT
      tokenAmount
      nftIds
      pair {
        token {
          id
        }
      }
    }
  }
`;

export const GET_MY_PAIRS = gql`
  query GetMyPairs($owner: String) {
    pairs(
      where: {
        owner: $owner
        pairToken_: {
          owner_not: "0x0000000000000000000000000000000000000000"
          vault: null
        }
      }
    ) {
      assetRecipient
      bondingCurve
      delta
      balance
      volume
      fee
      collection {
        ethVolume
        ethOfferTVL
        id
        name
        symbol
      }
      id
      asAccount {
        nfts {
          identifier
        }
      }
      numNfts
      spotPrice
      swapNonce
      token {
        id
      }
      type
      pairToken {
        tokenId
      }
    }
  }
`;
