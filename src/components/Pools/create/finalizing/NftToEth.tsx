import {
  FC,
  useState,
  useMemo,
  useCallback,
  useEffect,
  useContext,
} from 'react';
import { useRouter } from 'next/router';
import { shortenAddress } from '@/utils';
import {
  erc20ABI,
  erc721ABI,
  useAccount,
  useContract,
  useProvider,
  useSigner,
} from 'wagmi';

import { NFTCard } from './NFTCard';

import CollectionSwapAbi from '@/helpers/contractAbis/collectionswapAbi.json';
import { NotificationManager } from 'react-notifications';
import { parseEther, parseUnits } from 'ethers/lib/utils';
import { Contract, constants } from 'ethers';
import ChainContext from '@/contexts/ChainContext';
import { useSubgraphData } from '@/hooks/useSubgraphData';
import { GET_NFTS_IN_COLLECTION } from '@/constants/subgraphQueries';
import { IPFS_GATEWAY } from '@/constants';
import { useNFTApproveAll } from '@/hooks/useNFTApproveAll';

interface Props {
  collection: CollectionData;
  token: PaymentToken;
  startPrice: number;
  curve: BondingCurve;
  delta: number;
  sellAmount: number;
}

export const NftToEth: FC<Props> = ({
  collection,
  token,
  startPrice,
  curve,
  delta,
  sellAmount,
}) => {
  const router = useRouter();
  const { selectedNfts: nftsFromQuery } = router.query;

  const { address } = useAccount();
  const { collectionSwapAddress, linearCurveAddress, exponentialCurveAddress } =
    useContext(ChainContext) as ChainContextType;
  const [selectedNfts, setSelectedNfts] = useState<string[]>(
    (nftsFromQuery as string[]) ?? []
  );
  const { data: signer } = useSigner();
  const provider = useProvider();
  const [waiting, setWaiting] = useState<boolean>(false);
  const [ownedNfts, setOwnedNfts] = useState<NFTData[]>([]);
  const data = useSubgraphData(GET_NFTS_IN_COLLECTION, {
    address: address?.toLowerCase(),
    collectionAddress: collection.id,
  });

  const { approved, approveAll, refetch } = useNFTApproveAll(
    collection.id,
    collectionSwapAddress
  );

  const totalAnalyzeData = useMemo(() => {
    let amount = startPrice;
    let totalAmount = 0;
    const points = [];
    for (let i = 1; i <= sellAmount; i++) {
      points.push({
        index: i,
        amount,
      });

      totalAmount += amount;

      if (curve.type == 'lin') {
        amount += delta;
      } else if (curve.type == 'exp') {
        amount += amount * (delta / 100);
      } else {
        amount += amount ** delta;
      }
    }

    return {
      totalAmount,
      points,
    };
  }, [startPrice, delta, sellAmount, curve]);

  const triggerSelect = useCallback(
    (tokenId: string) => {
      if (selectedNfts.indexOf(tokenId) >= 0) {
        setSelectedNfts(selectedNfts.filter(nft => nft != tokenId));
      } else {
        setSelectedNfts([...selectedNfts, tokenId]);
      }
    },
    [selectedNfts]
  );

  const contract = useContract({
    address: collectionSwapAddress,
    abi: CollectionSwapAbi,
    signerOrProvider: signer,
  });

  const handleCreate = useCallback(async () => {
    if (!contract) {
      return;
    }

    try {
      if (selectedNfts.length != sellAmount && !selectedNfts) {
        NotificationManager.error(`You should select ${sellAmount} of NFTs`);
        return;
      }

      if (!approved) {
        NotificationManager.error(`You should have to approve the NFTs`);
        return;
      }

      if (curve.type == 'XYK') {
        NotificationManager.error(`Doesn't support this curve yet`);
        return;
      }

      setWaiting(true);

      const curveAddress =
        curve.type == 'lin' ? linearCurveAddress : exponentialCurveAddress;

      const deltaValue =
        curve.type == 'lin' ? delta.toString() : (1 + delta / 100).toString();

      if (token.address == constants.AddressZero) {
        const tx = await contract.createDirectPairETH(
          collection.id,
          curveAddress,
          parseEther(deltaValue),
          constants.Zero,
          parseEther(startPrice.toString()),
          1,
          selectedNfts
        );

        await tx.wait();
      } else {
        const tx = await contract.createDirectPairERC20({
          token: token.address,
          nft: collection.id,
          bondingCurve: curveAddress,
          assetRecipient: address,
          poolType: 1,
          delta: parseUnits(deltaValue, token.decimals),
          fee: constants.Zero,
          spotPrice: parseUnits(startPrice.toString(), token.decimals),
          propertyChecker: constants.AddressZero,
          initialNFTIDs: selectedNfts,
          initialTokenBalance: constants.Zero,
        });

        await tx.wait();
      }

      NotificationManager.success(`Successfully created!`);
      router.push('/MyPools');
    } catch (err: any) {
      console.log(err);
      NotificationManager.error(err?.reason ?? err?.message);
    } finally {
      setWaiting(false);
    }
  }, [
    contract,
    selectedNfts,
    sellAmount,
    approved,
    curve.type,
    linearCurveAddress,
    exponentialCurveAddress,
    delta,
    token.address,
    router,
    collection.id,
    startPrice,
    address,
  ]);

  const handleApproveAll = async () => {
    try {
      if (approved) {
        NotificationManager.success(
          `Your collection has already been approved`
        );
        return;
      }
      await approveAll();
      await refetch();
    } catch (err) {
      NotificationManager.error(`Couldn't approve all NFTs`);
    }
  };

  useEffect(() => {
    if (!data?.account?.nfts) {
      return;
    }
    (async () => {
      const nfts: NFTData[] = [];
      const contract = new Contract(collection.id, erc721ABI, provider);
      for (const item of data?.account?.nfts ?? []) {
        const uri = await contract.tokenURI(item.identifier);
        const metadataUri = uri.replace('ipfs://', IPFS_GATEWAY);
        const tokenId = item.identifier;

        const metadata = await fetch(metadataUri).then(res => res.json());

        nfts.push({
          address: collection.id,
          tokenId,
          imageUrl: metadata?.image?.replace('ipfs://', IPFS_GATEWAY),
        });

        setOwnedNfts([...nfts]);
      }
    })();
  }, [data, collection, provider]);

  return (
    <div className='w-full flex flex-col items-center border-[1px] border-slate-600 p-4 py-10'>
      <h3 className='my-2 text-3xl font-bold'>Your Pool Details</h3>
      <div className='flex flex-col items-start my-5'>
        <p className='text-base leading-loose'>
          You are depositing {sellAmount}{' '}
          {collection?.symbol ?? shortenAddress(collection.id)} to buy up to{' '}
          {totalAnalyzeData?.totalAmount?.toFixed(2)} {token.symbol}
        </p>
        <p className='text-base leading-loose'>
          Your pool will have a starting price of {startPrice} {token.symbol}.
        </p>
        <p className='text-base leading-loose'>
          Each time your pool sells an NFT, your price will adjust up by {delta}{' '}
          {curve?.unit ?? token.symbol}.
        </p>
      </div>
      <div className='w-full h-[1px] bg-slate-600 my-5' />
      <div className='flex flex-col items-center w-full'>
        <h4 className='text-2xl font-bold'>Deposit {sellAmount} NFTs</h4>
        <div className='w-full overflow-auto min-h-28'>
          <div className='flex flex-row h-full gap-2 flex-nowrap'>
            {ownedNfts.map(nft => (
              <NFTCard
                key={nft.tokenId}
                nftData={nft}
                selected={selectedNfts.indexOf(nft.tokenId) >= 0}
                triggerSelect={triggerSelect}
              />
            ))}
          </div>
          <button
            type='button'
            disabled={waiting || approved}
            onClick={handleApproveAll}
            className='w-full max-w-[200px] h-[40px] mt-5 flex justify-center items-center text0-xl font-bold rounded-lg uppercase bg-[#1fcec1] text-black transition-[0.5s]'
          >
            Approve NFTs
          </button>
        </div>
      </div>
      <div className='w-full h-[1px] bg-slate-600 my-5' />
      <button
        type='button'
        disabled={waiting}
        onClick={handleCreate}
        className='w-full max-w-[250px] h-[50px] flex justify-center items-center text0-xl font-bold rounded-lg uppercase bg-[#1fcec1] text-black transition-[0.5s]'
      >
        {waiting ? 'Creating a Pool ...' : 'Create Pool'}
      </button>
    </div>
  );
};
