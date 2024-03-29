import { TextField } from '@mui/material';
import { useState } from 'react';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import collectionstakerAbi from '@/helpers/contractAbis/collectionstakerAbi.json';

const CreateRewardPairButton = () => {
  const nftAddress = '0xcf38c128C5B30622c1Fe3dC9e9e5464b56F1D548';
  const bondingCurveAddress = '0x4e11deb1A67B8E684d9c8841D4D8974D92FE6BdA';
  const delta = 5;
  const fee = 1;
  const rewardTokenAddress = '';
  const rewards = 10;
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  const handleChangeStart = (event: any) => {
    setStartTime(event.target.value);
  };

  const handleChangeEnd = (event: any) => {
    setEndTime(event.target.value);
  };

  const { config, error }: { config: any; error: any } =
    usePrepareContractWrite({
      address: '0x6B59F94da9431b94Cb8F85F426956484B5Ec5F10',
      abi: collectionstakerAbi,
      functionName: 'createIncentiveETH',
      args: [
        nftAddress,
        bondingCurveAddress,
        delta,
        fee,
        rewardTokenAddress,
        rewards,
        startTime,
        endTime,
      ],
      onSuccess() {
        console.log('Create Reward Pool Config: ', config);
      },
      onError() {
        console.log('Create Reward Pool Error: ', error);
      },
    });

  const { data, write } = useContractWrite(config);

  return (
    <div>
      <TextField
        id='outlined-basic'
        label='StartTime'
        variant='outlined'
        onChange={handleChangeStart}
      />
      <TextField
        id='outlined-basic'
        label='EndTime'
        variant='outlined'
        onChange={handleChangeEnd}
      />
      <button>Create Test Reward Pair</button>
    </div>
  );
};

export default CreateRewardPairButton;
