import { useState, useMemo } from 'react';
import Image from 'next/image';
import { FaQuestionCircle } from 'react-icons/fa';
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { formatNumberWithUnit } from '@/utils';
import { useRouter } from 'next/router';

interface PropsType {
  delta: number;
  setDelta: (delta: number) => void;
  curve: BondingCurve;
  startPrice: number;
  type: number;
  token: PaymentToken;
}

const DeltaSetting = ({
  delta,
  setDelta,
  curve,
  startPrice,
  type,
  token,
}: PropsType) => {
  const router = useRouter();
  const { vault } = router.query;
  const [buyingAmount, setBuyingAmount] = useState<number>(1);
  const totalAnalyzeData = useMemo(() => {
    let amount = startPrice;
    let totalAmount = 0;
    const points = [];
    for (let i = 1; i <= buyingAmount; i++) {
      if (amount <= 0 && buyingAmount > 1) {
        break;
      }

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
  }, [startPrice, buyingAmount, curve.type, delta]);

  const analyzeData = useMemo(() => {
    let amount = startPrice;
    let totalAmount = 0;
    const points = [];
    for (let i = 1; i <= buyingAmount; i++) {
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
  }, [startPrice, delta, curve, buyingAmount]);

  const chartData = useMemo(() => {
    return (totalAnalyzeData?.points ?? []).map((point, index) => {
      if (analyzeData?.points?.[index]) {
        return { ...point, fillAmount: point.amount };
      } else {
        return { ...point, fillAmount: null };
      }
    });
  }, [totalAnalyzeData?.points, analyzeData?.points]);

  return (
    <div className='grid w-full grid-cols-2'>
      <div className='flex flex-col items-center col-span-1 px-10 mt-20 mb-20'>
        <h3 className='text-3xl'>Which delta you want to use?</h3>

        <div className='flex flex-col items-start w-full mt-10'>
          <div className='flex flex-row items-center gap-2 text-sm'>
            <span>Delta</span>
            <div className='relative cursor-pointer group'>
              <FaQuestionCircle size={12} />
              <span className="absolute hidden group-hover:flex -top-4 -right-3 translate-x-full w-48 px-2 py-1 bg-slate-950 rounded-lg text-center text-white text-sm before:content-[''] before:absolute before:top-1/2  before:right-[100%] before:-translate-y-1/2 before:border-8 before:border-y-transparent before:border-l-transparent before:border-r-slate-950 z-10">
                How much your pool&lsquo;s price changes with each sell
              </span>
            </div>
          </div>
          <div className='w-full grid grid-cols-[auto_1fr] border-[1px] border-slate-600'>
            <input
              type='number'
              value={delta}
              onChange={e => setDelta(parseFloat(e.target.value ?? '0'))}
              disabled={!!vault}
              className='w-full px-4 py-2 bg-black outline-none'
            />
            <div className='flex items-center justify-center h-full gap-1 px-4'>
              {curve.unit ? (
                <span className='text-sm font-bold uppercase'>
                  {curve.unit}
                </span>
              ) : (
                <>
                  <Image
                    width={16}
                    height={16}
                    src={`/icons/${token.icon}`}
                    alt='token icon'
                  />
                  <span className='text-sm font-bold uppercase'>
                    {token.symbol}
                  </span>
                </>
              )}
            </div>
          </div>
          {curve.type == 'lin' &&
          Math.abs(delta) > 0 &&
          Math.abs(startPrice) <= Math.abs(delta) ? (
            <p className='w-full text-sm text-center text-red-700'>
              Price (1) must be bigger than delta (1)
            </p>
          ) : (
            <></>
          )}
          {curve.type == 'exp' && delta <= 1 ? (
            <p className='w-full text-sm text-center text-red-700'>
              Delta should great than 1
            </p>
          ) : (
            <></>
          )}
        </div>
      </div>

      <div className='col-span-1'>
        <div className='flex flex-col items-center justify-around flex-1 w-full py-10'>
          <p>Buying {buyingAmount} NFTs...</p>
          <input
            type='range'
            min={1}
            // max={buyAmount}
            step={1}
            value={buyingAmount}
            onChange={e => setBuyingAmount(parseInt(e.target.value))}
            className='transparent h-1.5 w-1/2 cursor-pointer appearance-none rounded-lg border-transparent bg-slate-400'
          />
          <p>
            will cost you {analyzeData.totalAmount.toFixed(3)} {token.symbol}.
          </p>
        </div>
        <div className='w-full h-48 md:h-96'>
          <ResponsiveContainer>
            <ComposedChart data={chartData} height={400}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='index' fontSize={12} />
              <YAxis
                tickCount={5}
                fontSize={12}
                tickFormatter={(value, index) => formatNumberWithUnit(value, 2)}
              />
              <Line
                name='Price Per NFT'
                dataKey='amount'
                stroke='#aaaaaa'
                strokeWidth={3}
                dot={true}
              />
              <Line
                dataKey='fillAmount'
                stroke='#1fcec1'
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

export default DeltaSetting;
