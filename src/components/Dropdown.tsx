import { useState, useRef } from 'react';
import useOnClickOutside from '@/hooks/useOnClickOutside';

interface DropdownProps {
  label: string;
  data?: string[];
  onClick: (key: number) => void;
}

const Dropdown = ({ label, data, onClick }: DropdownProps) => {
  const [isOpenDrop, setOpenDrop] = useState(false);
  const [dropLabel, setDropLabel] = useState<string>(label);
  const ref = useRef<any>(null);

  const handleClickOutside = (): void => {
    setOpenDrop(false);
  };

  useOnClickOutside({ ref, onClickOutside: handleClickOutside });

  return (
    <div
      ref={ref}
      className='relative border-white/30 border bg-transparent min-w-[200px] rounded-md px-3 h-[50px] text-white hover:cursor-pointer flex items-center'
      onClick={() => setOpenDrop(prev => !prev)}
    >
      {dropLabel}
      <i className='absolute right-4 top-4 rotate-[135deg] border-white border-t-[2px] border-r-[2px] m-auto inline-block p-[4px]'></i>

      {isOpenDrop && (
        <div className='absolute top-[50px] left-0 flex flex-col w-full'>
          {data?.map((item, key) => (
            <div
              key={key}
              className='border border-white/30 border-t-0 px-3 py-1 hover:bg-[#ffffff20]'
              onClick={() => {
                onClick(key);
                setDropLabel(item);
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
