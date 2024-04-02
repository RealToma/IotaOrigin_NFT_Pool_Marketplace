import type { NextPage } from 'next';
import Dashboard from './Dashboard/Dashboard';
import Head from 'next/head';

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Snip Pool</title>
      </Head>
      <Dashboard />
    </>
  );
};

export default Home;
