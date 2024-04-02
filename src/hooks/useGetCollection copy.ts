import { SHIMMER, isSupportChain } from '@/constants/chains';
import { subgraphUrls } from '@/constants/subgraphUrls';
import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import {
  GET_ALL_COLLECTIONS,
  GET_COLLECTION_DEFAULT_IMAGE,
} from '@/constants/subgraphQueries';
import { IPFS_GATEWAY, IPFS_GATEWAY_TOKEN, tokens } from '@/constants';
import { Contract, constants } from 'ethers';
import { formatUnits } from 'ethers/lib/utils.js';
import { erc721ABI } from 'wagmi';
import filetype from 'magic-bytes.js';

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

const fetchCollectionIcon = async (
  provider: any,
  chain: any,
  collectionAddress: any,
  index: any
) => {
  if (index === 16 || index === 19) {
    return [undefined, undefined];
  }
  try {
    const variables = {
      collectionAddress: collectionAddress?.toLowerCase(),
    };

    const responseCollectionImage: any = await (
      subgraphClient(chain) as ApolloClient<NormalizedCacheObject>
    ).query({
      query: GET_COLLECTION_DEFAULT_IMAGE,
      variables,
    });

    // console.log('responseCollectionImage:', responseCollectionImage);
    let data: any = responseCollectionImage.data;
    // console.log('data:', data);
    if (!data?.nfts || !data?.nfts?.length) {
      return;
    }

    if (!data?.nfts?.length || !collectionAddress) {
      return;
    }
    const contract = new Contract(collectionAddress, erc721ABI, provider);
    const uri = await contract.tokenURI(data?.nfts[0]?.identifier);

    // console.log('index:', index);
    // console.log('uri:', uri);

    const metadataUri =
      uri.replace('ipfs://', IPFS_GATEWAY) +
      (IPFS_GATEWAY_TOKEN !== '' && uri.includes('ipfs://')
        ? '?pinataGatewayToken=' + IPFS_GATEWAY_TOKEN
        : '');

    const metadataResponse = await fetch(metadataUri);

    if (!metadataResponse.ok) {
      // Handle the 404 error here
      console.error('Error: Not Found');
      return undefined;
    }

    const metadata = await metadataResponse.json();

    let assetUri =
      metadata?.image?.replace('ipfs://', IPFS_GATEWAY) +
      (IPFS_GATEWAY_TOKEN !== '' && metadata?.image?.includes('ipfs://')
        ? '?img-width=50&pinataGatewayToken=' + IPFS_GATEWAY_TOKEN
        : '?img-width=50');

    // const responseAssetURI = await fetch(assetUri).catch(err => {
    //   console.error('Error fetching asset URI:', err);
    //   return undefined;
    // });

    // if (!responseAssetURI || !responseAssetURI.ok) {
    //   console.error('Error fetching asset URI:', responseAssetURI?.status);
    //   return undefined;
    // }
    // console.log('responseAssetURI:', responseAssetURI);

    // console.log('responseAssetURI:', responseAssetURI);
    const responseAssetURI = await fetch(assetUri);
    const buffer = await responseAssetURI.arrayBuffer();

    var uint8View = new Uint8Array(buffer);
    const type = filetype(uint8View);
    // console.log('type:', type);
    const { typename } = type[0];
    return [assetUri, typename];
    // return ['assetUri', 'typename'];
  } catch (error) {
    console.log('error of fetchCollectionIcon:', error);
  }
};

export const getEachCollection = async (
  provider: any,
  chain: any,
  tokenName: any,
  priceData: any,
  collectionAddress: any
) => {
  try {
    const responseGetAllCollection = await (
      subgraphClient(chain) as ApolloClient<NormalizedCacheObject>
    ).query({
      query: GET_ALL_COLLECTIONS,
      variables: {
        // first: limit,
        // skip: offset,
        filter: '',
      },
    });

    // console.log('responseGetAllCollection:', responseGetAllCollection.data);
    const paymentToken = tokens.filter(
      item => item.symbol == (tokenName ?? 'TOTAL')
    )[0];

    const arrayCollectionInfo: any = [];

    responseGetAllCollection.data.collections.map(
      async (collection: any, index: any) => {
        const pairs = (collection.pairs ?? []).filter(
          (pair: any) =>
            !paymentToken?.address ||
            (pair.token?.id ?? constants.AddressZero) ==
              paymentToken.address.toLowerCase()
        );

        // console.log("pairs:", pairs)
        const totalVolume = pairs.reduce((prev: number, pair: any) => {
          const pairToken = tokens.filter(
            item => item.address.toLowerCase() == pair?.token?.id
          )[0];
          return (
            prev +
            parseFloat(formatUnits(pair.volume, pairToken?.decimals ?? 18)) *
              priceData[pair?.token?.id]
          );
        }, 0);
        console.log('totalVolume:', totalVolume);
        const listings = pairs.reduce(
          (prev: number, pair: any) => prev + parseInt(pair.numNfts),
          0
        );

        // console.log("listings:", listings)
        let bestOffer = undefined;
        let floorPrice = undefined;
        for (const pair of pairs) {
          const pairToken = tokens.filter(
            item => item.address.toLowerCase() == pair?.tokenName?.id
          )[0];
          const pairPrice =
            +formatUnits(pair.spotPrice, pairToken?.decimals ?? 18) *
            priceData[pair.tokenName?.id ?? constants.AddressZero];
          const tokenBalance = +formatUnits(
            pair.balance ?? '0',
            pairToken?.decimals ?? 18
          );
          if (pair.type != '1') {
            if (!bestOffer) {
              bestOffer = pairPrice;
            } else if (pairPrice > bestOffer) {
              bestOffer = pairPrice;
            }
          }
          if (pair.type != '0' && tokenBalance >= pairPrice) {
            if (!floorPrice) {
              floorPrice = pairPrice;
            } else if (pairPrice < floorPrice) {
              floorPrice = pairPrice;
            }
          }
        }
        const [imageUri, imageType]: any = await fetchCollectionIcon(
          provider,
          chain,
          collection.id,
          index
        );

        console.log('totalVolume:', totalVolume);
        let eachCollectionData = {
          id: collection.id,
          name: collection.name,
          // imageUri: imageUri,
          // imageType: imageType,
          symbol: collection.symbol,
          volume: totalVolume,
          listings: listings,
          bestOffer,
          floorPrice: floorPrice ? floorPrice * 1.1 : undefined,
        };

        arrayCollectionInfo.push(eachCollectionData);
      }
    );

    console.log('arrayCollectionInfo:', arrayCollectionInfo);

    // return responseGetAllCollection.data;
    return arrayCollectionInfo;
  } catch (error) {
    console.log('error of getAllCollection', error);
  }
};
