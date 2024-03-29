import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaQuestionCircle } from 'react-icons/fa';

interface FeeProps {
  fee: number;
  onClick: () => void;
  className: string;
  disabled: boolean;
}

interface PropsType {
  fee: number;
  setFee: (fee: number) => void;
}

const FeeItem = ({ fee, onClick, className, disabled }: FeeProps) => {
  return (
    <button
      className={`${className} w-[55px] p-2 text-white text-lg bg-slate-800 border border-slate-600 hover:bg-[#1fcec144] text-center transition`}
      onClick={onClick}
      disabled={disabled}
    >
      {fee}%
    </button>
  );
};

const FeeSetting = ({ fee, setFee }: PropsType) => {
  const router = useRouter();
  const { vault } = router.query;
  const feeConfig = [1, 3, 5, 10];

  return (
    <div className='flex flex-col items-center mb-20'>
      <h3 className='text-3xl'>Which fee you want to use?</h3>
      <div className='flex mt-10 gap-x-5'>
        <div className='flex flex-row items-center gap-2 text-sm'>
          <span>Fee Amount</span>
          <div className='relative cursor-pointer group'>
            <FaQuestionCircle size={12} />
            <span className="absolute hidden group-hover:flex -top-4 -right-3 translate-x-full w-48 px-2 py-1 bg-slate-950 rounded-lg text-center text-white text-sm before:content-[''] before:absolute before:top-1/2  before:right-[100%] before:-translate-y-1/2 before:border-8 before:border-y-transparent before:border-l-transparent before:border-r-slate-950 z-10">
              The percent of each trade you take as a fee
            </span>
          </div>
        </div>
        {feeConfig.map((item, key) => (
          <FeeItem
            className={`${
              item === fee ? '!border-[#1fcec1] !bg-[#1fcec144]' : ''
            }`}
            key={key}
            fee={item}
            onClick={() => setFee(item)}
            disabled={!!vault}
          />
        ))}
        <div className='relative w-[80px] ml-4'>
          <span className='absolute right-3 top-[11px]'>%</span>
          <input
            className='w-full h-full px-2 border bg-slate-950 border-slate-600'
            value={fee}
            disabled={!!vault}
            onChange={e => setFee(parseInt(e.target.value) || 0)}
          />
        </div>
      </div>
    </div>
  );
};

export default FeeSetting;
