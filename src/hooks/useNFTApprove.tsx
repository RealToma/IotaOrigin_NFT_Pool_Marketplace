import { useCallback } from 'react';
import { erc721ABI, useContractRead, useContract, useSigner } from 'wagmi';
import { BigNumber } from 'ethers';

export const useNFTApprove = (
  nftAddress: string,
  tokenId: string,
  to: string
) => {
  const { data: signer } = useSigner();

  const tokenIdBN = BigNumber.from(tokenId.toString());

  const { data: approver, refetch } = useContractRead({
    abi: erc721ABI,
    address: nftAddress as `0x${string}`,
    functionName: 'getApproved',
    args: [tokenIdBN],
    enabled: true,
  });

  const contract = useContract({
    abi: erc721ABI,
    address: nftAddress,
    signerOrProvider: signer,
  });

  const approve = useCallback(async () => {
    return await contract?.approve(to as `0x${string}`, tokenIdBN);
  }, [contract, to, tokenIdBN]);

  return {
    allowed: (approver as any)?.toLowerCase() == to.toLowerCase(),
    approve,
    refetch,
  };
};
