/* eslint-disable @next/next/no-img-element */
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useContext, useMemo, useState } from 'react';

import { useAccount, useContract, useSigner } from 'wagmi';
import { BigNumber } from 'ethers';

import StakedPoolRow from '@/components/Pools/StakedPoolRow';
import UnStakedPoolRow from '@/components/Pools/UnStakedPoolRow';
import { LabeledValue } from '@/components/common/LabeledValue';
import { GET_STAKABLE_POOLS, GET_VAULT } from '@/constants/subgraphQueries';
import ChainContext from '@/contexts/ChainContext';
import { useCollectionIcon } from '@/hooks/useCollectionIcon';
import { useSubgraphData } from '@/hooks/useSubgraphData';
import { formatBigNumberWithUnits, shortenAddress } from '@/utils';
import {
  convertMiliSecondsToDHM,
  convertMiliSecondsToDateTime,
} from '@/utils/time';
import { FaAward } from 'react-icons/fa';
import { MdAddLink, MdTimer } from 'react-icons/md';

import abiRewardPoolETH from '@//helpers/contractAbis/RewardPoolETH.json';
import { NotificationManager } from 'react-notifications';
import Head from 'next/head';
import AddressField from '@/components/common/AddressField';
import { tokens } from '@/constants';

const VaultDetail: NextPage = () => {
  const router = useRouter();
  const { address: id } = router.query;
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const [waiting, setWaiting] = useState<boolean>(false);
  const [waitingSweep, setWaitingSweep] = useState<boolean>(false);

  const vaultData = useSubgraphData(GET_VAULT, {
    id: (id as string | undefined)?.toLowerCase(),
  });
  const poolsData = useSubgraphData(GET_STAKABLE_POOLS, {
    address: address?.toLowerCase(),
    nftAddress: vaultData?.vault?.nft?.id,
    delta: vaultData?.vault?.delta,
    fee: vaultData?.vault?.fee,
    bondingCurve: vaultData?.vault?.bondingCurve,
  });

  const { image, type: imageType } = useCollectionIcon(
    vaultData?.vault?.nft?.id
  );
  const { exponentialCurveAddress, linearCurveAddress } = useContext(
    ChainContext
  ) as ChainContextType;

  const contractRewardPoolETH = useContract({
    address: id as string,
    abi: abiRewardPoolETH,
    signerOrProvider: signer,
  });

  const bondingCurveName = useMemo(
    () =>
      vaultData?.vault?.bondingCurve === exponentialCurveAddress?.toLowerCase()
        ? 'Exponential'
        : vaultData?.vault?.bondingCurve === linearCurveAddress?.toLowerCase()
        ? 'Linear'
        : shortenAddress(vaultData?.vault?.bondingCurve),
    [
      exponentialCurveAddress,
      linearCurveAddress,
      vaultData?.vault?.bondingCurve,
    ]
  );

  const paymentToken = useMemo(() => {
    return tokens.filter(
      token => token.address.toLowerCase() == vaultData?.vault?.tokenAddress
    )?.[0];
  }, [vaultData?.vault?.tokenAddress]);

  const fee = useMemo(
    () =>
      formatBigNumberWithUnits(
        BigNumber.from(vaultData?.vault?.fee ?? '0'),
        16
      ) + '%',
    [vaultData?.vault?.fee]
  );

  const timeString = useMemo(
    () =>
      vaultData?.vault?.endTime * 1000 > Date.now()
        ? `${convertMiliSecondsToDHM(
            vaultData?.vault?.endTime * 1000 - Date.now()
          )} Left`
        : 'Expired',
    [vaultData?.vault?.endTime]
  );

  const handleGetReward = async () => {
    if (!signer) {
      NotificationManager.error('Please connect your wallet');
      return;
    }

    try {
      setWaiting(true);
      const tx = await contractRewardPoolETH?.getReward();
      const receipt = await tx.wait();
      NotificationManager.success(`You received some rewards.`, '', 3000);
      console.log(receipt);
    } catch (e: any) {
      NotificationManager.error(
        e?.reason ?? e?.message ?? 'Error!, Please try again.'
      );
      console.log(e);
    } finally {
      setWaiting(false);
    }
  };

  const handleSweepReward = async () => {
    if (!signer) {
      NotificationManager.error('Please connect your wallet');
      return;
    }

    try {
      setWaitingSweep(true);
      const tx = await contractRewardPoolETH?.sweepRewards();
      const receipt = await tx.wait();
      NotificationManager.success(`You received some rewards.`, '', 3000);
      console.log(receipt);
    } catch (e: any) {
      NotificationManager.error(
        e?.reason ?? e?.message ?? 'Error!, Please try again.'
      );
      console.log(e);
    } finally {
      setWaitingSweep(false);
    }
  };

  return (
    <>
      <Head>
        <title>Snip Pool | Vault Details</title>
      </Head>
      <div className='text-center bg-white/5 mx-[-50px]'>
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
        <div className='text-white text-[20px]'>{id}</div>
        <h1 className='my-6 text-base font-bold text-white'>
          This vault holds both {vaultData?.vault?.nft?.name}(
          {vaultData?.vault?.nft?.symbol}) and {paymentToken?.symbol} to earn
          swap fees ({fee})
        </h1>
        <div className='grid grid-cols-5 mt-5 max-w-[1000px] mx-auto'>
          <LabeledValue
            value={shortenAddress(vaultData?.vault?.nft?.id)}
            label='Collection Address'
          />
          <LabeledValue value={fee} label='Swap Fee' />
          <LabeledValue
            value={vaultData?.vault?.stakedPairs?.length}
            label='Pools'
          />
          <LabeledValue value={bondingCurveName} label='Bonding Curve' />
          <LabeledValue
            value={`${
              bondingCurveName == 'Exponential'
                ? Number(
                    formatBigNumberWithUnits(
                      BigNumber.from(vaultData?.vault?.delta ?? '0')
                    )
                  ) *
                    100 -
                  100
                : formatBigNumberWithUnits(
                    BigNumber.from(vaultData?.vault?.delta ?? '0')
                  )
            }
            ${bondingCurveName == 'Exponential' ? '%' : ''}`}
            label='Delta'
          />
        </div>
      </div>
      <div className='flex flex-row gap-5 p-5'>
        <Link
          href={`/CreatePool?vault=${id}`}
          type='button'
          className='flex flex-row items-center justify-center h-12 gap-3 px-5 text-xl font-semibold text-black uppercase transition-all rounded-lg w-60 bg-highLight hover:scale-110'
        >
          <MdAddLink />
          <p>Create Pool</p>
        </Link>
        <button
          type='button'
          className='flex flex-row items-center justify-center h-12 gap-3 px-5 text-xl font-semibold text-black uppercase transition-all rounded-lg w-60 bg-highLight hover:scale-110'
          disabled={waiting}
          onClick={handleGetReward}
        >
          <FaAward />
          <p>{waiting ? 'Waiting...' : 'Get Reward'}</p>
        </button>

        <button
          type='button'
          className='flex flex-row items-center justify-center h-12 gap-3 px-5 text-xl font-semibold text-black uppercase transition-all rounded-lg w-60 bg-highLight hover:scale-110'
          disabled={waitingSweep}
          onClick={handleSweepReward}
        >
          <FaAward />
          <p>{waitingSweep ? 'Waiting...' : 'Sweep Reward'}</p>
        </button>
      </div>
      <div className='flex flex-col w-full text-white'>
        <div className='flex flex-col items-start w-full p-5 rounded-lg bg-slate-800 mt-7'>
          <h3 className='mb-5 text-xl font-semibold shadow-text'>Rewards</h3>
          <div className='flex flex-row items-center w-auto gap-2 p-4 text-xl rounded-lg bg-slate-600'>
            <MdTimer />
            <span>{timeString}</span>
          </div>
          <div className='grid items-center grid-cols-2 mt-5 lg:grid-cols-4 gap-y-4'>
            <div className='flex flex-col gap-2 pr-5 mr-5 border-r-2 border-white'>
              <p className='text-lg uppercase text-slate-300'>start time</p>
              <p>
                {convertMiliSecondsToDateTime(
                  vaultData?.vault?.startTime * 1000
                )}
              </p>
            </div>
            <div className='flex flex-col gap-2 pr-5 mr-5 border-white lg:border-r-2'>
              <p className='text-lg uppercase text-slate-300'>end time</p>
              <p>
                {convertMiliSecondsToDateTime(vaultData?.vault?.endTime * 1000)}
              </p>
            </div>
            <div className='flex flex-col gap-2 pr-5 mr-5 border-r-2 border-white'>
              <p className='text-lg uppercase text-slate-300'>Reward Token</p>
              <p>
                {vaultData?.vault?.rewardToken ? (
                  <AddressField address={vaultData?.vault?.rewardToken} />
                ) : (
                  'No Reward Token'
                )}
              </p>
            </div>
            <div className='flex flex-col gap-2 pr-5 mr-5'>
              <p className='text-lg uppercase text-slate-300'>Total Rewards</p>
              <p>
                {vaultData?.vault?.reward
                  ? formatBigNumberWithUnits(vaultData?.vault?.reward)
                  : 'No Reward'}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className='flex flex-col w-full text-white'>
        <div className='flex flex-col items-start w-full p-5 rounded-lg bg-slate-800 mt-7'>
          <h3 className='mb-5 text-xl font-semibold shadow-text'>
            Pools in this vault
          </h3>
          <div className='flex flex-col'>
            {vaultData?.vault?.stakedPairs?.length ? (
              vaultData?.vault?.stakedPairs?.map((eachPool: any) => {
                return (
                  <StakedPoolRow
                    key={eachPool.tokenId}
                    pairToken={eachPool}
                    nft={vaultData?.vault?.nft}
                    poolAddress={id}
                  />
                );
              })
            ) : (
              <p className='flex items-center justify-center w-full text-xl'>
                No pools yet
              </p>
            )}
          </div>
        </div>
      </div>
      <div className='flex flex-col w-full text-white'>
        <div className='flex flex-col items-start w-full p-5 rounded-lg bg-slate-800 mt-7'>
          <h3 className='mb-5 text-xl font-semibold shadow-text'>
            Available Pools For Staking
          </h3>
          <div className='flex flex-col'>
            {poolsData?.pairs?.length ? (
              poolsData?.pairs?.map((eachPool: any) => {
                return (
                  <UnStakedPoolRow
                    key={eachPool.tokenId}
                    pool={eachPool}
                    poolAddress={id}
                  />
                );
              })
            ) : (
              <p className='flex items-center justify-center w-full text-xl'>
                No pools yet
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default VaultDetail;
