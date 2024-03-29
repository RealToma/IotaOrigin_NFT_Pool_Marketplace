/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useCollectionIcon } from '@/hooks/useCollectionIcon';
import { useCollectionInfo } from '@/hooks/useCollectionInfo';
import {
  formatBigNumberWithUnits,
  formatNumberWithUnit,
  shortenAddress,
} from '@/utils';
import { LabeledValue } from '@/components/common/LabeledValue';
import cx from 'classnames';
import { IPFS_GATEWAY, IPFS_GATEWAY_TOKEN, tokens } from '@/constants';
import { useSubgraphData } from '@/hooks/useSubgraphData';
import { GET_NFTS_IN_COLLECTION_WITH_IDS } from '@/constants/subgraphQueries';
import NFTDisplay from '@/components/NFTDisplay';
import { erc20ABI, useAccount, useProvider, useSigner } from 'wagmi';
import { NotificationManager } from 'react-notifications';
import { BigNumber, Contract, constants, ethers } from 'ethers';
import POOL_ABI from '@/helpers/contractAbis/lssvmpairAbi.json';
import { erc721ABI } from 'wagmi';
import Button from '@/components/Button';
import { ModalFrame } from '@/components/ModalFrame';
import NFTWallet from '@/components/NFTWallet';
import Link from 'next/link';
import { useTokenPriceContext } from '@/contexts/TokenPriceContext';
import Image from 'next/image';
import { formatUnits } from 'ethers/lib/utils.js';

