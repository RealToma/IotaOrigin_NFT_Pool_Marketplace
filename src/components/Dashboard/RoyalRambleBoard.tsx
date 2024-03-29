import { useEffect, useState, useMemo } from 'react';
import cx from 'classnames';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import RoyalRambleCollections from '@/constants/royal-ramble-collections.json';
import RoyalRambleRound2Collections from '@/constants/royal-ramble-round2-collections.json';
import RoyalRambleRound3Collections from '@/constants/royal-ramble-round3-collections.json';
import RoyalRambleRound4Collections from '@/constants/royal-ramble-round4-collections.json';
import { computeGasUsedByAddress } from '@/utils/gasTracking';
import { formatNumberWithUnit, shortenAddress } from '@/utils';
import Image from 'next/image';

export const RoyalRambleBoard = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [collections, setCollections] = useState<any[]>();
  const [collections2, setCollections2] = useState<any[]>();
  const [collections3, setCollections3] = useState<any[]>();
  const [collections4, setCollections4] = useState<any[]>();
  const [round, setRound] = useState<number>(1);

  const sortedCollections = useMemo(
    () =>
      round === 1
        ? collections
        : round === 2
        ? collections2
        : round === 3
        ? collections3
        : collections4,
    [round, collections, collections2, collections3, collections4]
  );

  useEffect(() => {
    (async () => {
      let collections = [];
      for (const collection of RoyalRambleCollections) {
        const gasUsed = await computeGasUsedByAddress(
          collection.address,
          Math.floor(new Date(collection.start).getTime() / 1000),
          Math.floor(new Date(collection.end).getTime() / 1000)
        );

        collections.push({
          ...collection,
          gasUsed: gasUsed,
        });
      }

      setCollections(collections.sort((a, b) => b.gasUsed - a.gasUsed));

      collections = [];
      for (const collection of RoyalRambleRound2Collections) {
        const gasUsed = await computeGasUsedByAddress(
          collection.address,
          Math.floor(new Date(collection.start).getTime() / 1000),
          Math.floor(new Date(collection.end).getTime() / 1000)
        );

        collections.push({
          ...collection,
          gasUsed: gasUsed,
        });
      }

      setCollections2(collections.sort((a, b) => b.gasUsed - a.gasUsed));

      collections = [];
      for (const collection of RoyalRambleRound3Collections) {
        const gasUsed = await computeGasUsedByAddress(
          collection.address,
          Math.floor(new Date(collection.start).getTime() / 1000),
          Math.floor(new Date(collection.end).getTime() / 1000)
        );

        collections.push({
          ...collection,
          gasUsed: gasUsed,
        });
      }

      setCollections3(collections.sort((a, b) => b.gasUsed - a.gasUsed));

      collections = [];
      for (const collection of RoyalRambleRound4Collections) {
        const gasUsed = await computeGasUsedByAddress(
          collection.address,
          Math.floor(new Date(collection.start).getTime() / 1000),
          Math.floor(new Date(collection.end).getTime() / 1000)
        );

        collections.push({
          ...collection,
          gasUsed: gasUsed,
        });
      }

      setCollections4(collections.sort((a, b) => b.gasUsed - a.gasUsed));
    })();
  }, []);

  return (
    <div
      className={cx(
        'fixed left-0 top-1/2 -translate-y-1/2 -translate-x-full z-40 transition-all duration-1000',
        {
          '!translate-x-0': open,
        }
      )}
    >
      <div className='relative max-w-[800px] w-[calc(100vw-20px)] bg-black'>
        <div className='flex items-center w-full p-2 text-white'>
          {Array(4)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className={cx('cursor-pointer px-5 py-2 border-slate-300', {
                  'border-b': index + 1 == round,
                })}
                onClick={() => setRound(index + 1)}
              >
                Round {index + 1}
              </div>
            ))}
        </div>
        <div
          className='absolute py-10 -translate-y-1/2 bg-green-700 rounded-r-full cursor-pointer left-full top-1/2'
          onClick={() => setOpen(!open)}
        >
          {open ? <FaChevronLeft /> : <FaChevronRight />}
        </div>
        <div className='flex flex-col p-5 text-white text-start'>
          <div className='grid w-full grid-cols-5 py-1 border-b border-slate-300'>
            <p className=''>Rank</p>
            <p className='col-span-2'>Collection</p>
            <p className=''>Address</p>
            <p>Gas Used</p>
          </div>
          {sortedCollections ? (
            sortedCollections?.length ? (
              sortedCollections.map((item, index) => (
                <div
                  key={item?.address}
                  className='grid w-full grid-cols-5 py-1'
                >
                  <p className=''>#{index + 1}</p>
                  <p className='col-span-2'>{item?.name}</p>
                  <p className=''>{shortenAddress(item?.address)}</p>
                  <p>{formatNumberWithUnit(item?.gasUsed)}</p>
                </div>
              ))
            ) : (
              <p>No Data</p>
            )
          ) : (
            <div className='flex items-center justify-center w-full py-5'>
              <Image width={30} height={30} src='/loading.gif' alt='loading' />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
