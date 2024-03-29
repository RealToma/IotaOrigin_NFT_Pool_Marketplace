import React, { useState } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import {
  FaExclamationCircle,
  FaHandSparkles,
  FaShoppingCart,
  FaTimes,
} from 'react-icons/fa';
import Image from 'next/image';
import { LAUNCHPAD_URL } from '@/constants';

const Dashboard: NextPage = () => {
  const [advertise, setAdvertise] = useState<boolean>(false);

  return (
    <div className='w-full h-full flex flex-col flex-1 z-10'>
      {advertise && (
        <div className='flex flex-col lg:flex-row items-center justify-between px-5 py-3.5 mt-4 mb-6 rounded-2xl bg-[#f9ded2]'>
          <div className='flex items-center gap-1'>
            <FaExclamationCircle />
            <div className='text-base font-medium'>
              You like Snippool? Support us by purchasing an NFT{' '}
              <span className='font-bold'>
                <Link
                  href='https://soonaverse.com/nft/0xc246549ad52d98f76452f67b3c34d6c7c33e224d'
                  target='blank'
                >
                  here
                </Link>
              </span>{' '}
              and be part of the future of snippool.xyz!
            </div>
          </div>
          <div
            className='flex items-center ml-4 text-sm cursor-pointer'
            onClick={() => setAdvertise(false)}
          >
            <div className='mr-2 font-semibold text-xxs whitespace-nowrap'>
              I understand
            </div>
            <FaTimes />
          </div>
        </div>
      )}
      <div className='flex-1 flex justify-center items-center text-white'>
        <div className='flex flex-col items-center w-full h-[80vh]'>
          <div className='grid flex-1 w-full grid-cols-1 gap-5 md:grid-cols-2'>
            <div className='relative'>
              <div className='w-full h-full absolute left-0 top-0 -z-10'>
                <Image
                  src='/images/landing-left.png'
                  layout='fill'
                  objectFit='cover'
                  alt='banner'
                />
              </div>
              <Link
                href='/Collections'
                className='w-full h-full relative p-5 flex flex-col justify-center items-center border border-slate-600 rounded-lg hover:border-[#1fcec1] cursor-pointer overflow-hidden bg-[rgba(0, 0, 0, 0.3)] backdrop-blur-lg'
              >
                <h1 className='w-full my-6 text-4xl lg:text-6xl xl:text-8xl text-center'>
                  NFT Pool Marketplace
                </h1>
              </Link>
            </div>
            <div className='relative'>
              <div className='w-full h-full absolute left-0 top-0 -z-10'>
                <Image
                  src='/images/landing-right.png'
                  layout='fill'
                  objectFit='cover'
                  alt='banner'
                />
              </div>
              <Link
                href={LAUNCHPAD_URL}
                className='w-full h-full p-5 flex flex-col justify-center items-center border border-slate-600 rounded-lg hover:border-[#1fcec1] cursor-pointer bg-[rgba(0, 0, 0, 0.1)] backdrop-blur-lg'
              >
                <h1 className='w-full my-6 text-4xl lg:text-6xl xl:text-8xl text-center'>
                  SMR NFT Launchpad
                </h1>
              </Link>
            </div>
          </div>
          <div style={{margin: '20px'}}>
            <a href="https://docs.google.com/document/d/1X9moTUXWMbSQN5x97hyRvNccbu0WNhFUMPYSv7A7SSY/edit?usp=sharing" style={{position: 'absolute',left: '50px',fontSize: '10px'}}><p>Terms and conditions</p></a>
            <a href="https://docs.google.com/document/d/1iUg_N45jwsXZ9S1xYN1ceS-xmd5DPh2CludZsmgBz5Y/edit?usp=sharing" style={{position: 'absolute',left: '245px',fontSize: '10px'}}><p >Privacy Policy</p></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
