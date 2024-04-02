import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';
import {
  GET_ALL_COLLECTIONS,
  GET_COLLECTION_DEFAULT_IMAGE,
} from '@/constants/subgraphQueries';

import { useContext, useMemo } from 'react';
import ChainContext from '@/contexts/ChainContext';
import { IPFS_GATEWAY, IPFS_GATEWAY_TOKEN, tokens } from '@/constants';
import { formatUnits } from 'ethers/lib/utils.js';
import { Contract, constants } from 'ethers';
import { useTokenPriceContext } from '@/contexts/TokenPriceContext';
import { useRouter } from 'next/router';
import { SHIMMER, isSupportChain } from '@/constants/chains';
import { createHttpLink } from 'apollo-link-http';
import { subgraphUrls } from '@/constants/subgraphUrls';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { erc721ABI, useNetwork, useProvider } from 'wagmi';
import filetype from 'magic-bytes.js';

// export const useGetEachCollection = async (
//   provider: any,
//   chain: any,
//   tokenName: any,
//   priceData: any,
//   collectionAddress: any
// ) => {
//   const collectionData = useSubgraphData(GET_POOL_DETAILS, collectionAddress);

//   try {
//     const variables = {
//       address: collectionAddress,
//     };
//     const responseGetEachCollection = await (
//       subgraphClient(chain) as ApolloClient<NormalizedCacheObject>
//     ).query({
//       query: GET_POOL_DETAILS,
//       variables,
//     });
//     console.log('responseGetEachCollection:', responseGetEachCollection);
//   } catch (error) {
//     console.log('error of getEachCollection', error);
//   }
// };

export const subgraphClient = (chain: any) => {
  const chainId = isSupportChain(chain?.id ?? 1)
    ? chain?.id ?? SHIMMER
    : SHIMMER;

  const httpLink = createHttpLink({
    uri: subgraphUrls[chainId],
  });

  return new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });
};

export const getCollectionImageInfo = async (
  chain: any,
  provider: any,
  collectionAddress: any
  // index: any
) => {
  const variables = {
    collectionAddress: collectionAddress?.toLowerCase(),
  };

  try {
    const resSubgraphGetCollectionImage = await (
      subgraphClient(chain) as ApolloClient<NormalizedCacheObject>
    ).query({ query: GET_COLLECTION_DEFAULT_IMAGE, variables });

    const data = resSubgraphGetCollectionImage.data;

    if (!data?.nfts || !data?.nfts?.length) {
      return;
    }

    if (!data?.nfts?.length || !collectionAddress) {
      return;
    }

    const contract = new Contract(collectionAddress, erc721ABI, provider);
    const uri = await contract.tokenURI(data?.nfts[0]?.identifier);

    const metadataUri =
      uri.replace('ipfs://', IPFS_GATEWAY) +
      (IPFS_GATEWAY_TOKEN !== '' && uri.includes('ipfs://')
        ? '?pinataGatewayToken=' + IPFS_GATEWAY_TOKEN
        : '');
    if (metadataUri.length <= 10) {
      return [undefined, undefined];
    }

    const response = await fetch(metadataUri);
    if (!response.ok) {
      if (response.status === 404) {
        console.log('404 Not Found Error');
        // Handle the 404 error here
        return [undefined, undefined];
      } else {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }

    const metadata = await response.json();

    // console.log(`${index}:`, collectionAddress);

    // console.log('metadata:', metadata);

    // const metadata = await fetch(metadataUri).then(res => res.json());

    let assetUri =
      metadata?.image?.replace('ipfs://', IPFS_GATEWAY) +
      (IPFS_GATEWAY_TOKEN !== '' && metadata?.image?.includes('ipfs://')
        ? '?img-width=50&pinataGatewayToken=' + IPFS_GATEWAY_TOKEN
        : '?img-width=50');

    const responseAssetUri = await fetch(assetUri);
    if (!responseAssetUri.ok) {
      if (responseAssetUri.status === 404) {
        console.log('404 Not Found Error');
        // Handle the 404 error here
        return [undefined, undefined];
      } else {
        throw new Error(`HTTP error! Status: ${responseAssetUri.status}`);
      }
    }

    const buffer = await responseAssetUri.arrayBuffer();
    var uint8View = new Uint8Array(buffer);
    const type = filetype(uint8View);
    const { typename } = type[0];

    return [assetUri, typename];
    // return ['assetUri', 'typename'];
  } catch (error) {
    console.log('error of getCollectionImageInfo:', error);
    return [undefined, undefined];
  }
};

export const useGetAllCollectionAssets = async () => {
  const { chain } = useNetwork();
  const provider = useProvider();
  const { subgraphClient } = useContext(ChainContext) as ChainContextType;

  try {
    const resGetAllCollection = await (
      subgraphClient as ApolloClient<NormalizedCacheObject>
    ).query({
      query: GET_ALL_COLLECTIONS,
      variables: {
        filter: '',
      },
    });

    const arrayAllCollection: any = [];

    await Promise.all(
      resGetAllCollection?.data?.collections.map(
        async (collection: any, index: any) => {
          // await getCollectionImageInfo(chain, provider, collection.id, index);
          const [imageUri, imageType]: any = await getCollectionImageInfo(
            chain,
            provider,
            collection.id
          );

          let eachCollectionData: any = {
            id: collection.id,
            name: collection.name,
            symbol: collection.symbol,
            paris: collection.pairs,
            imageUri: imageUri,
            imageType: imageType,
          };
          // console.log('index:', index);

          // console.log('eachCollectionData:', eachCollectionData);
          arrayAllCollection.push(eachCollectionData);
        }
      )
    );
    // const getCollectionItem = localStorage.getItem('arrayAllCollection');
    // console.log('getCollectionItem:', getCollectionItem);
    // if (getCollectionItem !== undefined) {
    //   return;
    // }
    let objectArrayString: any = undefined;
    if (typeof window !== 'undefined' && window.localStorage) {
      objectArrayString = JSON.stringify(arrayAllCollection);
      localStorage.setItem('arrayAllCollection', objectArrayString);
    }

    // }
    // console.log('arrayAllCollection:', arrayAllCollection);
    // return arrayAllCollection;
  } catch (error) {
    console.log('error of useGetAllCollectionAssets:', error);
  }
};
