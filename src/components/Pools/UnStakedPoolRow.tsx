import styled from 'styled-components';
import { Box } from '@mui/material';
import { useContract, useNetwork, useSigner } from 'wagmi';
import { formatBigNumberWithUnits, shortenAddress } from '@/utils';
import { useMemo, useContext, useState } from 'react';
import ChainContext from '@/contexts/ChainContext';
import abiCollectionSwap from '@//helpers/contractAbis/collectionswapAbi.json';
import abiRewardPoolETH from '@//helpers/contractAbis/RewardPoolETH.json';
import { NotificationManager } from 'react-notifications';
import { useRouter } from 'next/router';

export default function UnStakedPoolRow({ pool, poolAddress }: any) {
  const router = useRouter();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();
  const { collectionSwapAddress, exponentialCurveAddress, linearCurveAddress } =
    useContext(ChainContext) as ChainContextType;

  const [waiting, setWaiting] = useState<boolean>(false);

  const contractRewardPoolETH = useContract({
    address: poolAddress,
    abi: abiRewardPoolETH,
    signerOrProvider: signer,
  });

  const contractCollectionSwap = useContract({
    address: collectionSwapAddress,
    abi: abiCollectionSwap,
    signerOrProvider: signer,
  });

  const bondingCurveName = useMemo(
    () =>
      pool?.bondingCurve === exponentialCurveAddress.toLowerCase()
        ? 'Exponential'
        : pool?.bondingCurve === linearCurveAddress.toLowerCase()
        ? 'Linear'
        : shortenAddress(pool?.bondingCurve),
    [exponentialCurveAddress, linearCurveAddress, pool?.bondingCurve]
  );

  const handleStake = async () => {
    if (!signer) {
      NotificationManager.error('Please connect your wallet');
      return;
    }

    if (
      !contractCollectionSwap ||
      !contractRewardPoolETH ||
      !pool.pairToken.tokenId
    ) {
      return;
    }

    try {
      setWaiting(true);
      let tx = await contractCollectionSwap.approve(
        poolAddress,
        pool.pairToken.tokenId
      );
      await tx.wait();
      tx = await contractRewardPoolETH.stake(pool.pairToken.tokenId);
      await tx.wait();
      router.reload();
    } catch (err: any) {
      console.log(err);
      NotificationManager.error(err?.reason ?? err?.message);
    } finally {
      setWaiting(false);
    }
  };

  return (
    <RowBorderValue02>
      <EachBorderValues03>
        <BorderUpValue01>Pool Address</BorderUpValue01>
        <BorderDownValue01>
          <a
            href={chain?.blockExplorers?.default?.url + '/address/' + pool?.id}
            target='_blank'
            rel='noreferrer'
          >
            {shortenAddress(pool.id)}
          </a>
        </BorderDownValue01>
      </EachBorderValues03>
      <EachBorderValues03>
        <BorderUpValue01>NFT Liquidity</BorderUpValue01>
        <BorderDownValue01>{pool?.numNfts}</BorderDownValue01>
      </EachBorderValues03>
      <EachBorderValues03>
        <BorderUpValue01>Bonding Curve</BorderUpValue01>
        <BorderDownValue01>{bondingCurveName}</BorderDownValue01>
      </EachBorderValues03>
      <EachBorderValues03>
        <BorderUpValue01>Delta</BorderUpValue01>
        <BorderDownValue01>
          {`${
            bondingCurveName == 'Linear'
              ? formatBigNumberWithUnits(pool?.delta ?? '0')
              : Number(formatBigNumberWithUnits(pool?.delta ?? '0')) * 100 - 100
          }${bondingCurveName == 'Linear' ? '' : '%'}`}
        </BorderDownValue01>
      </EachBorderValues03>
      <EachBorderValues03>
        <BorderUpValue01>Fee</BorderUpValue01>
        <BorderDownValue01>
          {formatBigNumberWithUnits(pool?.fee ?? '0', 16)}
        </BorderDownValue01>
      </EachBorderValues03>
      <EachBorderValues03>
        <BorderUpValue01>Action</BorderUpValue01>
        <BorderDownValue01>
          <button
            type='button'
            className='w-full py-1 text-xs text-black rounded-md bg-highLight'
            disabled={waiting}
            onClick={handleStake}
          >
            {waiting ? 'Staking...' : 'Stake'}
          </button>
        </BorderDownValue01>
      </EachBorderValues03>
    </RowBorderValue02>
  );
}

const EachBorderValues03 = styled(Box)`
  display: flex;
  flex-direction: column;
  margin-right: 30px;
`;

const BorderUpValue01 = styled(Box)`
  font-weight: 400;
  font-size: 18px;
  color: #afafaf;
  text-transform: uppercase;
  margin-bottom: 5px;
`;

const BorderDownValue01 = styled(Box)`
  font-weight: 400;
  font-size: 18px;
  color: white;
`;

const RowBorderValue02 = styled(Box)`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
`;
