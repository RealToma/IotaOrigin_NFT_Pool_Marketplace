import Image from 'next/image';
import { useMemo, useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import { useSubgraphData } from '@/hooks/useSubgraphData';
import {
  GET_BUY_ORDER,
  GET_SELL_ORDER,
  GET_SWAP_HISTORY,
} from '@/constants/subgraphQueries';
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { formatNumberWithUnit } from '@/utils';
import { formatEther, formatUnits } from 'ethers/lib/utils.js';
import { convertTimestampToDate } from '@/utils/time';
import { useTokenPriceContext } from '@/contexts/TokenPriceContext';
import { tokens } from '@/constants';
import { constants } from 'ethers';

interface PropsType {
  startPrice: number;
  setStartPrice: (startPrice: number) => void;
  collection: CollectionData;
  token: PaymentToken;
  curve: BondingCurve;
  delta: number;
}

const SetPrice = ({
  startPrice,
  setStartPrice,
  collection,
  token,
  curve,
  delta,
}: PropsType) => {
  const { data: priceData } = useTokenPriceContext();

  const buyData = useSubgraphData(GET_BUY_ORDER, {
    nft: collection.id,
    token: token.address.toLowerCase(),
  });
  const sellData = useSubgraphData(GET_SELL_ORDER, {
    nft: collection.id,
    token: token.address.toLowerCase(),
  });
  const swapData = useSubgraphData(GET_SWAP_HISTORY, {
    nft: collection.id,
  });

  const chartData = useMemo(() => {
    const sellChartData = (swapData?.history ?? [])
      .filter((item: any) => item.isTokenToNFT)
      .map((item: any) => {
        return {
          timestamp: parseInt(item.timestamp),
          sellPrice:
            (parseFloat(formatEther(item.tokenAmount)) *
              priceData[item.pair.token.id]) /
            item.nftIds.length,
        };
      });
    const buyChartData = (swapData?.history ?? [])
      .filter((item: any) => !item.isTokenToNFT)
      .map((item: any) => {
        return {
          timestamp: parseInt(item.timestamp),
          buyPrice:
            (parseFloat(formatEther(item.tokenAmount)) *
              priceData[item.pair.token.id]) /
            item.nftIds.length,
        };
      });

    const allData = [...buyChartData, ...sellChartData].sort(
      (a, b) => a.timestamp - b.timestamp
    );

    let lastSellPrice = 0,
      lastBuyPrice = 0;
    for (let i = 0; i < allData.length; i++) {
      if (allData[i]?.buyPrice) {
        lastBuyPrice = allData[i].buyPrice;
      } else {
        allData[i].buyPrice = lastBuyPrice;
      }
      if (allData[i]?.sellPrice) {
        lastSellPrice = allData[i].sellPrice;
      } else {
        allData[i].sellPrice = lastSellPrice;
      }
    }

    return allData;
  }, [swapData?.history, priceData]);

  return (
    <div className='grid grid-cols-4 w-full gap-x-5 px-10'>
      <div className='w-full col-span-1'>
        <h3>Orders</h3>
        <div className='border border-slate-600 max-h-[180px] p-4 overflow-y-auto scrollbar mb-2'>
          {(sellData?.orders ?? []).map((item: any, key: number) => (
            <p key={key} className=' text-red-500'>
              Sell {formatEther(item.spotPrice)} {token.symbol}
            </p>
          ))}
        </div>

        <div className='border border-slate-600 max-h-[180px] p-4 overflow-y-auto scrollbar'>
          {(buyData?.orders ?? []).map((item: any, key: number) => (
            <p key={key} className=' text-green-500'>
              Buy {formatEther(item.spotPrice)} {token.symbol}
            </p>
          ))}
        </div>
      </div>

      <div className='flex flex-col items-center px-2 md:px-5 col-span-2 text-center'>
        <h3 className='text-3xl'>Which price you want to deploy?</h3>
        <p className='mb-12 mt-4 text-sm'>
          Set the initial price and how your pool&apos;s price changes.
        </p>
        <div className='flex flex-col items-start w-full mb-5'>
          <div className='flex flex-row items-center gap-2 text-sm'>
            <span>Start Price</span>
            <div className='relative cursor-pointer group'>
              <FaQuestionCircle size={12} />
              <span className="absolute hidden group-hover:flex -top-4 -right-3 translate-x-full w-48 px-2 py-1 bg-slate-950 rounded-lg text-center text-white text-sm before:content-[''] before:absolute before:top-1/2  before:right-[100%] before:-translate-y-1/2 before:border-8 before:border-y-transparent before:border-l-transparent before:border-r-slate-950 z-10">
                The starting price of your pool
              </span>
            </div>
          </div>
          <div className='w-full grid grid-cols-[auto_1fr] border-[1px] border-slate-600'>
            <input
              type='number'
              value={startPrice}
              onChange={e => setStartPrice(parseFloat(e.target.value ?? '0'))}
              className='w-auto px-4 py-2 bg-black outline-none'
            />
            <div className='flex items-center justify-center h-full gap-1 px-4'>
              <Image
                width={16}
                height={16}
                src={`/icons/${token.icon}`}
                alt='token icon'
              />
              <span className='text-sm font-bold uppercase d-none'>
                {token.symbol}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='col-span-1'>
        <h3>Price History</h3>
        <div className='w-full h-48 md:h-96'>
          <ResponsiveContainer>
            <ComposedChart data={chartData} height={400}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='timestamp'
                fontSize={12}
                tickFormatter={(value, index) => convertTimestampToDate(value)}
              />
              <YAxis
                tickCount={5}
                fontSize={12}
                tickFormatter={(value, index) => formatNumberWithUnit(value, 2)}
              />
              <Line
                name='Price Per NFT'
                dataKey='sellPrice'
                stroke='#ef4444'
                strokeWidth={3}
                dot={true}
              />
              <Line
                dataKey='buyPrice'
                stroke='rgb(34, 197, 94)'
                strokeWidth={3}
                dot={true}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default SetPrice;
