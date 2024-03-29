import { useState, useEffect } from 'react';
import { useContract, useSigner, useAccount } from 'wagmi';
import abiRewardPoolETH from '@//helpers/contractAbis/RewardPoolETH.json';

export const useMyRewards = (vaultAddress: string) => {
  const [totalReward, setTotalReward] = useState(0);

  const { data: signer } = useSigner();
  const { address } = useAccount();

  const contract = useContract({
    abi: abiRewardPoolETH,
    address: vaultAddress,
    signerOrProvider: signer,
  });

  useEffect(() => {
    const fetchRewards = async () => {
      let newTotalReward = await contract?.earned(address);
      setTotalReward(newTotalReward);
    };

    if (address && contract) {
      fetchRewards();
    }
  }, [address, contract]);

  return {
    myRewards: totalReward,
  };
};
