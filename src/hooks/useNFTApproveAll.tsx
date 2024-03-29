import { useCallback } from 'react';
import {
  erc721ABI,
  useContractRead,
  useContract,
  useSigner,
  useAccount,
} from 'wagmi';
import { BigNumber } from 'ethers';

export const useNFTApproveAll = (nftAddress: string, to: string) => {
  const { data: signer } = useSigner();
  const { address } = useAccount();

  const { data: approved, refetch } = useContractRead({
    abi: erc721ABI,
    address: nftAddress as `0x${string}`,
    functionName: 'isApprovedForAll',
    args: [address as `0x${string}`, to as `0x${string}`],
    enabled: true,
  });

  const contract = useContract({
    abi: erc721ABI,
    address: nftAddress,
    signerOrProvider: signer,
  });

  const approveAll = useCallback(async () => {
    return await contract?.setApprovalForAll(to as `0x${string}`, true);
  }, [contract, to]);

  return {
    approved: approved === true,
    approveAll,
    refetch,
  };
};