export default function CollectionDetail() {
  const router = useRouter();
  const { token } = router.query;
  const { data: priceData } = useTokenPriceContext();
  const paymentToken = useMemo(
    () => tokens.filter(item => item.symbol == (token ?? 'SMR'))[0],
    [token]
  );
  const collection: string | undefined = router.query.address as string;

  const { image, type: imageType } = useCollectionIcon(collection);
  const collectionInfo = useCollectionInfo(collection, paymentToken.address);

  const { data: signer } = useSigner();
  const provider = useProvider();
  const { address } = useAccount();

  const [isWalletOpen, setIsWalletOpen] = useState<boolean>(false);
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [buySelected, setBuySelected] = useState<NFTData[]>([]);
  const [sellSelected, setSellSelected] = useState<number[]>([]);
  const [isSelling, setIsSelling] = useState<boolean>(false);
  const [isBuying, setIsBuying] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<BigNumber>(BigNumber.from(0));

  const variables = useMemo(
    () => ({
      collectionAddress: collection,
      ids: collectionInfo?.totalNftIds,
    }),
    [collection, collectionInfo?.totalNftIds]
  );

  const nftsData = useSubgraphData(GET_NFTS_IN_COLLECTION_WITH_IDS, variables);

  const NFTDisplayList = useMemo(() => {
    return nfts ? (
      <NFTDisplay
        nfts={nfts}
        setSelected={tokenIds =>
          setBuySelected(
            nfts.filter((nft: NFTData) => tokenIds.includes(nft.tokenId))
          )
        }
      />
    ) : null;
  }, [nfts]);

  useEffect(() => {
    const calculateTotalPrice = async () => {
      let totalP = BigNumber.from(0);

      if (!signer) {
        if (buySelected.length > 0)
          NotificationManager.error('Please connect your wallet !');
        return;
      }

      for (const nft of buySelected) {
        if (!nft.pool) {
          continue;
        }

        const contract = new ethers.Contract(nft.pool, POOL_ABI, signer);

        const price = (await contract.getBuyNFTQuote(nft.tokenId, 1))
          .inputAmount as BigNumber;

        totalP = totalP.add(price);
      }

      setTotalPrice(totalP);
    };

    calculateTotalPrice();
  }, [buySelected, signer]);

  const sellNfts = useCallback(
    async (nfts: number[]) => {
      if (!signer) {
        NotificationManager.error('Please connect your wallet!');
        return;
      }

      setIsSelling(true);
      for (const nft of nfts) {
        let poolAddress: string = '';
        let maxPrice = BigNumber.from('0');
        for (const pool of collectionInfo.pools) {
          try {
            let tokenBalance;
            if (paymentToken.address == constants.AddressZero) {
              tokenBalance = (await signer.provider!.getBalance(
                pool.address
              )) as BigNumber;
            } else {
              const tokenContract = new ethers.Contract(
                paymentToken.address,
                erc20ABI,
                signer
              );
              tokenBalance = (await tokenContract.balanceOf(
                pool.address
              )) as BigNumber;
            }
            const poolContract = new ethers.Contract(
              pool.address,
              POOL_ABI,
              signer
            );
            const poolType = await poolContract.poolType();
            if (poolType == 1) {
              continue;
            }

            const sellPrice = (await poolContract.getSellNFTQuote(nft, 1))
              .outputAmount as BigNumber;

            if (sellPrice.gt(maxPrice) && tokenBalance.gte(sellPrice)) {
              poolAddress = pool.address;
              maxPrice = sellPrice;
            }
          } catch (err) {
            console.log(err);
          }
        }

        if (!poolAddress?.length) {
          NotificationManager.error("Can't find pool to sell nft");
          setIsWalletOpen(false);
          setIsSelling(false);
          return;
        }

        try {
          const contractErc721 = new ethers.Contract(
            collection,
            erc721ABI,
            signer
          );
          const poolContract = new ethers.Contract(
            poolAddress,
            POOL_ABI,
            signer
          );

          const approval = await contractErc721.getApproved(nft);
          if (approval.toLowerCase() != poolAddress.toLowerCase()) {
            await contractErc721
              .approve(poolAddress, nft)
              .then(async (transaction: any) => await transaction.wait());
          }
          await poolContract
            .swapNFTsForToken(
              [nft],
              maxPrice,
              address,
              false,
              constants.AddressZero
            )
            .then(async (tx: any) => await tx.wait());
          NotificationManager.success('Sold one NFT');
          router.reload();
        } catch (err: any) {
          NotificationManager.error(err?.reason);
        }
      }
      setIsWalletOpen(false);
      setIsSelling(false);
    },
    [
      address,
      collection,
      collectionInfo.pools,
      paymentToken.address,
      router,
      signer,
    ]
  );

  const buyNfts = useCallback(async () => {
    if (!signer) {
      NotificationManager.error('Please connect your wallet!');
      return;
    }

    setIsBuying(true);
    for (const nft of buySelected) {
      if (!nft.pool) {
        continue;
      }

      const contract = new ethers.Contract(nft.pool, POOL_ABI, signer);

      const [
        error,
        newSpotPrice,
        newDelta,
        maxExpectedTokenInput,
        protocolFee,
      ] = await contract.getBuyNFTQuote(nft.tokenId, 1);

      try {
        if (paymentToken.address == constants.AddressZero) {
          const options = { value: maxExpectedTokenInput + '' };

          const tx = await contract.swapTokenForSpecificNFTs(
            [nft.tokenId],
            maxExpectedTokenInput + '',
            address,
            false,
            address,
            options
          );
          await tx.wait();
        } else {
          const tokenContract = new ethers.Contract(
            paymentToken.address,
            erc20ABI,
            signer
          );
          const allowance = await tokenContract.allowance(address, nft.pool);
          if (allowance.lt(maxExpectedTokenInput)) {
            const tx = await tokenContract.approve(
              nft.pool,
              maxExpectedTokenInput
            );
            await tx.wait();
          }

          const tx = await contract.swapTokenForSpecificNFTs(
            [nft.tokenId],
            maxExpectedTokenInput + '',
            address,
            false,
            address
          );
          await tx.wait();
        }
        NotificationManager.success('Purchase successful', '', 3000);
      } catch (error: any) {
        console.log(error?.message);
        NotificationManager.error(error?.message ?? 'Something went wrong.');
        setIsBuying(false);
        return;
      }
    }
    setIsBuying(false);
    router.reload();
  }, [signer, router, buySelected, paymentToken.address, address]);

  const estimateEarnBySell = useMemo(() => {
    let result = 0;
    let nftCount = sellSelected.length;
    let pools = [...collectionInfo.pools];
    pools = pools.filter(
      pool => pool.poolType != 1 && pool.tokenBalance >= pool.sellPrice
    );
    while (nftCount > 0 && pools.length) {
      let maxPrice = 0;
      let sellableCount = 0;
      let maxPoolAddress = '';
      for (const pool of pools) {
        if (Number(pool.sellPrice) > maxPrice) {
          maxPrice = Number(pool.sellPrice);
          maxPoolAddress = pool.address;
          sellableCount = pool.tokenBalance / maxPrice;
        }
      }

      pools = pools.filter(pool => pool.address != maxPoolAddress);
      if (nftCount <= sellableCount) {
        result = result + maxPrice * nftCount;
        nftCount = 0;
      } else {
        result = result + maxPrice * sellableCount;
        nftCount -= sellableCount;
      }
    }

    return result;
  }, [sellSelected, collectionInfo?.pools]);

  const updateNfts = useCallback(async () => {
    if (!nftsData?.nfts || !collection) {
      return;
    }

    const nfts: NFTData[] = [];
    const contract = new Contract(collection, erc721ABI, provider);
    for (const item of nftsData?.nfts ?? []) {
      const uri = await contract.tokenURI(item.identifier);
      const metadataUri = uri.replace('ipfs://', IPFS_GATEWAY)+(IPFS_GATEWAY_TOKEN!=="" && uri.includes('ipfs://')?"?pinataGatewayToken="+IPFS_GATEWAY_TOKEN:"");
      const tokenId = item.identifier;

      if (collectionInfo.allNftIDs.indexOf(tokenId + '') < 0) {
        continue;
      }

      let price = 0;
      let priceUsd = 0;
      let poolAddress: string = '';
      let poolType = 2;
      for (const pool of collectionInfo.pools) {
        if (pool.tokenIds.indexOf(tokenId) >= 0) {
          priceUsd =
            pool.buyPrice * priceData[paymentToken.address.toLowerCase()];
          price = pool.buyPrice;
          poolAddress = pool.address;
          poolType = pool.poolType;
          break;
        }
      }

      if (poolType == 0) {
        continue;
      }

      try {
        const metadata = await fetch(metadataUri).then(res => res.json());
        nfts.push({
          address: collection ?? item.contract.id,
          tokenId,
          imageUrl: metadata?.image?.replace('ipfs://', IPFS_GATEWAY)+(IPFS_GATEWAY_TOKEN!=="" && metadata?.image?.includes('ipfs://')?"?pinataGatewayToken="+IPFS_GATEWAY_TOKEN:""),
          price,
          priceUsd,
          pool: poolAddress,
          paymentToken: paymentToken,
        });
      } catch (err) {
        console.error(err);
      }
    }

    setNfts(nfts);
  }, [
    collection,
    collectionInfo.allNftIDs,
    collectionInfo.pools,
    nftsData?.nfts,
    paymentToken,
    priceData,
    provider,
  ]);
  
  useEffect(() => {
    const timer = setTimeout(() => updateNfts(), 100);

    return () => clearTimeout(timer);
  }, [updateNfts]);

  return (
    <>
      <Head>
        <title>Snip Pool | Collection Details</title>
      </Head>
      <ul className='w-full gap-2 flex flex-wrap text-sm font-medium text-center text-gray-400 py-12 md:py-0'>
        {tokens.map(item => (
          <button
            key={item.name}
            type='button'
            className={cx(
              'inline-block p-4 rounded-t-lg font-bold text-lg',
              (token ?? 'SMR') == item.symbol
                ? 'bg-gray-800 text-blue-500'
                : 'hover:bg-gray-800 hover:text-gray-300'
            )}
            onClick={() =>
              router.push({
                pathname: router.pathname,
                query: {
                  token: item.symbol,
                  address: collection,
                },
              })
            }
          >
            {item.symbol}
          </button>
        ))}
      </ul>
      <div className='text-center bg-white/5 -mx-5 -mt-[50px] py-8 md:mt-0 md:py-0 md:-mx-[50px]'>
        {imageType == 'mp4' ? (
          <video
            className='w-[100px] rounded-md mx-auto my-2'
            autoPlay
            loop
            src={image}
          />
        ) : (
          <img
            className='w-[100px] rounded-md mx-auto my-2'
            src={image}
            alt='Collection Icon'
          />
        )}
        <h1 className='mb-6 text-3xl font-bold text-white md:text-4xl'>
          {collectionInfo.name} ({collectionInfo.symbol})
        </h1>
        <div className='hidden text-3xl text-white md:block'>{collection}</div>
        <div className='text-base text-white md:hidden'>
          {shortenAddress(collection)}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-5 mt-5 w-full max-w-[300px] md:max-w-[1000px] mx-auto'>
          <LabeledValue value={collectionInfo.symbol} label='Ticker' />
          <LabeledValue
            value={
              collectionInfo.floorPrice != undefined
                ? `${formatNumberWithUnit(
                    collectionInfo.floorPrice
                  )} ($${formatNumberWithUnit(
                    collectionInfo.floorPrice *
                      priceData[paymentToken.address.toLowerCase()]
                  )})`
                : '...'
            }
            label='Floor Price'
            icon={
              <Image
                width={18}
                height={18}
                src={`/icons/${paymentToken?.icon}`}
                className='inline mr-1 mt-[-4px]'
                alt='icon'
              />
            }
          />
          <LabeledValue
            value={
              collectionInfo.bestOffer != undefined
                ? `${formatNumberWithUnit(
                    collectionInfo.bestOffer
                  )} ($${formatNumberWithUnit(
                    collectionInfo.bestOffer *
                      priceData[paymentToken.address.toLowerCase()]
                  )})`
                : '...'
            }
            label='Instant Sell Price'
            icon={
              <Image
                width={18}
                height={18}
                src={`/icons/${paymentToken?.icon}`}
                className='inline mr-1 mt-[-4px]'
                alt='icon'
              />
            }
          />
          <LabeledValue
            value={
              collectionInfo?.listings === undefined
                ? '...'
                : collectionInfo?.listings
            }
            label='Listings'
          />
          <LabeledValue
            value={
              collectionInfo.volume != undefined
                ? `${formatNumberWithUnit(
                    collectionInfo.volume
                  )} ($${formatNumberWithUnit(
                    collectionInfo.volume *
                      priceData[paymentToken.address.toLowerCase()]
                  )})`
                : '...'
            }
            label='Volume'
            icon={
              <Image
                width={18}
                height={18}
                src={`/icons/${paymentToken?.icon}`}
                className='inline mr-1 mt-[-4px]'
                alt='icon'
              />
            }
          />
        </div>
      </div>
      <div className='flex flex-col items-center mt-10'>
        {NFTDisplayList}
        <div className='fixed bottom-24 lg:bottom-5 flex flex-col items-center justify-between w-full lg:flex-row px-10 gap-5 lg:gap-0'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-2 w-full md:w-auto'>
            <button
              className='rounded-lg font-semibold text-base p-3  bg-[#1fcec1] disabled:cursor-not-allowed'
              disabled={buySelected.length == 0 || isBuying}
              onClick={() => buyNfts()}
            >
              {isBuying
                ? `Buying ${buySelected.length} NFT${
                    buySelected.length == 1 ? '' : 's'
                  }...`
                : `Buy ${buySelected.length} NFT${
                    buySelected.length == 1 ? '' : 's'
                  }: ${formatBigNumberWithUnits(totalPrice)} ${
                    paymentToken.symbol
                  } ($${formatNumberWithUnit(
                    +formatUnits(totalPrice, paymentToken.decimals) *
                      priceData[paymentToken.address.toLowerCase()]
                  )})`}
            </button>
            <button
              className='rounded-lg font-semibold text-base p-3  bg-[#1fcec1] disabled:cursor-not-allowed'
              onClick={() => setIsWalletOpen(true)}
              disabled={!collectionInfo}
            >
              {collectionInfo?.bestOffer
                ? `Sell 1 NFT: ${formatNumberWithUnit(
                    collectionInfo.bestOffer
                  )} ${paymentToken.symbol} ($${formatNumberWithUnit(
                    collectionInfo.bestOffer *
                      priceData[paymentToken.address.toLowerCase()]
                  )})`
                : 'Sell is not available'}
            </button>
          </div>
          {/* <div className='inline-block w-[5px]'></div> */}
          <Link
            href={`/CreatePool?nft=${collection}&token=${paymentToken.address}`}
            className='rounded-lg font-semibold text-base p-3 bg-[#1fcec1] disabled:cursor-not-allowed max-w-xs w-full text-center'
          >
            List NFT
          </Link>
        </div>
      </div>
      <ModalFrame
        isOpen={isWalletOpen}
        title='Your Wallet'
        close={() => setIsWalletOpen(false)}
      >
        {address ? (
          <NFTWallet setSelected={setSellSelected} collection={collection} />
        ) : (
          <div className='text-red-600'>Please connect your wallet</div>
        )}
        <div className='flex flex-col justify-center gap-2 md:flex-row'>
          <Button
            enabled={sellSelected.length > 0 && !isSelling}
            onClick={() => sellNfts(sellSelected)}
          >
            {isSelling
              ? `Selling ${sellSelected.length} NFT${
                  sellSelected.length == 1 ? '' : 's'
                }...`
              : `Sell ${sellSelected.length} NFT${
                  sellSelected.length == 1 ? '' : 's'
                }: ${formatNumberWithUnit(estimateEarnBySell)} ${
                  paymentToken.symbol
                } ($${formatNumberWithUnit(
                  estimateEarnBySell *
                    priceData[paymentToken.address.toLowerCase()]
                )})`}
          </Button>
          <Link
            href={`/CreatePool?nft=${collection}&token=${paymentToken.address}`}
            className='rounded-lg font-semibold text-[22px] text-center p-3 bg-[#1fcec1] w-full max-w-[300px] mx-auto mt-4 disabled:opacity-40 disabled:cursor-not-allowed'
          >
            List NFT
          </Link>
        </div>
      </ModalFrame>
    </>
  );
}
