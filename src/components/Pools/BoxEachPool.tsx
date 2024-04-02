import React, { useContext, FC, useMemo } from 'react';
import { ValueField } from '../common/ValueField';

import ChainContext from '@//contexts/ChainContext';
import { convertMiliSecondsToDateTime } from '@/utils/time';
import { useAccount } from 'wagmi';
import { BigNumber } from 'ethers';
import { formatBigNumberWithUnits } from '@/utils';
import styled from 'styled-components';
import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import { useCollectionIcon } from '@/hooks/useCollectionIcon';
import { useMyRewards } from '@/hooks/useMyRewards';
import { isAddress } from 'ethers/lib/utils.js';
import Button from '../Button';
import { MdRemoveRedEye } from 'react-icons/md';
import { formatEther } from 'ethers/lib/utils.js';

type EachPoolProps = {
  each: VaultData;
  onlyStaked?: boolean;
};

const BoxEachPool: FC<EachPoolProps> = ({ each, onlyStaked = false }) => {
  const { address } = useAccount();
  const { rewardTokenList } = useContext(ChainContext) as ChainContextType;

  const currentDate = new Date();
  const timestamp = currentDate.getTime();
  const { myRewards } = useMyRewards(each.id);

  // const myPools = useMemo(
  //   () =>
  //     each.stakedPairs.filter(
  //       pair => pair.pair.owner.id === address?.toLowerCase()
  //     ),
  //   [each.stakedPairs, address]
  // );

  const router = useRouter();
  const { image, type: imageType } = useCollectionIcon(each?.nft?.id);

  const startTime = parseInt(each.startTime);
  const endTime = parseInt(each.endTime);

  const data: Array<{ name: string; value: string }> = [
    // { name: 'Vault Address', value: each.id },
    {
      name: 'Rewards',
      value: '' + formatBigNumberWithUnits(BigNumber.from(each.reward ?? '0')),
    },
    {
      name: 'My Rewards',
      value: `${formatEther(BigNumber.from(myRewards ?? '0'))} ${
        rewardTokenList.filter(
          ({ value }: { value: string }) =>
            value.toLowerCase() === each.rewardToken?.toLowerCase()
        )[0]?.label || each.rewardToken
      }`,
    },
    {
      name: 'Start Time',
      value: `${convertMiliSecondsToDateTime(startTime * 1000)}`,
    },
    {
      name: 'End Time',
      value:
        Date.now() > startTime * 1000
          ? '' + convertMiliSecondsToDateTime(endTime * 1000)
          : '-',
    },
  ];

  return (
    <div className='relative flex items-center justify-center w-full'>
      {timestamp > Number(each.endTime) * 1000 && (
        <img
          alt=''
          className='w-40 absolute -top-4 left-12'
          src='images/expired.png'
        />
      )}
      <div className='flex flex-col items-center w-full max-w-[400px] h-full p-7 rounded-lg border-[1px] border-slate-600 cursor-pointer transform-[0.12s] hover:border-[#1fcec1]'>
        <TextTitle>
          <TextBig>
            {each?.nft?.name?.length ? each?.nft?.name : 'Unknown'}
          </TextBig>
        </TextTitle>
        {image ? (
          imageType == 'mp4' ? (
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
          )
        ) : (
          <div className='my-2 rounded w-[100px] h-[100px] bg-white/10'></div>
        )}
        {data.map(({ name, value }, index) =>
          isAddress(value) ? (
            <AddressField name={name} key={index} address={value} />
          ) : (
            <ValueField
              name={name}
              key={index}
              value={value}
              fullValue={null}
            />
          )
        )}

        <Button onClick={() => router.push(`vaults/${each.id}`)}>
          <MdRemoveRedEye className='inline-block mt-[-4px]' /> View Details
        </Button>
      </div>
    </div>
  );
};

export default BoxEachPool;

const AddressField = ({ name, address }: { name: string; address: string }) => {
  return (
    <ValueField
      name={name}
      value={address.substring(0, 6) + '...'}
      fullValue={address}
    />
  );
};

const TextTitle = styled(Box)`
  display: flex;
  align-items: center;
`;

const TextBig = styled(Box)`
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
  text-shadow: 4px 4px 0.5px rgb(0 0 0 / 40%);
`;
