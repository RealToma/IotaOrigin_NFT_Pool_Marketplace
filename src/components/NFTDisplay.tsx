/* eslint-disable @next/next/no-img-element */
import { useContext, useEffect, useState } from 'react';
import { IPFS_GATEWAY, IPFS_GATEWAY_TOKEN } from '@/constants';
import ChainContext from '@/contexts/ChainContext';
import {
  formatBigNumberWithUnits,
  formatNumberWithUnit,
  shortenAddress,
} from '@/utils';
import Image from 'next/image';
import AddressField from './common/AddressField';

const NFT = ({
  image,
  collection,
  tokenId,
  price,
  priceUsd,
  onClick,
  selected,
  paymentToken,
}: {
  image: string | undefined;
  collection: string | undefined;
  tokenId: string;
  price: number | undefined;
  priceUsd: number | undefined;
  onClick?: Function;
  selected: boolean;
  paymentToken?: PaymentToken;
}) => {
  return (
    <div
      className={
        'inline-block m-1 align-top bg-black/50 ' +
        (selected ? ' bg-white/10 ' : '')
      }
      onClick={() => (onClick ? onClick() : null)}
    >
      <div
        className={
          'border-[1px] rounded-md text-center p-2 cursor-pointer ' +
          (selected ? ' border-[#BBF]' : ' border-[#444]')
        }
      >
        <img
          src={image?.replace('ipfs://', IPFS_GATEWAY!) + (IPFS_GATEWAY_TOKEN!=="" && image?.includes(IPFS_GATEWAY)?"&img-width=200":"?img-width=200")}
          className='w-full bg-white/10 mb-2 mx-auto max-w-[100%] rounded'
          alt='NFT image'
          loading='lazy'
        />
        <div className='w-full text-[#BBB] text-[12px] text-left overflow-hidden whitespace-nowrap text-ellipsis'>
          # {tokenId}
        </div>
        <div className='text-white font-bold text-[12px] text-center my-1'>
          {collection ? <AddressField address={collection} /> : ''}
        </div>
        {price ? (
          <div className='bg-[#282828] rounded-md text-right px-3 py-1'>
            <div className='text-[#BBB] font-bold text-[16px]'>
              <Image
                width={18}
                height={18}
                src={`/icons/${paymentToken?.icon}`}
                className='inline mr-1 mt-[-4px]'
                alt='icon'
              />
              {formatNumberWithUnit(price)} ( $
              {formatNumberWithUnit(priceUsd ?? 0)})
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default function NFTDisplay({
  nfts,
  setSelected,
}: {
  nfts?: NFTData[];
  setSelected?: (value: any[]) => void;
}) {
  let [selected, setSelectedLocal] = useState<string[]>([]);

  useEffect(() => {
    if (setSelected) {
      setSelected(selected);
    }
  }, [selected, setSelected]);

  const toggleSelection = (tokenId: string) => {
    if (setSelected) {
      if (selected.includes(tokenId)) {
        setSelectedLocal(
          selected.filter((tokenId2: string) => tokenId2 !== tokenId)
        );
      } else {
        setSelectedLocal([tokenId, ...selected]);
      }
    }
  };

  return (
    <div className='grid grid-cols-2 text-white md:grid-cols-4 xl:grid-cols-6'>
      {nfts
        ? nfts.map((nft, index) => (
            <NFT
              price={nft.price}
              priceUsd={nft.priceUsd}
              tokenId={nft.tokenId}
              collection={nft.address}
              image={nft.imageUrl}
              key={index}
              onClick={() => toggleSelection(nft.tokenId)}
              selected={selected.includes(nft.tokenId)}
              paymentToken={nft.paymentToken}
            />
          ))
        : 'loading ...'}
    </div>
  );
}
