/* eslint-disable @next/next/no-img-element */
import ChainContext from '@/contexts/ChainContext';
import { useContext } from 'react';

export const LabeledValue = ({
  value,
  label,
  icon,
}: {
  value: any;
  label: string;
  icon?: JSX.Element;
}) => {
  const { tokenSymbol } = useContext(ChainContext) as ChainContextType;
  return (
    <div className='my-2 text-center flex md:flex-col justify-between'>
      <div className='text-[#88B] text-[20px] mb-[5px]'>{label}</div>
      <div className='text-white font-extrabold text-base md:text-lg'>
        {icon}{'\u00a0'}
        {value}
      </div>
    </div>
  );
};
