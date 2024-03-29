import React, { useState, useMemo } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Box } from '@mui/material';
import styled from 'styled-components';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { emojiAvatarForAddress } from '@/utils/emojiAvatarForAddress';
import { shortenAddress } from '@/utils';

import { FaChevronDown, FaDiscord } from 'react-icons/fa';
import imgLogo from '@/assets/images/logo.png';
import { useRouter } from 'next/router';
import { LAUNCHPAD_URL } from '@/constants';

const NavItem = ({
  path,
  icon_src,
  label,
  target,
}: {
  path: string;
  icon_src: string;
  label: string;
  target?: string;
}) => {
  return (
    <Link href={path} className='text-center' target={target}>
      <TextPageLink>
        <img className='mx-auto' src={icon_src} alt='icon' />
        {label}
      </TextPageLink>
    </Link>
  );
};

const Header: NextPage = () => {
  const { isConnected, address } = useAccount();
  const router = useRouter();

  const [dropDownOpen, setDropDownOpen] = useState<boolean>(false);
  const [isMoreMenuOpen, setMoreMenuOpen] = useState<boolean>(false);

  const { color: backgroundColor, emoji } = useMemo(
    () => emojiAvatarForAddress(address as string),
    [address]
  );

  return router.asPath == '/' ? (
    <></>
  ) : (
    <>
      <div className='flex items-center justify-between w-full h-20 min-h-20 px-5 md:px-24 z-50 fixed bg-[rgba(0, 0, 0, 0.3)] border-b border-[rgba(255,255,255,0.1)] backdrop-blur-md top-0 left-0'>
        <BoxLogo01>
          <Link href='/'>
            <Image src={imgLogo} width={150} height={50} alt={''} />
          </Link>
        </BoxLogo01>

        <div className='flex-row-reverse items-center justify-start flex-1 hidden gap-10 mr-10 lg:flex'>
          <BoxRight01>
            <div className='flex flex-row items-center gap-2'>
              <div className='relative'>
                <div
                  className='flex flex-row items-center gap-2 py-2 font-bold text-slate-400 cursor-pointer hover:text-white text-md'
                  onClick={() => setMoreMenuOpen(prev => !prev)}
                >
                  More ...
                </div>
                {isMoreMenuOpen && (
                  <>
                    <div
                      className='fixed top-0 left-0 z-10 w-screen h-screen'
                      onClick={() => setMoreMenuOpen(false)}
                    ></div>
                    <div className='absolute top-full w-max left-0 flex flex-col items-start gap-4 p-5 bg-slate-800 border border-slate-700 rounded-sm translate-y-3 connect-button__container z-50'>
                      <NavItem
                        path='https://docs.snippool.xyz/'
                        icon_src='/images/doc.svg'
                        label='Docs'
                        target='_blank'
                      />
                      <NavItem
                        path={LAUNCHPAD_URL}
                        icon_src='/images/doc.svg'
                        label='Create collection'
                        target='_blank'
                      />
                      <NavItem
                        path=' http://v1.snippool.xyz/ '
                        icon_src='/images/doc.svg'
                        label='Open V1 Site'
                        target='_blank'
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </BoxRight01>
          <NavItem
            path='/Wallet'
            icon_src='/images/vault.svg'
            label='My NFTS'
          />
          <NavItem
            path='/MyPools'
            icon_src='/images/swap.svg'
            label='My Pools'
          />
          <NavItem path='/vaults' icon_src='/images/vault.svg' label='Vaults' />
          <NavItem
            path='/Collections'
            icon_src='/images/collections.svg'
            label='Collections'
          />
        </div>
        <BoxRight01>
          <div className='flex flex-row items-center gap-2'>
            {isConnected ? (
              <div className='relative'>
                <div
                  className='flex flex-row items-center gap-2 px-5 py-2 font-bold text-white bg-opacity-50 rounded-full cursor-pointer bg-slate-700 hover:bg-white hover:text-slate-700 text-md'
                  onClick={() => setDropDownOpen(prev => !prev)}
                >
                  <div
                    className='rounded-full'
                    style={{ backgroundColor: backgroundColor }}
                  >
                    {emoji}
                  </div>
                  <span className='hidden md:block'>
                    {address && shortenAddress(address)}
                  </span>
                  <FaChevronDown />
                </div>
                {dropDownOpen && (
                  <>
                    <div
                      className='fixed top-0 left-0 z-10 w-screen h-screen'
                      onClick={() => setDropDownOpen(false)}
                    ></div>
                    <div className='absolute top-full right-0 w-[300px] flex flex-col items-center gap-2 p-2 bg-slate-800 border border-slate-700 rounded-sm translate-y-3 connect-button__container z-50'>
                      <ConnectButton />
                      {/* <Link
                        href='/MyPools'
                        onClick={() => setDropDownOpen(false)}
                        className='w-full flex justify-center items-center rounded-xl bg-black text-white p-2 text-base font-semibold hover:scale-[1.05] leading-none'
                      >
                        My Pools
                      </Link>
                      <Link
                        href='/Wallet'
                        onClick={() => setDropDownOpen(false)}
                        className='w-full flex justify-center items-center rounded-xl bg-black text-white p-2 text-base font-semibold hover:scale-[1.05] leading-none'
                      >
                        My Wallet
                      </Link> */}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <ConnectButton label='Connect' />
            )}
          </div>
        </BoxRight01>
      </div>
      <div className='flex items-center justify-between w-full h-20 min-h-20 px-5 md:px-24 z-50 fixed bg-[rgba(0, 0, 0, 0.3)] border-b border-[rgba(255,255,255,0.1)] backdrop-blur-md bottom-0 left-0 lg:hidden'>
        <div className='grid w-full grid-cols-5'>
          <NavItem path='/vaults' icon_src='/images/vault.svg' label='Vaults' />
          <NavItem
            path='/Collections'
            icon_src='/images/collections.svg'
            label='Collections'
          />
          <NavItem
            path='/MyPools'
            icon_src='/images/swap.svg'
            label='My Pools'
          />
          <NavItem
            path='/Wallet'
            icon_src='/images/vault.svg'
            label='My NFTS'
          />
          <NavItem
            path='https://docs.snippool.xyz/'
            icon_src='/images/doc.svg'
            label='Docs'
            target='_blank'
          />
        </div>
      </div>
    </>
  );
};

const TextPageLink = styled(Box)`
  display: inline-block;
  font-weight: 600;
  font-size: 16px;
  opacity: 0.6;
  margin: 0 auto;
  cursor: pointer;
  transition: 0.15s;
  text-align: center;
  align-content: center;
  color: #ffffff;

  &:hover {
    opacity: 1;
  }

  img {
    display: none;
    margin: 0 auto;
  }

  @media only screen and (max-width: 768px) {
    font-size: 10px;
    img {
      display: block;
      width: 38px;
    }
  }
`;

const BoxLogo01 = styled(Box)`
  display: flex;
  cursor: pointer;
  margin-right: 50px;
`;

const BoxRight01 = styled(Box)`
  display: flex;
  align-items: center;

  // @media only screen and (max-width: 768px) {
  //   display: none;
  // }
`;

const Selection = styled(Box)<{ selection: string }>`
  border-radius: 10px;
  padding: 8px 16px;
  width: 150px;
  transition: 0.2s background-color;
  cursor: pointer;
  margin-right: 10px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.06);
  }
  &[selection='true'] #Options {
    display: block;
  }

  @media only screen and (max-width: 768px) {
    display: none;
  }
`;

export default Header;
