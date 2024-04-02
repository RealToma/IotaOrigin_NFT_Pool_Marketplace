import { useMemo, useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';

interface PropsTypes {
  startPrice: number;
  collection: CollectionData;
  token: PaymentToken;
  buyAmount: number;
  setBuyAmount: (amount: number) => void;
  setError: (error: boolean) => void;
  curve: BondingCurve;
  delta: number;
  poolType: number;
  sellAmount: number;
  setSellAmount: (amount: number) => void;
}

const AssetSetting = ({
  startPrice,
  collection,
  token,
  buyAmount,
  setBuyAmount,
  setError,
  curve,
  delta,
  poolType,
  sellAmount,
  setSellAmount,
}: PropsTypes) => {
  const [buyingAmount, setBuyingAmount] = useState<number>(1);
  const [buyErrorString, setBuyErrorString] = useState<string>();
  const [sellErrorString, setSellErrorString] = useState<string>();

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

  const totalAnalyzeDataSell = useMemo(() => {
    let amount = startPrice;
    let totalAmount = 0;
    const points = [];
    for (let i = 1; i <= sellAmount; i++) {
      if (amount <= 0 && sellAmount > 1) {
        setError(true);
        setSellErrorString(
          `You can only sell up to ${
            i - 1
          } NFTs at the current price curve. Either increase the start price or increase the delta to allow for more buys.`
        );
        break;
      }

      if (i == sellAmount) {
        setError(false);
        setSellErrorString('');
      }

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
  }, [startPrice, sellAmount, curve.type, setError, delta]);
  return (
    <div className='flex flex-col items-center p-2 md:p-4 max-w-[500px]'>
      {(poolType === 0 || poolType === 2) && (
        <div className='mb-16'>
          <h3 className='text-3xl'>How many NFTs you want to buy?</h3>
          <div className='w-full grid grid-cols-1 xl:grid-cols-[auto_1fr] gap-2 items-center mb-2 mt-10'>
            <span className='text-lg'>If you want to buy</span>
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
          <p className='mb-2 text-xl text-center'>
            you will need to deposit {totalAnalyzeData.totalAmount.toFixed(3)}{' '}
            {token.symbol} total.
          </p>
        </div>
      )}

      {(poolType === 1 || poolType === 2) && (
        <div>
          <h3 className='text-3xl'>How many NFTs you want to provide?</h3>
          <div className='w-full grid grid-cols-1 xl:grid-cols-[auto_1fr] gap-2 items-center mb-2 mt-10'>
            <span className='text-lg'>If you want to sell</span>
            <div className='w-full grid grid-cols-[1fr_auto] border-[1px] border-slate-600'>
              <input
                type='number'
                min={1}
                step={1}
                value={sellAmount}
                onChange={e => setSellAmount(parseInt(e.target.value ?? '1'))}
                className='flex-1 w-full px-4 py-2 bg-black outline-none'
              />
              <div className='flex items-center justify-center h-full gap-1 px-4'>
                <FaQuestionCircle />
                <span className='text-sm font-bold uppercase'>
                  {collection.symbol}
                </span>
              </div>
            </div>
          </div>
          {sellErrorString && sellErrorString.length && (
            <p className='w-full text-sm text-center text-red-700'>
              {sellErrorString}
            </p>
          )}
          <p className='mb-2 text-xl text-center'>
            you will earn {totalAnalyzeDataSell.totalAmount.toFixed(3)}{' '}
            {token.symbol} total.
          </p>
        </div>
      )}
    </div>
  );
};

export default AssetSetting;
