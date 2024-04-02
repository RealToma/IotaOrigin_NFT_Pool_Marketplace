import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import abiCollectionSwap from '@/helpers/contractAbis/collectionswapAbi.json';
import {
  useSigner,
  useContract,
  useAccount,
  useProvider,
  useNetwork,
} from 'wagmi';
import { constants, ethers } from 'ethers';
import { ValueBox } from '@/components/common/ValueBox';
import { NotificationManager } from 'react-notifications';
import formatTokenAmount from '@/utils/formatTokenAmount';
import TransactionDialog from '@/components/TransactionDialog';
import ChainContext from '@/contexts/ChainContext';
import { MdAddBox } from 'react-icons/md';
import Head from 'next/head';
import { useSubgraphData } from '@/hooks/useSubgraphData';
import { GET_MY_PAIRS } from '@/constants/subgraphQueries';
import { useRouter } from 'next/router';
import { tokens } from '@/constants';

const Pool = ({ each, close }: { each: any; close: Function }) => {
  const [isOpen, setIsOpen] = useState(false);

  const paymentToken = useMemo(
    () =>
      tokens.filter(
        token =>
          token.address.toLowerCase() ==
          (each.token?.id ?? constants.AddressZero)
      )[0],
    [each]
  );

  console.log(each.token);

  const data: Array<{ name: string; value: string }> = [
    { name: 'Pool Address', value: each.id },
    { name: 'NFT Address', value: each.collection.id },
    {
      name: 'Token Liquidity',
      value: formatTokenAmount(each.balance) + ' ' + paymentToken?.symbol,
    },
    {
      name: 'NFT Liquidity',
      value:
        each.asAccount.nfts.length +
        ' NFT' +
        (each.asAccount.nfts.length == 1 ? '' : 's'),
    },
  ];

  return (
    <div className='inline-block w-full p-3 rounded'>
      <ValueBox
        collection={each.collection.id || ''}
        title={'Pool #' + each.pairToken.tokenId}
        buttonTitle='Close Pool'
        buttonOnClick={() => setIsOpen(true)}
        data={data}
      />
      <ClosePoolTransactionDialog
        isOpen={isOpen}
        closePool={close}
        closeDialog={() => setIsOpen(false)}
      />
    </div>
  );
};

function logError(error: any) {
  let errorMessage = error.toString();
  if (errorMessage.includes('user rejected transaction')) {
    errorMessage = 'You rejected the transaction.';
  }
  if (errorMessage.includes('reason="')) {
    errorMessage = errorMessage.split('reason="')[1].split('", method=')[0];
  }
  NotificationManager.error(errorMessage, '', 10000);
  console.error(error);
}

const ClosePoolTransactionDialog = ({
  isOpen,
  closePool,
  closeDialog,
}: {
  isOpen: boolean;
  closePool: Function;
  closeDialog: Function;
}) => {
  const data = [
    {
      title: 'Close Pool',
      action: closePool,
    },
  ];

  return (
    <TransactionDialog
      isOpen={isOpen}
      title='Close Pool'
      data={data}
      closeDialog={closeDialog}
      onCompletion={() => NotificationManager.success('', 'Pool closed', 5000)}
    />
  );
};

const MyPools: NextPage = () => {
  const router = useRouter();
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const poolData = useSubgraphData(GET_MY_PAIRS, {
    owner: address,
  });
  const { collectionSwapAddress } = useContext(
    ChainContext
  ) as ChainContextType;

  const contractCollectionSwap = useContract({
    address: collectionSwapAddress,
    abi: abiCollectionSwap,
    signerOrProvider: signer,
  });

  const closePool = useCallback(
    async (tokenID: any, nftIds: string[]) => {
      const tx = await contractCollectionSwap!.useLPTokenToDestroyDirectPairETH(
        tokenID,
        nftIds
      );
      await tx.wait();
      router.reload();
    },
    [contractCollectionSwap, router]
  );

  return (
    <>
      <Head>
        <title>Snip Pool | My Pools</title>
      </Head>
      <p className='text-white text-[40px] text-center font-bold my-10'>
        My Pools Page
      </p>
      <div className='flex items-center mt-2'>
        <Link
          href='/CreatePool'
          className='w-[250px] h-[50px] mr-[30px] flex justify-center items-center text-[1.3rem] font-bold rounded-lg uppercase bg-[#1fcec1] text-black transition-[0.5s]'
        >
          <div className='flex mr-[10px]'>
            <MdAddBox fontSize={'1.6rem'} />
          </div>
          <div className='flex'>Create Pool</div>
        </Link>
      </div>
      <div className='grid w-full grid-cols-1 text-center md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
        {(poolData?.pairs ?? []).map((each: any, index: number) => (
          <Pool
            key={index}
            each={each}
            close={() =>
              closePool(
                each.pairToken.tokenId,
                each.asAccount.nfts.map((item: any) => item.identifier)
              )
            }
          />
        ))}
      </div>
    </>
  );
};

export default MyPools;
