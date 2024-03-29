/* eslint-disable @next/next/no-img-element */
import { useMemo, useState, useEffect, useCallback } from 'react';
import { IPFS_GATEWAY, tokens } from '@/constants';
import ChainContext from '@/contexts/ChainContext';
import {
  formatBigNumberWithUnits,
  formatNumberWithUnit,
  shortenAddress,
} from '@/utils';
import Image from 'next/image';
import AddressField from '@/components/common/AddressField';
import { Contract, constants } from 'ethers';
import { useSubgraphData } from '@/hooks/useSubgraphData';
import { GET_NFTS_IN_COLLECTION_WITH_IDS } from '@/constants/subgraphQueries';
import { formatUnits } from 'ethers/lib/utils.js';
import { useTokenPriceContext } from '@/contexts/TokenPriceContext';
import Button from '../Button';
import { erc721ABI, useContract, useProvider, useSigner } from 'wagmi';
import POOL_ABI from '@/helpers/contractAbis/lssvmpairAbi.json';

export const NFTInPool = ({
  tokenId,
  collection,
  pair,
}: {
  tokenId: string;
  collection: string;
  pair: any;
}) => {
  const [image, setImage] = useState<string>();
  const tokenData = useSubgraphData(GET_NFTS_IN_COLLECTION_WITH_IDS, {
    collectionAddress: collection,
    ids: [tokenId],
  });

  const { data: priceData } = useTokenPriceContext();

  const paymentToken = useMemo(
    () =>
      tokens.filter(
        token =>
          token.address.toLowerCase() ==
          (pair?.token?.id ?? constants.AddressZero)
      )[0],
    [pair]
  );

  const { data: signer } = useSigner();
  const provider = useProvider();
  const pairContract = useContract({
    address: pair.id,
    abi: POOL_ABI,
    signerOrProvider: signer,
  });

  useEffect(() => {
    const nftContract = new Contract(collection, erc721ABI, provider);
    if (tokenData?.nfts?.length) {
      (async () => {
        const uri = await nftContract.tokenURI(tokenData?.nfts[0]?.identifier);
        const metadataUri = uri.replace('ipfs://', IPFS_GATEWAY);
        try {
          const metadata = await fetch(metadataUri).then(res => res.json());
          setImage(metadata?.image?.replace('ipfs://', IPFS_GATEWAY));
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [collection, provider, tokenData?.nfts]);

  const handleBuy = useCallback(async () => {
    if (!pairContract) {
      return;
    }
  }, [pairContract]);

  return (
    <div className='inline-block m-1 align-top bg-black/50 hover:bg-white/10'>
      <div className='relative border-[1px] rounded-md text-center p-2 cursor-pointer border-[#444] hover:border-[#BBF]'>
        <img
          src={image + '?img-width=175'}
          className='w-full bg-white/10 mb-2 mx-auto max-w-[100%] rounded'
          alt='NFT image'
          loading='lazy'
        />
        <div className='w-full text-[#BBB] text-[12px] text-left overflow-hidden whitespace-nowrap text-ellipsis'>
          # {tokenId}
        </div>
        <div className='text-white font-bold text-[16px] text-center my-1'>
          {collection ? <AddressField address={collection} /> : ''}
        </div>
        <div className='bg-[#282828] rounded-md text-right px-3 py-2 flex justify-between items-center'>
          <button
            type='button'
            className='rounded-lg font-semibold text-sm py-1 px-4 bg-[#1fcec1] disabled:opacity-40 disabled:cursor-not-allowed'
          >
            Buy
          </button>
          <div className='text-[#BBB] font-bold text-[16px]'>
            <Image
              width={18}
              height={18}
              src={`/icons/${paymentToken?.icon ?? 'smr.svg'}`}
              className='inline mr-1 mt-[-4px]'
              alt='native-coin'
            />
            {formatNumberWithUnit(
              pair?.spotPrice * priceData[paymentToken.address.toLowerCase()]
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
