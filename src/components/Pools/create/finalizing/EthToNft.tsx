import { FC, useState, useMemo, useCallback, useContext } from 'react';
import { useRouter } from 'next/router';
import {
  useNetwork,
  useSigner,
  useContract,
  erc20ABI,
  useAccount,
} from 'wagmi';
import { shortenAddress } from '@/utils';

import CollectionSwapAbi from '@/helpers/contractAbis/collectionswapAbi.json';
import { NotificationManager } from 'react-notifications';
import { parseEther, parseUnits } from 'ethers/lib/utils';
import { constants } from 'ethers';
import ChainContext from '@/contexts/ChainContext';

interface Props {
  collection: CollectionData;
  token: PaymentToken;
  startPrice: number;
  curve: BondingCurve;
  delta: number;
  buyAmount: number;
}

export const EthToNft: FC<Props> = ({
  collection,
  token,
  startPrice,
  curve,
  delta,
  buyAmount,
}) => {
  const router = useRouter();
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const { collectionSwapAddress, linearCurveAddress, exponentialCurveAddress } =
    useContext(ChainContext) as ChainContextType;
  const [waiting, setWaiting] = useState<boolean>(false);

  const totalAnalyzeData = useMemo(() => {
    let amount = startPrice;
    let totalAmount = 0;
    const points = [];
    for (let i = 1; i <= buyAmount; i++) {
      points.push({
        index: i,
        amount,
      });

      totalAmount += amount;

      if (curve.type == 'lin') {
        amount -= delta;
      } else if (curve.type == 'exp') {
        amount -= amount * (delta / 100);
      } else {
        amount -= amount ** delta;
      }
    }

    return {
      totalAmount,
      points,
    };
  }, [startPrice, delta, buyAmount, curve]);

  const tokenContract = useContract({
    address: token.address,
    abi: erc20ABI,
    signerOrProvider: signer,
  });

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
      if (curve.type == 'XYK') {
        NotificationManager.error(`Doesn't support this curve yet`);
        return;
      }

      setWaiting(true);

      const curveAddress =
        curve.type == 'lin' ? linearCurveAddress : exponentialCurveAddress;

      const deltaValue =
        curve.type == 'lin' ? delta.toString() : (1 + delta / 100).toString();

      const totalAmountHex = parseUnits(
        totalAnalyzeData.totalAmount.toString(),
        token.decimals
      );

      if (token.address != constants.AddressZero && tokenContract && address) {
        const balance = await tokenContract.balanceOf(address);
        if (balance.lt(totalAmountHex)) {
          throw new Error("You don't have enough token");
        }
        const allowance = await tokenContract.allowance(
          address,
          collectionSwapAddress as `0x${string}`
        );
        if (allowance.lt(totalAmountHex)) {
          const tx = await tokenContract.approve(
            collectionSwapAddress as `0x${string}`,
            totalAmountHex
          );
          await tx.wait();
        }
      }

      if (token.address == constants.AddressZero) {
        const tx = await contract.createDirectPairETH(
          collection.id,
          curveAddress,
          parseEther(deltaValue),
          constants.Zero,
          parseEther(startPrice.toString()),
          0,
          [],
          {
            value: parseEther(totalAnalyzeData.totalAmount.toString()),
          }
        );

        await tx.wait();
      } else {
        const tx = await contract.createDirectPairERC20({
          token: token.address,
          nft: collection.id,
          bondingCurve: curveAddress,
          assetRecipient: address,
          poolType: 0,
          delta: parseUnits(deltaValue, token.decimals),
          fee: constants.Zero,
          spotPrice: parseUnits(startPrice.toString(), token.decimals),
          propertyChecker: constants.AddressZero,
          initialNFTIDs: [],
          initialTokenBalance: totalAmountHex,
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
    curve.type,
    linearCurveAddress,
    exponentialCurveAddress,
    delta,
    totalAnalyzeData.totalAmount,
    token.decimals,
    token.address,
    tokenContract,
    address,
    router,
    collectionSwapAddress,
    collection.id,
    startPrice,
  ]);

  return (
    <div className='w-full flex flex-col items-center border-[1px] border-slate-600 p-4 py-10'>
      <h3 className='my-2 text-3xl font-bold'>Your Pool Details</h3>
      <div className='flex flex-col items-start my-5'>
        <p className='text-base leading-loose'>
          You are depositing {totalAnalyzeData?.totalAmount?.toFixed(2)}{' '}
          {token.symbol} to buy up to {buyAmount}{' '}
          {collection?.symbol ?? shortenAddress(collection.id)}
        </p>
        <p className='text-base leading-loose'>
          Your pool will have a starting price of {startPrice} {token.symbol}.
        </p>
        <p className='text-base leading-loose'>
          Each time your pool buys an NFT, your price will adjust down by{' '}
          {delta} {curve?.unit ?? token.symbol}.
        </p>
      </div>
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
