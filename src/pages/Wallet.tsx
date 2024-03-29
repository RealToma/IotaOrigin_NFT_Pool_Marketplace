import type { NextPage } from 'next';
import NFTWallet from '../components/NFTWallet';
import Head from 'next/head';

const MyNfts: NextPage = () => {
  return (
    <>
      <Head>
        <title>Snip Pool | My NFTs</title>
      </Head>
      <h1 className='text-white text-[30px] font-bold mb-10'>My NFTs</h1>
      <NFTWallet />
    </>
  );
};

export default MyNfts;
