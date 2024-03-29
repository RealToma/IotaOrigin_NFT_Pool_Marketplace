/* eslint-disable @next/next/no-img-element */
import { FC, useCallback, useState, useContext } from 'react';
import Image from 'next/image';
import cx from 'classnames';
import { NotificationManager } from 'react-notifications';
import { IPFS_GATEWAY } from '@/constants';
import { useNFTApprove } from '@/hooks/useNFTApprove';
import ChainContext from '@/contexts/ChainContext';

interface Props {
  nftData: NFTData;
  selected: boolean;
  triggerSelect: (tokenId: string) => void;
}

export const NFTCard: FC<Props> = ({ nftData, selected, triggerSelect }) => {
  const [waiting, setWaiting] = useState<boolean>(false);
  const { collectionSwapAddress } = useContext(
    ChainContext
  ) as ChainContextType;
  const { allowed, approve, refetch } = useNFTApprove(
    nftData.address,
    nftData.tokenId,
    collectionSwapAddress
  );

  // const handleTrigger = useCallback(async () => {
  //   if (!allowed) {
  //     try {
  //       setWaiting(true);
  //       const tx = (await approve())!;
  //       await tx.wait();
  //       refetch();
  //     } catch (err: any) {
  //       console.log(err);
  //       NotificationManager.error(
  //         err?.reason ?? err?.message,
  //         'Approving failed',
  //         10000
  //       );
  //       return;
  //     } finally {
  //       setWaiting(false);
  //     }
  //   }

  //   triggerSelect(nftData.tokenId);
  // }, [allowed, triggerSelect, nftData.tokenId, approve, refetch]);

  return (
    <div
      className={cx(
        'relative w-[175px] rounded-md border-[1px] cursor-pointer p-2 flex flex-col items-start gap-2',
        selected ? 'border-[#1fcec1]' : 'border-slate-600'
      )}
      onClick={() => triggerSelect(nftData.tokenId)}
    >
      <Image
        width={175}
        height={250}
        src={nftData.imageUrl?.replace('ipfs://', IPFS_GATEWAY!)}
        alt='NFT Image'
        className='rounded-md'
      />
      <p className='text-white'>#{nftData.tokenId}</p>
      {waiting && (
        <div className='absolute top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-opacity-50 bg-slate-600'>
          <img src='/loading.gif' width={26} alt='loading-spinner' />
        </div>
      )}
    </div>
  );
};
