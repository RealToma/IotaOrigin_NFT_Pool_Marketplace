import { bondingCurves } from '@/constants/curves';
import Image from 'next/image';
import { FC, useState, useMemo, useEffect } from 'react';
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa';
import {
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { formatNumberWithUnit } from '@/utils';

interface Props {
  collection: CollectionData;
  token: PaymentToken;
  startPrice: number;
  setStartPrice: (startPrice: number) => void;
  curve: BondingCurve;
  setCurve: (curve: BondingCurve) => void;
  delta: number;
  setDelta: (delta: number) => void;
  buyAmount: number;
  setBuyAmount: (amount: number) => void;
  setError: (error: boolean) => void;
}

export const EthToNft: FC<Props> = ({
  collection,
  token,
  startPrice,
  curve,
  delta,
  buyAmount,
  setStartPrice,
  setCurve,
  setDelta,
  setBuyAmount,
  setError,
}) => {
  const [openCurve, setOpenCurve] = useState<boolean>(false);
  const [buyingAmount, setBuyingAmount] = useState<number>(1);
  const [buyErrorString, setBuyErrorString] = useState<string>();

  const totalAnalyzeData = useMemo(() => {
    let amount = startPrice;
    let totalAmount = 0;
    const points = [];
    for (let i = 1; i <= buyAmount; i++) {
      if (amount <= 0 && buyAmount > 1) {
        setError(true);
        setBuyErrorString(
          `You can only buy up to ${
            i - 1
          } NFTs at the current price curve. Either increase the start price or decrease the delta to allow for more buys.`
        );
        break;
      }

      if (i == buyingAmount) {
        setError(false);
        setBuyErrorString('');
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
  }, [startPrice, buyAmount, buyingAmount, curve.type, setError, delta]);

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

  useEffect(() => {
    if (buyingAmount > buyAmount) {
      setBuyingAmount(buyAmount);
    }
  }, [buyAmount, buyingAmount]);

  useEffect(() => {
    if (curve.type == 'exp' && delta <= 1) {
      setError(true);
    } else if (!buyErrorString?.length) {
      setError(false);
    }
  }, [curve, delta, buyErrorString, setError]);

  return (
    <div className='grid w-full grid-cols-1 gap-5 md:grid-cols-2'>
      <div className='flex flex-col items-center border-[1px] border-slate-600 p-2 md:p-4'>
        <h3 className='text-2xl'>Pool Pricing</h3>
        <p className='mb-5 text-sm'>
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
        <div className='flex flex-col items-start w-full mb-5'>
          <div className='flex flex-row items-center gap-2 text-sm'>
            <span>Bonding Curve</span>
            <div className='relative cursor-pointer group'>
              <FaQuestionCircle size={12} />
              <span className="absolute hidden group-hover:flex -top-4 -right-3 translate-x-full w-48 px-2 py-1 bg-slate-950 rounded-lg text-center text-white text-sm before:content-[''] before:absolute before:top-1/2  before:right-[100%] before:-translate-y-1/2 before:border-8 before:border-y-transparent before:border-l-transparent before:border-r-slate-950 z-10">
                Controls how your pool&lsquo;s price will change
              </span>
            </div>
          </div>
          <div className='relative w-full'>
            <button
              type='button'
              onClick={() => setOpenCurve(true)}
              className='flex items-center justify-center w-full gap-2 py-2 rounded-sm bg-slate-800'
            >
              <Image height={16} width={50} src={curve.icon} alt='Curve Icon' />
              <span>{curve.title}</span>
              <FaChevronDown />
            </button>
            {openCurve && (
              <>
                <div
                  className='fixed top-0 left-0 z-10 w-screen h-screen'
                  onClick={() => setOpenCurve(false)}
                ></div>
                <div className='absolute left-0 right-0 z-20 rounded-md top-full bg-slate-900'>
                  {bondingCurves.map((curve: BondingCurve) => (
                    <button
                      key={curve.type}
                      type='button'
                      onClick={e => {
                        e.stopPropagation();
                        e.preventDefault();

                        setCurve(curve);
                        setOpenCurve(false);
                      }}
                      className='flex items-center justify-center w-full gap-2 py-2 hover:bg-slate-700'
                    >
                      <Image
                        height={16}
                        width={50}
                        src={curve.icon}
                        alt='Curve Icon'
                      />
                      <span>{curve.title}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <div className='flex flex-col items-start w-full mb-2'>
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
        <div className='flex flex-col items-start w-full pl-2 leading-loose'>
          <p className='text-sm'>
            You have selected a starting price of {startPrice} {token.symbol}.
          </p>
          {curve.type == 'XYK' ? (
            <p className='text-sm'>
              Your pool is 1.1x as concentrated as a normal constant product
              curve.
            </p>
          ) : (
            <p className='text-sm'>
              Each time your pool buys an NFT, your buy price will adjust down
              by {delta} {curve.unit}.
            </p>
          )}
        </div>
      </div>
      <div className='flex flex-col items-center border-[1px] border-slate-600 p-2 md:p-4'>
        <h3 className='text-2xl'>Asset Amounts</h3>
        <p className='mb-5 text-sm'>
          Set how many tokens you deposit into the pool.
        </p>
        <div className='w-full grid grid-cols-1 xl:grid-cols-[auto_1fr] gap-2 items-center mb-2'>
          <span className='text-xl'>If you want to buy</span>
          <div className='w-full grid grid-cols-[auto_1fr] border-[1px] border-slate-600'>
            <input
              type='number'
              min={1}
              step={1}
              value={buyAmount}
              onChange={e => setBuyAmount(parseInt(e.target.value ?? '1'))}
              className='w-full px-4 py-2 bg-black outline-none'
            />
            <div className='flex items-center justify-center h-full gap-1 px-4'>
              <FaQuestionCircle />
              <span className='text-sm font-bold uppercase'>
                {collection.symbol}
              </span>
            </div>
          </div>
        </div>
        {buyErrorString && buyErrorString.length && (
          <p className='w-full text-sm text-center text-red-700'>
            {buyErrorString}
          </p>
        )}
        <p className='mb-2 text-xl'>
          you will need to deposit {totalAnalyzeData.totalAmount.toFixed(3)}{' '}
          {token.symbol} total.
        </p>
        <div className='w-full h-[1px] bg-slate-600' />
        <div className='flex flex-col items-center justify-around flex-1 w-full py-10'>
          <p>Buying {buyingAmount} NFTs...</p>
          <input
            type='range'
            min={1}
            max={buyAmount}
            step={1}
            value={buyingAmount}
            onChange={e => setBuyingAmount(parseInt(e.target.value))}
            className='transparent h-1.5 w-1/2 cursor-pointer appearance-none rounded-lg border-transparent bg-slate-400'
          />
          <p>
            will cost you {analyzeData.totalAmount.toFixed(3)} {token.symbol}.
          </p>
        </div>
      </div>
      <div className='md:col-span-2 flex flex-col items-center border-[1px] border-slate-600 p-2 md:p-4'>
        <h3 className='text-2xl'>
          {token.symbol} Price Per {collection.symbol}
        </h3>
        <p className='mb-5 text-sm'>
          Displays how your buy price goes down with each {collection.symbol}{' '}
          bought.
        </p>
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
