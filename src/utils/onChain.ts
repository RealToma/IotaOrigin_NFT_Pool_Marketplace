import { IPFS_GATEWAY } from '@/constants';
import { Contract } from 'ethers';
import { erc721ABI } from 'wagmi';

export const getERC721Image = async (
  address: string,
  tokenId: string,
  provider: any
) => {
  const contract = new Contract(address, erc721ABI, provider);
  const metaDataUri: string = await contract.tokenURI(tokenId);
  const metadata = await fetch(
    metaDataUri.replace('ipfs://', IPFS_GATEWAY)
  ).then(res => res.json());

  return metadata?.image?.replace('ipfs://', IPFS_GATEWAY);
};
