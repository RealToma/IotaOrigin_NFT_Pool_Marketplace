import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { NextPage } from 'next';
import Footer from '@/layout/Footer';
import BoxEachPool from '@/components/Pools/BoxEachPool';
import { MdAddBox } from 'react-icons/md';
import { useAccount } from 'wagmi';
import CreateVaultsFrame from '@/components/CreateVaultsFrame';
import { useSubgraphData } from '@/hooks/useSubgraphData';
import { GET_ALL_VAULTS } from '@/constants/subgraphQueries';
import Head from 'next/head';
import Dropdown from '@/components/Dropdown';

const Pools: NextPage = () => {
  const { address } = useAccount();

  const [openCreatePool, setOpenCreatePool] = useState(false);
  const [onlyStaked, setOnlyStaked] = useState(false);
  const [onlyMyVaults, setOnlyMyVaults] = useState(false);
  const [sortInd, setSortInd] = useState<number>(0);
  const [limit, setLimit] = useState<number>(30);
  const [offset, setOffset] = useState<number>(0);
  const ref = useRef();
  const data = useSubgraphData(GET_ALL_VAULTS, {
    first: limit,
    skip: offset,
  });

  const filteredVaults = useMemo(() => {
    if (!data?.vaults) {
      return [];
    }

    let filteredVaults;
    if (onlyStaked) {
      filteredVaults = data?.vaults.filter((vault: VaultData) => {
        for (let pairToken of vault.stakedPairs) {
          if (pairToken.pair.owner.id === address?.toLowerCase()) return true;
        }
        return false;
      });
    } else if (onlyMyVaults) {
      filteredVaults = data?.vaults.filter(
        (vault: VaultData) => vault.owner.id == address?.toLowerCase()
      );
    } else {
      filteredVaults = data?.vaults;
    }

    if (sortInd === 1) {
      let sortedArr = filteredVaults.sort((p1: any, p2: any) =>
        p1.nft.name < p2.nft.name ? -1 : p1.nft.name > p2.nft.name ? 1 : 0
      );
      return sortedArr;
    } else if (sortInd === 2) {
      let sortedArr = filteredVaults.sort((p1: any, p2: any) =>
        p1.startTime < p2.startTime ? 1 : p1.startTime > p2.startTime ? -1 : 0
      );
      return sortedArr;
    } else if (sortInd === 3) {
      let sortedArr = filteredVaults.sort((p1: any, p2: any) =>
        p1.endTime < p2.endTime ? 1 : p1.endTime > p2.endTime ? -1 : 0
      );
      return sortedArr;
    }

    return filteredVaults;
  }, [data?.vaults, onlyStaked, address, sortInd, onlyMyVaults]);

  const onClickFilter = (key: number) => {
    if (key === 0) {
      setOnlyStaked(false);
      setOnlyMyVaults(false);
    } else if (key === 1) {
      setOnlyStaked(true);
      setOnlyMyVaults(false);
    } else if (key === 2) {
      setOnlyStaked(false);
      setOnlyMyVaults(true);
    }
  };

  const onClickSort = (key: number) => {
    setSortInd(key + 1);
    let sortedArr;
    if (key === 0) {
      sortedArr = filteredVaults.sort((p1: any, p2: any) =>
        p1.startTime < p2.startTime ? 1 : p1.startTime > p2.startTime ? -1 : 0
      );
    }
  };

  return (
    <>
      <Head>
        <title>Snip Pool | Vaults</title>
      </Head>
      <div className='w-full flex h-[max-content] flex-col z-60'>
        <div className='flex font-semiBold text-white uppercase text-[40px] [text-shadow:5px_5px_1px_rgb(0_0_0_/_40%)]'>
          Vaults
        </div>
        {/* <div className='border-white/30 border-[1px] w-[200px] text-center p-3 rounded-md text-white'>
          <input
            type='checkbox'
            id='onlyStaked'
            name='onlyStaked'
            checked={onlyStaked}
            onChange={() => setOnlyStaked(!onlyStaked)}
          />
          <label htmlFor='onlyStaked'> Only show staked</label>
        </div> */}
        <div className='flex w-full gap-x-10'>
          <Dropdown
            label='Filter By'
            onClick={(key: number) => onClickFilter(key)}
            data={['Show all', 'Staked', 'My vaults']}
          />

          <Dropdown
            label='Sort By'
            onClick={(key: number) => onClickSort(key)}
            data={['Name', 'Start Date', 'End Date']}
          />
        </div>

        <div className='mt-10 md:mt-[100px] flex items-center'>
          <button
            type='button'
            className='w-[250px] h-[50px] mr-[30px] flex justify-center items-center text-[1.3rem] font-bold rounded-lg uppercase bg-[#1fcec1] text-black transition-[0.5s]'
            onClick={() => {
              setOpenCreatePool(true);
            }}
          >
            <div className='flex mr-[10px]'>
              <MdAddBox fontSize={'1.6rem'} />
            </div>
            <div className='flex'>Create Vault</div>
          </button>
        </div>
        <div className='my-[50px] grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-[50px] transition-[0.5s]'>
          {filteredVaults.map((each: VaultData) => {
            return (
              <BoxEachPool each={each} key={each.id} onlyStaked={onlyStaked} />
            );
          })}
        </div>
      </div>
      <Footer />
      <CreateVaultsFrame
        isOpen={openCreatePool}
        close={() => setOpenCreatePool(false)}
      />
    </>
  );
};

export default Pools;
