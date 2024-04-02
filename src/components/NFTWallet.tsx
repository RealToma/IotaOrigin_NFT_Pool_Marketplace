import { FC, useEffect, useState } from 'react';
import NFTDisplay from './NFTDisplay';
import { erc721ABI, useAccount, useNetwork, useProvider } from 'wagmi';
import { useSubgraphData } from '@/hooks/useSubgraphData';
import {
  GET_NFTS_IN_COLLECTION,
  GET_NFTS_IN_WALLET,
} from '@/constants/subgraphQueries';
import { IPFS_GATEWAY, IPFS_GATEWAY_TOKEN } from '@/constants';
import { Contract } from 'ethers';

type Props = {
  collection?: string;
  setSelected?: (value: any[]) => void;
};

const NFTWallet: FC<Props> = ({ collection, setSelected }) => {
  const { address } = useAccount();
  const provider = useProvider();
  const [nfts, setNfts] = useState<NFTData[]>();
  const data = useSubgraphData(
    collection ? GET_NFTS_IN_COLLECTION : GET_NFTS_IN_WALLET,
    collection
      ? {
          address: address?.toLowerCase(),
          collectionAddress: collection.toLowerCase(),
        }
      : {
          address: address?.toLowerCase(),
        }
  );

  useEffect(() => {
    if (!data) {
      return;
    }
    (async () => {
      const nfts: NFTData[] = [];
      for (const item of data?.account?.nfts ?? []) {
        const contract = new Contract(item.contract.id, erc721ABI, provider);
        const uri = await contract.tokenURI(item.identifier);
        const metadataUri =
          uri.replace('ipfs://', IPFS_GATEWAY) +
          (IPFS_GATEWAY_TOKEN !== '' && uri.includes('ipfs://')
            ? '?pinataGatewayToken=' + IPFS_GATEWAY_TOKEN
            : '');
        const tokenId = item.identifier;

        try {
          const metadata = await fetch(metadataUri).then(res => res.json());
          nfts.push({
            address: collection ?? item.contract.id,
            tokenId,
            imageUrl:
              metadata?.image?.replace('ipfs://', IPFS_GATEWAY) +
              (IPFS_GATEWAY_TOKEN !== '' && metadata?.image?.includes('ipfs://')
                ? '?pinataGatewayToken=' + IPFS_GATEWAY_TOKEN
                : ''),
          });

          setNfts([...nfts]);
        } catch (err) {
          console.error(err);
        }
      }

      setNfts([...nfts]);
    })();
  }, [data, collection, provider]);

  return <NFTDisplay nfts={nfts} setSelected={setSelected} />;
};

export default NFTWallet;
