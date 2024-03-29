import React, { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { Box } from '@mui/material';
import { BackgroundGradient } from './BackgroundGradient';
import Head from 'next/head';

const Header = dynamic(() => import('./Header'), {
  ssr: false,
});

type Props = {
  children: ReactNode;
};

export function Layout({ children }: Props) {
  return (
    <>
      <Head>
        <link rel='shortcut icon' href='/favicon.png' />
      </Head>
      <div className='flex flex-col w-full min-h-screen bg-slate-950 max-w-[100vw] overflow-hidden'>
        <div className='absolute inset-x-0 top-[-10rem] transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]'>
          <BackgroundGradient />
        </div>
        <Header />
        <Content>
          {/*<Sidebar />*/}
          <ContentPage>
            {children}
            <BoxBack01>{/*<TextPools>NFTPools</TextPools>*/}</BoxBack01>
          </ContentPage>
        </Content>
      </div>
    </>
  );
}

const Content = styled(Box)`
  display: flex;
  flex: 1;
  width: 100%;
  max-width: 100vw;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 10;
`;

const ContentPage = styled(Box)`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  max-width: 100vw;
  min-height: 100vh;
  padding: 50px;
  box-sizing: border-box;
  padding-top: 100px;

  @media only screen and (max-width: 1000px) {
    padding: 20px;
    padding-top: 50px;
    padding-bottom: 100px;
  }

  // background: linear-gradient(to bottom, #080808, #002);
  // background-color: #002;

  background-repeat: no-repeat;
  background-position: 50%;
  background-size: cover;
`;

const BoxBack01 = styled(Box)`
  display: flex;
  position: absolute;
  right: 20px;
  top: 50px;
  flex-direction: column;
`;

const TextPools = styled(Box)`
  display: flex;
  opacity: 0.1;
  color: white;
  /* font-family: "Poppins"; */
  /* font-style: normal; */
  font-weight: 600;
  font-size: 208px;
  line-height: 100%;
  /* identical to box height, or 208px */

  text-transform: uppercase;
  writing-mode: vertical-lr;
  text-orientation: mixed;

  @media only screen and (max-width: 1000px) {
    display: none;
  }
`;

export default Layout;
