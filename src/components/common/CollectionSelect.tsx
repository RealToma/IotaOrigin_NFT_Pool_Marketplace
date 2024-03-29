import { FC, useRef, useState, useEffect } from 'react';
import { useSubgraphData } from '@/hooks/useSubgraphData';
import { GET_ALL_NFT_CONTRACTS } from '@/constants/subgraphQueries';
import { NotificationManager } from 'react-notifications';
import { isAddress } from 'ethers/lib/utils.js';
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa';
import { ModalFrame } from '../ModalFrame';
import { shortenAddress } from '@/utils';

interface SelectProps {
  collection?: CollectionData;
  setCollection: (collection: CollectionData) => void;
  disabled: boolean;
}

const CollectionSelect: FC<SelectProps> = ({
  collection,
  setCollection,
  disabled,
}) => {
  const timerRef = useRef<NodeJS.Timer>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [offset, setOffset] = useState<number>(0);
  const [inputSymbol, setInputSymbol] = useState<string>(collection?.id ?? '');
  const [filter, setFilter] = useState<string>('');

  const data = useSubgraphData(GET_ALL_NFT_CONTRACTS, {
    first: 10,
    skip: offset,
    filter: filter,
  });

  const handleSelect = () => {
    const selected = (data?.collections ?? []).find(
      (collection: CollectionData) => collection.id == inputSymbol
    );
    if (!selected) {
      NotificationManager.error('Invalid address');
      return;
    }

    setCollection(selected);

    setIsOpen(false);
  };

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (isAddress(inputSymbol)) {
      return;
    }

    timerRef.current = setTimeout(() => setFilter(inputSymbol), 500);

    return () => clearTimeout(timerRef.current);
  }, [inputSymbol]);

  return (
    <div className='relative text-white'>
      <button
        type='button'
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        className='w-[200px] py-2 flex justify-center items-center gap-1 text-sm border-[1px] border-slate-600 rounded-md'
      >
        <span>
          {collection
            ? `${collection.name} (${collection.symbol})`
            : `Choose Collection`}
        </span>
        <FaChevronDown />
      </button>
      <ModalFrame
        title={`Choose Collection`}
        isOpen={isOpen}
        close={() => setIsOpen(false)}
      >
        <div className='flex flex-col items-center'>
          <input
            type='string'
            value={inputSymbol}
            placeholder='Input symbol or name here to search'
            onChange={e => setInputSymbol(e.target.value)}
            onKeyUp={e => {
              e.stopPropagation();
              e.preventDefault();

              if (e.key == 'Enter') {
                setIsOpen(false);
              }
            }}
            className='w-full p-2 text-white bg-slate-950 rounded-sm border-[1px] border-slate-600 outline-none'
          />
          <div className='flex flex-col w-full gap-2 py-2 text-white'>
            {(data?.collections ?? []).map((collection: any) => (
              <button
                key={collection.id}
                type='button'
                onClick={() => setInputSymbol(collection.id)}
                className='flex flex-row items-center justify-center w-full gap-2 p-2 border rounded-sm border-slate-600'
              >
                <FaQuestionCircle />
                <span>
                  {collection.name}({collection.symbol} -{' '}
                  {shortenAddress(collection.id)})
                </span>
              </button>
            ))}
            <div className='flex items-center justify-between w-full'>
              {offset == 0 ? (
                <div></div>
              ) : (
                <button
                  type='button'
                  onClick={() => setOffset(prev => prev - 30)}
                  className='py-2 w-[160px] text-center border-[1px] border-slate-600 rounded-md'
                >
                  Prev Step
                </button>
              )}
              {(data?.collection?.length ?? 0) < 30 ? (
                <></>
              ) : (
                <button
                  type='button'
                  onClick={() => setOffset(prev => prev + 30)}
                  className='py-2 w-[160px] text-center border-[1px] border-slate-600 rounded-md'
                >
                  Next Step
                </button>
              )}
            </div>
          </div>
          <button
            type='button'
            onClick={handleSelect}
            className='w-[250px] h-[40px] mr-[30px] flex justify-center items-center text-sm font-bold rounded-lg uppercase bg-[#1fcec1] text-black transition-[0.5s]'
          >
            Select
          </button>
        </div>
      </ModalFrame>
    </div>
  );
};

export default CollectionSelect;
