import styled from 'styled-components';
import { Box } from '@mui/material';
import { useNetwork, useSigner, useContract, useAccount } from 'wagmi';
import { formatBigNumberWithUnits, shortenAddress } from '@/utils';
import { useMemo, useContext, useState } from 'react';
import ChainContext from '@/contexts/ChainContext';
import abiRewardPoolETH from '@//helpers/contractAbis/RewardPoolETH.json';
import { NotificationManager } from 'react-notifications';
import { useRouter } from 'next/router';
import AddressField from '../common/AddressField';

export default function StakedPoolRow({ pairToken, nft, poolAddress }: any) {
  const router = useRouter();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const { exponentialCurveAddress, linearCurveAddress } = useContext(
    ChainContext
  ) as ChainContextType;

  const [waiting, setWaiting] = useState<boolean>(false);

  const contractRewardPoolETH = useContract({
    address: poolAddress,
    abi: abiRewardPoolETH,
    signerOrProvider: signer,
  });

  const bondingCurveName = useMemo(
    () =>
      pairToken?.pair?.bondingCurve === exponentialCurveAddress.toLowerCase()
        ? 'Exponential'
        : pairToken?.pair?.bondingCurve === linearCurveAddress.toLowerCase()
        ? 'Linear'
        : shortenAddress(pairToken?.pair?.bondingCurve),
    [exponentialCurveAddress, linearCurveAddress, pairToken?.pair?.bondingCurve]
  );

  const handleWithdraw = async () => {
    if (!signer) {
      NotificationManager.error('Please connect your wallet');
      return;
    }

    if (!contractRewardPoolETH || !pairToken?.tokenId) {
      return;
    }

    try {
      setWaiting(true);
      const tx = await contractRewardPoolETH.withdraw(pairToken.tokenId);
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
            href={
              chain?.blockExplorers?.default?.url +
              '/address/' +
              pairToken?.pair?.id
            }
            target='_blank'
            rel='noreferrer'
          >
            <AddressField address={pairToken?.pair?.id} />
          </a>
        </BorderDownValue01>
      </EachBorderValues03>
      <EachBorderValues03>
        <BorderUpValue01>NFT Address</BorderUpValue01>
        <BorderDownValue01>
          <a
            href={chain?.blockExplorers?.default?.url + '/address/' + nft?.id}
            target='_blank'
            rel='noreferrer'
          >
            <AddressField address={nft?.id} />
          </a>
        </BorderDownValue01>
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
              ? formatBigNumberWithUnits(pairToken?.pair?.delta ?? '0')
              : Number(
                  formatBigNumberWithUnits(pairToken?.pair?.delta ?? '0')
                ) *
                  100 -
                100
          }${bondingCurveName == 'Linear' ? '' : '%'}`}
        </BorderDownValue01>
      </EachBorderValues03>
      <EachBorderValues03>
        <BorderUpValue01>Fee</BorderUpValue01>
        <BorderDownValue01>
          {formatBigNumberWithUnits(pairToken?.pair?.fee ?? '0', 16)}
        </BorderDownValue01>
      </EachBorderValues03>
      {pairToken?.pair?.owner?.id == address?.toLowerCase() && (
        <EachBorderValues03>
          <BorderUpValue01>Action</BorderUpValue01>
          <BorderDownValue01>
            <button
              type='button'
              className='w-full py-1 text-xs text-black rounded-md bg-highLight'
              disabled={waiting}
              onClick={handleWithdraw}
            >
              {waiting ? 'Withdrawing...' : 'Withdraw'}
            </button>
          </BorderDownValue01>
        </EachBorderValues03>
      )}
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
