import { FC, useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { ModalFrame } from '../ModalFrame';
import { shortenAddress } from '@/utils';
import { tokens } from '@/constants';

interface SelectProps {
  token: PaymentToken;
  setToken: (value: PaymentToken) => void;
  disabled?: boolean;
}

const TokenSelect: FC<SelectProps> = ({
  token,
  setToken,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className='relative text-white'>
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className='w-[200px] py-2 flex justify-center items-center gap-1 text-sm border-[1px] border-slate-600 rounded-md'
      >
        <span>{token.symbol}</span>
        <FaChevronDown />
      </button>
      <ModalFrame
        title={`Choose Token`}
        isOpen={isOpen}
        close={() => setIsOpen(false)}
      >
        <div className='flex flex-col items-center'>
          <div className='flex flex-col w-full gap-2 py-2 text-white'>
            {tokens.map((item: any) => (
              <button
                key={item.symbol}
                type='button'
                onClick={() => {
                  setToken(item);
                  setIsOpen(false);
                }}
                className='flex flex-row items-center justify-center w-full gap-2 p-2 border rounded-sm border-slate-600'
              >
                <span>
                  {item.symbol}({shortenAddress(item.address)})
                </span>
              </button>
            ))}
          </div>
        </div>
      </ModalFrame>
    </div>
  );
};

export default TokenSelect;
