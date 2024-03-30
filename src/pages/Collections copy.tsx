/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { useEffect, useState, useContext, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { Box } from '@mui/material';
import { useCollectionIcon } from '@/hooks/useCollectionIcon';
import {
  GET_ALL_COLLECTIONS,
  GET_COLLECTION_DEFAULT_IMAGE,
} from '@/constants/subgraphQueries';
import { formatUnits } from 'ethers/lib/utils.js';
import Head from 'next/head';
import { FaExclamationCircle, FaQuestion, FaTimes } from 'react-icons/fa';
import { FaArrowDownLong, FaArrowUpLong } from 'react-icons/fa6';
import ChainContext from '@/contexts/ChainContext';
import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';
import { useTokenPriceContext } from '@/contexts/TokenPriceContext';
import { Contract, constants } from 'ethers';
import { formatNumberWithUnit } from '@/utils';
import { useRouter } from 'next/router';
import { IPFS_GATEWAY, IPFS_GATEWAY_TOKEN, tokens } from '@/constants';
import cx from 'classnames';
import LoadingEffectMain from '@/components/Loading/LoadingEffectMain';
import { Skeleton } from '@mui/material';
import { StatsContext } from '@/contexts/StatsContext';
import { erc721ABI, useNetwork, useProvider } from 'wagmi';
import filetype from 'magic-bytes.js';

const CollectionRow = ({ collection }: any) => {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(-1);
  const handleImageLoad = (val: any) => {
    setImageLoaded(val);
  };

  const { image: imageUri, type: imageType }: any = useCollectionIcon(
    collection.id
  );

  const { setEachCollection }: any = useContext(StatsContext);

  const handleSetCollectionInfo = () => {
    // collection.imageUri = imageUri;
    // collection.imageType = imageType;
    // console.log('collection:', collection);

    // setEachCollection(collection);

    router.push({
      pathname: `/collection/${collection.id}`,
    });
  };

  return (
    <tr className='cursor-pointer hover:bg-gray-800 transition duration-300 ease-in-out'>
      <td className='p-4 border-b border-gray-950 max-w-[200px] lg:max-w-auto md:relative'>
        {/* <Link href={`/collection/${collection.id}`}> */}
        <div
          onClick={() => {
            handleSetCollectionInfo();
          }}
        >
          <div className='grid grid-cols-[auto_1fr] items-center gap-3'>
            <div className='relative overflow-hidden flex justify-center items-center'>
              {/* {!imageLoaded && ( */}
              <Skeleton
                variant='rounded'
                width={32}
                height={32}
                sx={{ bgcolor: 'grey.900' }}
                style={{ borderRadius: 4 }}
              />
              {/* )} */}
              {/* {imageType ? ( */}
              {/* {!imageType ? <FaQuestion className='w-8 h-8 text-slate-300' />:<></>} */}
              {imageType === 'mp4' ? (
                <video
                  className={
                    'mx-auto rounded-md w-8 h-8 absolute top-0 left-0 ' +
                    (imageLoaded === 1 ? '' : 'opacity-0')
                  }
                  autoPlay
                  loop
                  src={imageUri}
                  onLoad={() => {
                    handleImageLoad(1);
                  }}
                  // onError={() => alert(1)}
                />
              ) : (
                <img
                  className={
                    'mx-auto rounded-md w-8 h-8 absolute top-0 left-0 ' +
                    (imageLoaded === 1 ? '' : 'opacity-0')
                  }
                  src={imageUri}
                  onLoad={() => {
                    handleImageLoad(1);
                  }}
                  // onError={() => alert(1)}
                  alt=''
                />
              )}
              {/* ) : (
                <FaQuestion className='w-8 h-8 text-slate-300' />
              )} */}
            </div>
            <p className='block antialiased font-sans text-sm leading-normal text-gray-100 font-bold overflow-hidden whitespace-nowrap text-ellipsis'>
              {collection.name}
            </p>
          </div>
        </div>
        {/* </Link> */}
      </td>
      <td className='p-4 border-b border-gray-950'>
        <p className='block antialiased font-sans text-sm leading-normal text-gray-100 font-normal'>
          {collection?.bestOffer != undefined
            ? formatNumberWithUnit(collection.bestOffer)
            : '-'}
        </p>
      </td>
      <td className='p-4 border-b border-gray-950'>
        <p className='block antialiased font-sans text-sm leading-normal text-gray-100 font-normal'>
          {collection?.floorPrice != undefined
            ? formatNumberWithUnit(collection.floorPrice)
            : '-'}
        </p>
      </td>
      <td className='p-4 border-b border-gray-950'>
        <p className='block antialiased font-sans text-sm leading-normal text-gray-100 font-normal'>
          {collection?.volume != undefined
            ? formatNumberWithUnit(collection.volume)
            : '...'}
        </p>
      </td>
      <td className='p-4 border-b border-gray-950'>
        <p className='block antialiased font-sans text-sm leading-normal text-gray-100 font-normal'>
          {collection.listings}
        </p>
      </td>
    </tr>
  );
};

type SortOption = 'name' | 'market' | 'price' | 'volume' | 'listings';

export default function Collections() {
  const { chain } = useNetwork();

  const router = useRouter();
  const provider = useProvider();
  const { token } = router.query;
  const paymentToken = useMemo(
    () => tokens.filter(item => item.symbol == (token ?? 'TOTAL'))[0],
    [token]
  );
  const [offset, setOffset] = useState<number>(0);
  const [limit, setLimit] = useState<number>(10);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadedAll, setIsLoadedAll] = useState<boolean>(false);

  const { lawCollections, setLawCollections }: any = useContext(StatsContext);
  const [advertise, setAdvertise] = useState<boolean>(false);
  const { subgraphClient } = useContext(ChainContext) as ChainContextType;
  const { data: priceData } = useTokenPriceContext();

  const [sortOption, setSortOption] = useState<SortOption>('listings');
  const [sortDirect, setSortDirect] = useState<boolean>(true);

  const collections = useMemo(
    () =>
      lawCollections.map((collection: any) => {
        const pairs = (collection.pairs ?? []).filter(
          (pair: any) =>
            !paymentToken?.address ||
            (pair.token?.id ?? constants.AddressZero) ==
              paymentToken.address.toLowerCase()
        );
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
        const listings = pairs.reduce(
          (prev: number, pair: any) => prev + parseInt(pair.numNfts),
          0
        );
        let bestOffer = undefined;
        let floorPrice = undefined;
        for (const pair of pairs) {
          const pairToken = tokens.filter(
            item => item.address.toLowerCase() == pair?.token?.id
          )[0];
          const pairPrice =
            +formatUnits(pair.spotPrice, pairToken?.decimals ?? 18) *
            priceData[pair.token?.id ?? constants.AddressZero];
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

        return {
          id: collection.id,
          name: collection.name,
          symbol: collection.symbol,
          volume: totalVolume,
          listings: listings,
          bestOffer,
          floorPrice: floorPrice ? floorPrice * 1.1 : undefined,
        } as PoolData;
      }),
    [lawCollections, paymentToken?.address, priceData]
  );

  const sorted = useMemo(() => {
    if (sortOption == 'name') {
      return collections.sort((a: any, b: any) =>
        sortDirect ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      );
    }
    if (sortOption == 'market') {
      return collections.sort((a: any, b: any) =>
        !sortDirect
          ? (a.bestOffer ?? 0) - (b.bestOffer ?? 0)
          : (b.bestOffer ?? 0) - (a.bestOffer ?? 0)
      );
    }
    if (sortOption == 'price') {
      return collections.sort((a: any, b: any) =>
        !sortDirect
          ? (a.floorPrice ?? 0) - (b.floorPrice ?? 0)
          : (b.floorPrice ?? 0) - (a.floorPrice ?? 0)
      );
    }
    if (sortOption == 'volume') {
      return collections.sort((a: any, b: any) =>
        !sortDirect
          ? (a.volume ?? 0) - (b.volume ?? 0)
          : (b.volume ?? 0) - (a.volume ?? 0)
      );
    }
    if (sortOption == 'listings') {
      return collections.sort((a: any, b: any) =>
        !sortDirect ? a.listings - b.listings : b.listings - a.listings
      );
    }

    return collections;
  }, [collections, sortDirect, sortOption]);

  const handleSortChange = useCallback(
    (option: SortOption) => {
      if (sortOption == option) {
        setSortDirect(!sortDirect);
      } else {
        setSortOption(option);
        setSortDirect(true);
      }
    },
    [sortDirect, sortOption]
  );

  // const fetchCollectionIcon = async (collectionAddress: any) => {
  //   try {
  //     // console.log('collectionAddress:', collectionAddress);
  //     const variables = {
  //       collectionAddress: collectionAddress?.toLowerCase(),
  //     };
  //     // console.log('variables:', variables);

  //     const responseCollectionImage: any = await (
  //       subgraphClient as ApolloClient<NormalizedCacheObject>
  //     ).query({
  //       query: GET_COLLECTION_DEFAULT_IMAGE,
  //       variables,
  //     });

  //     // console.log('responseCollectionImage:', responseCollectionImage);
  //     let data: any = responseCollectionImage.data;

  //     // console.log('data:', data);
  //     if (!data?.nfts || !data?.nfts?.length) {
  //       return;
  //     }

  //     if (!data?.nfts?.length || !collectionAddress) {
  //       return;
  //     }

  //     const contract = new Contract(collectionAddress, erc721ABI, provider);
  //     const uri = await contract.tokenURI(data?.nfts[0]?.identifier);

  //     // console.log('uri:', uri);
  //     const metadataUri =
  //       uri.replace('ipfs://', IPFS_GATEWAY) +
  //       (IPFS_GATEWAY_TOKEN !== '' && uri.includes('ipfs://')
  //         ? '?pinataGatewayToken=' + IPFS_GATEWAY_TOKEN
  //         : '');

  //     const metadata = await fetch(metadataUri)
  //       .then(res => res.json())
  //       .catch(err => {
  //         return undefined;
  //       });

  //     let assetUri =
  //       metadata?.image?.replace('ipfs://', IPFS_GATEWAY) +
  //       (IPFS_GATEWAY_TOKEN !== '' && metadata?.image?.includes('ipfs://')
  //         ? '?img-width=50&pinataGatewayToken=' + IPFS_GATEWAY_TOKEN
  //         : '?img-width=50');

  //     // console.log('assetUri:', assetUri);

  //     const responseAssetURI: any = await fetch(assetUri).catch(err => {
  //       return undefined;
  //     });

  //     console.log('responseAssetURI:', responseAssetURI);

  //     // console.log('responseAssetURI:', responseAssetURI);
  //     const buffer = await responseAssetURI.arrayBuffer();

  //     var uint8View = new Uint8Array(buffer);
  //     const type = filetype(uint8View);
  //     console.log('type:', type);
  //     // const { typename } = type[0];
  //     return [assetUri, 'png'];

  //     // try {
  //     //   const metadata: any = await (await fetch(metadataUri)).json();
  //     //   let assetUri =
  //     //     metadata?.image?.replace('ipfs://', IPFS_GATEWAY) +
  //     //     (IPFS_GATEWAY_TOKEN !== '' && metadata?.image?.includes('ipfs://')
  //     //       ? '?img-width=50&pinataGatewayToken=' + IPFS_GATEWAY_TOKEN
  //     //       : '?img-width=50');

  //     //   // console.log('assetUri:', assetUri);

  //     //   const responseAssetURI = await fetch(assetUri);

  //     //   // console.log('responseAssetURI:', responseAssetURI);
  //     //   const buffer = await responseAssetURI.arrayBuffer();

  //     //   var uint8View = new Uint8Array(buffer);
  //     //   const type = filetype(uint8View);
  //     //   const { typename } = type[0];
  //     //   return [assetUri, typename];
  //     //   // Proceed with the code that follows after successful retrieval of metadata
  //     // } catch (error) {
  //     //   console.error('An error occurred:', error);
  //     //   return [undefined, undefined];
  //     //   // Add code here to handle the error or skip to the next block of code
  //     // }
  //     // return ['', ''];
  //   } catch (error) {
  //     console.log('error of fetchCollectionIcon:', error);
  //   }
  // };

  const fetchCollections = useCallback(async () => {
    if (isLoadedAll || Object.keys(priceData).length == 0) {
      return;
    }
    try {
      setIsLoading(true);
      const response = await (
        subgraphClient as ApolloClient<NormalizedCacheObject>
      ).query({
        query: GET_ALL_COLLECTIONS,
        variables: {
          // first: limit,
          // skip: offset,
          filter: '',
        },
      });

      // let tempResponse = await getAllCollection(
      //   provider,
      //   chain,
      //   token,
      //   priceData
      // );
      // setLawCollections(tempResponse);
      // console.log('tempResponse:', response);

      if (response?.data?.collections?.length < 10) {
        setIsLoadedAll(true);
      }

      // setLawCollections([
      //   ...lawCollections,
      //   ...(response?.data?.collections ?? []),
      // ]);
      // setOffset(offset + limit);

      // console.log('response?.data?.collections:', response?.data?.collections);
      // const arrayCollectionInfo: any = [];
      // await Promise.all(
      //   response?.data?.collections.map(async (collection: any, index: any) => {
      //     const pairs = (collection.pairs ?? []).filter(
      //       (pair: any) =>
      //         !paymentToken?.address ||
      //         (pair.token?.id ?? constants.AddressZero) ==
      //           paymentToken.address.toLowerCase()
      //     );

      //     // console.log("pairs:", pairs)
      //     const totalVolume = pairs.reduce((prev: number, pair: any) => {
      //       const pairToken = tokens.filter(
      //         item => item.address.toLowerCase() == pair?.token?.id
      //       )[0];
      //       return (
      //         prev +
      //         parseFloat(formatUnits(pair.volume, pairToken?.decimals ?? 18)) *
      //           priceData[pair?.token?.id]
      //       );
      //     }, 0);

      //     // console.log("totalVolume:", totalVolume)
      //     const listings = pairs.reduce(
      //       (prev: number, pair: any) => prev + parseInt(pair.numNfts),
      //       0
      //     );

      //     // console.log("listings:", listings)
      //     let bestOffer = undefined;
      //     let floorPrice = undefined;
      //     for (const pair of pairs) {
      //       const pairToken = tokens.filter(
      //         item => item.address.toLowerCase() == pair?.token?.id
      //       )[0];
      //       const pairPrice =
      //         +formatUnits(pair.spotPrice, pairToken?.decimals ?? 18) *
      //         priceData[pair.token?.id ?? constants.AddressZero];
      //       const tokenBalance = +formatUnits(
      //         pair.balance ?? '0',
      //         pairToken?.decimals ?? 18
      //       );
      //       if (pair.type != '1') {
      //         if (!bestOffer) {
      //           bestOffer = pairPrice;
      //         } else if (pairPrice > bestOffer) {
      //           bestOffer = pairPrice;
      //         }
      //       }
      //       if (pair.type != '0' && tokenBalance >= pairPrice) {
      //         if (!floorPrice) {
      //           floorPrice = pairPrice;
      //         } else if (pairPrice < floorPrice) {
      //           floorPrice = pairPrice;
      //         }
      //       }
      //     }

      //     // const [imageUri, imageType]: any = await fetchCollectionIcon(
      //     //   collection.id
      //     // );

      //     let eachCollectionData = {
      //       id: collection.id,
      //       name: collection.name,
      //       // imageUri: imageUri,
      //       // imageType: imageType,
      //       symbol: collection.symbol,
      //       volume: totalVolume,
      //       listings: listings,
      //       bestOffer,
      //       floorPrice: floorPrice ? floorPrice * 1.1 : undefined,
      //     };

      //     arrayCollectionInfo.push(eachCollectionData);
      //   })
      // );

      // console.log('arrayCollectionInfo:', arrayCollectionInfo);
      setLawCollections(response?.data?.collections);
    } catch (err) {
      console.log('error of fetching collection:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isLoadedAll, priceData, setLawCollections, subgraphClient]);
  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  // useEffect(() => {
  //   console.log('isLoading:', isLoading);
  // });

  // const handleScroll = useCallback(() => {
  //   if (
  //     window.innerHeight + document.documentElement.scrollTop !==
  //       document.documentElement.offsetHeight ||
  //     isLoading ||
  //     isLoadedAll
  //   ) {
  //     return;
  //   }
  //   fetchCollections();
  // }, [fetchCollections, isLoading, isLoadedAll]);

  // useEffect(() => {
  //   if (typeof window == 'undefined') {
  //     return;
  //   }
  //   window.addEventListener('scroll', handleScroll, { passive: true });

  //   return () => {
  //     window.removeEventListener('scroll', handleScroll);
  //   };
  // }, [handleScroll]);

  return (
    <>
      <Head>
        <title>Snip Pool | Collections</title>
      </Head>
      <ul className='w-full gap-2 flex flex-wrap text-sm font-medium text-center border-b border-slate-800 text-gray-400'>
        <button
          type='button'
          className={cx(
            'inline-block p-4 rounded-t-lg font-bold text-lg',
            (token ?? 'TOTAL') == 'TOTAL'
              ? 'bg-gray-800 text-blue-500'
              : 'hover:bg-gray-800 hover:text-gray-300'
          )}
          onClick={() =>
            router.push({
              pathname: router.pathname,
              query: {
                ...router.query,
                token: 'TOTAL',
              },
            })
          }
        >
          Total
        </button>
        {tokens.map(item => (
          <button
            key={item.name}
            type='button'
            className={cx(
              'inline-block p-4 rounded-t-lg font-bold text-lg',
              (token ?? 'TOTAL') == item.symbol
                ? 'bg-gray-800 text-blue-500'
                : 'hover:bg-gray-800 hover:text-gray-300'
            )}
            onClick={() =>
              router.push({
                pathname: router.pathname,
                query: {
                  ...router.query,
                  token: item.symbol,
                },
              })
            }
          >
            {item.symbol}
          </button>
        ))}
      </ul>
      {isLoading ? (
        <LoadingEffectMain text={'Loading'} />
      ) : (
        <div className='text-center'>
          {advertise && (
            <div className='flex flex-col lg:flex-row items-center justify-between px-5 py-3.5 mt-4 mb-6 rounded-2xl bg-[#f9ded2]'>
              <div className='flex items-center gap-1'>
                <FaExclamationCircle />
                <div className='text-base font-medium'>
                  You like Snippool? Support us by purchasing an NFT{' '}
                  <span className='font-bold'>
                    <Link
                      href='https://soonaverse.com/nft/0xc246549ad52d98f76452f67b3c34d6c7c33e224d'
                      target='blank'
                    >
                      here
                    </Link>
                  </span>{' '}
                  and be part of the future of snippool.xyz!
                </div>
              </div>
              <div
                className='flex items-center ml-4 text-sm cursor-pointer'
                onClick={() => setAdvertise(false)}
              >
                <div className='mr-2 font-semibold text-xxs whitespace-nowrap'>
                  I understand
                </div>
                <FaTimes />
              </div>
            </div>
          )}
          <TextTitle01>Next Gen collections</TextTitle01>
          <div>
            <div className='flex w-full items-center justify-center'>
              <div className='w-full p-6 overflow-auto px-0'>
                <table className='w-full min-w-max table-auto text-left'>
                  <thead>
                    <tr>
                      <th className='border-y border-gray-900 bg-gray-950/50 p-4'>
                        <p
                          className='flex items-center antialiased font-sans text-md text-white font-normal leading-none cursor-pointer'
                          onClick={() => handleSortChange('name')}
                        >
                          Collection
                          {sortOption == 'name' &&
                            (sortDirect ? (
                              <FaArrowDownLong className='w-3 h-3 ms-2' />
                            ) : (
                              <FaArrowUpLong className='w-3 h-3 ms-2' />
                            ))}
                        </p>
                      </th>
                      <th className='border-y border-gray-900 bg-gray-950/50 p-4'>
                        <p
                          className='flex items-center antialiased font-sans text-md text-white font-normal leading-none cursor-pointer'
                          onClick={() => handleSortChange('market')}
                        >
                          Market Price ($)
                          {sortOption == 'market' &&
                            (sortDirect ? (
                              <FaArrowDownLong className='w-3 h-3 ms-2' />
                            ) : (
                              <FaArrowUpLong className='w-3 h-3 ms-2' />
                            ))}
                        </p>
                      </th>
                      <th className='border-y border-gray-900 bg-gray-950/50 p-4'>
                        <p
                          className='flex items-center antialiased font-sans text-md text-white font-normal leading-none cursor-pointer'
                          onClick={() => handleSortChange('price')}
                        >
                          Floor Price ($)
                          {sortOption == 'price' &&
                            (sortDirect ? (
                              <FaArrowDownLong className='w-3 h-3 ms-2' />
                            ) : (
                              <FaArrowUpLong className='w-3 h-3 ms-2' />
                            ))}
                        </p>
                      </th>
                      <th className='border-y border-gray-900 bg-gray-950/50 p-4'>
                        <p
                          className='flex items-center antialiased font-sans text-md text-white font-normal leading-none cursor-pointer'
                          onClick={() => handleSortChange('volume')}
                        >
                          Volume ($)
                          {sortOption == 'volume' &&
                            (sortDirect ? (
                              <FaArrowDownLong className='w-3 h-3 ms-2' />
                            ) : (
                              <FaArrowUpLong className='w-3 h-3 ms-2' />
                            ))}
                        </p>
                      </th>
                      <th className='border-y border-gray-900 bg-gray-950/50 p-4'>
                        <p
                          className='flex items-center antialiased font-sans text-md text-white font-normal leading-none cursor-pointer'
                          onClick={() => handleSortChange('listings')}
                        >
                          Listings
                          {sortOption == 'listings' &&
                            (sortDirect ? (
                              <FaArrowDownLong className='w-3 h-3 ms-2' />
                            ) : (
                              <FaArrowUpLong className='w-3 h-3 ms-2' />
                            ))}
                        </p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {sorted.map((collection: any) => (
                      <CollectionRow
                        key={collection.id}
                        collection={collection}
                      />
                    ))}
                    {/* {isLoading && (
                    <tr>
                      <td colSpan={10} className='p-4 border-b border-gray-950'>
                        <div className='flex items-center gap-3'>
                          <p className='block antialiased font-sans text-sm leading-normal text-gray-100 font-bold'>
                            Loading ...
                          </p>
                        </div>
                      </td>
                    </tr>
                  )} */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

const TextTitle01 = styled(Box)`
  color: white;
  font-weight: 600;
  font-size: min(52px, 6vw);
  margin-top: 120px auto 50px auto;
  text-transform: capitalize;
  text-align: center;

  background: linear-gradient(to top right, #fff 0%, #1fcec1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
