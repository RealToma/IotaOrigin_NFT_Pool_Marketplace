import { FC } from 'react';
import cx from 'classnames';
import Image from 'next/image';

interface Props {
  type: number | undefined;
  setType: (type: number) => void;
}

const poolTypes = [
  {
    type: 0,
    title: 'Buy NFT with tokens',
    icon: '/images/pools/eth-to-nft.svg',
    description:
      'You will deposit tokens and receive NFTs as people swap their NFTs for your deposited tokens.',
  },
  {
    type: 1,
    title: 'Sell NFT for tokens',
    icon: '/images/pools/nft-to-eth.svg',
    description:
      'You will deposit NFTs and receive tokens as people swap their tokens for your deposited NFTs.',
  },
  {
    type: 2,
    title: 'Do both and earn trading fees',
    icon: '/images/pools/nft-eth-to-fees.svg',
    description:
      'You will deposit both NFTs and tokens and earn trading fees as people buy or sell NFTs using your pool.',
  },
];

export const PoolTypeSelect: FC<Props> = ({ type, setType }) => {
  return (
    <div className='flex flex-col items-center w-full h-full'>
      <h1 className='my-5 text-3xl'>Which pool you want to set up?</h1>
      <div className='grid flex-1 w-full grid-cols-1 gap-5 md:grid-cols-3'>
        {poolTypes.map(poolType => (
          <div
            key={poolType.type}
            className={cx(
              'p-5 flex flex-col justify-center items-center bg-slate-800 border border-slate-600 rounded-lg hover:bg-black hover:border-[#1fcec1] cursor-pointer',
              { '!border-[#1fcec1]': poolType.type === type }
            )}
            onClick={() => setType(poolType.type)}
          >
            <h1 className='my-6 text-2xl text-center'>{poolType.title}</h1>
            <div className='h-24'>
              <Image
                className='h-full !w-auto'
                height={96}
                width={300}
                src={poolType.icon}
                alt='Pool Icon'
              />
            </div>
            <p className='mt-6 text-sm'>{poolType.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
