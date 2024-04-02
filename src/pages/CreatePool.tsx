import { useContext, useEffect, useState } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Footer from '@/layout/Footer';
import { PoolTypeSelect } from '@/components/Pools/create/PoolTypeSelect';
import CreateModeSelect from '@/components/Pools/create/CreateModeSelect';
import { AssetSelect } from '@/components/Pools/create/AssetSelect';
import { ConfiguringParameter } from '@/components/Pools/create/parameter';
import { bondingCurves } from '@/constants/curves';
import { FinalizingPool } from '@/components/Pools/create/finalizing';
import { useSubgraphData } from '@/hooks/useSubgraphData';
import { GET_NFT_DATA, GET_VAULT } from '@/constants/subgraphQueries';
import ChainContext from '@/contexts/ChainContext';
import { formatBigNumberWithUnits } from '@/utils';
import Head from 'next/head';
import SetPrice from '@/components/Pools/create/easyMode/SetPrice';
import BondingCurve from '@/components/Pools/create/easyMode/BondingCurve';
import DeltaSetting from '@/components/Pools/create/easyMode/DeltaSetting';
import FeeSetting from '@/components/Pools/create/easyMode/FeeSetting';
import AssetSetting from '@/components/Pools/create/easyMode/AssetSetting';
import { tokens } from '@/constants';

const CreatePool: NextPage = () => {
  const router = useRouter();
  const { vault, nft, selectedNfts, token: pairToken } = router.query;

  const { linearCurveAddress, exponentialCurveAddress } = useContext(
    ChainContext
  ) as ChainContextType;

  const vaultData = useSubgraphData(GET_VAULT, {
    id: (vault as string)?.toLowerCase(),
  });
  const collectionData = useSubgraphData(GET_NFT_DATA, {
    id: nft,
  });

  const [step, setStep] = useState<number>(0);
  const [modeType, setModeType] = useState<number>(0);
  const [poolType, setPoolType] = useState<number>(0);
  const [token, setToken] = useState<PaymentToken>(tokens[0]);
  const [collection, setCollection] = useState<CollectionData>();
  const [fee, setFee] = useState<number>(0);
  const [startPrice, setStartPrice] = useState<number>(0);
  const [curve, setCurve] = useState<BondingCurve>(bondingCurves[0]);
  const [delta, setDelta] = useState<number>(0);
  const [buyAmount, setBuyAmount] = useState<number>(1);
  const [sellAmount, setSellAmount] = useState<number>(1);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!vaultData?.vault) {
      return;
    }

    if (vaultData?.vault?.bondingCurve === linearCurveAddress.toLowerCase()) {
      setCurve(bondingCurves[0]);
    } else if (
      vaultData?.vault?.bondingCurve === exponentialCurveAddress.toLowerCase()
    ) {
      setCurve(bondingCurves[1]);
    }

    const fee = parseFloat(
      formatBigNumberWithUnits(vaultData?.vault?.fee ?? '0', 16)
    );
    const delta =
      vaultData?.vault?.bondingCurve === linearCurveAddress.toLowerCase()
        ? parseFloat(formatBigNumberWithUnits(vaultData?.vault?.delta ?? '0'))
        : parseFloat(formatBigNumberWithUnits(vaultData?.vault?.delta ?? '0')) *
            100 -
          100;

    setFee(fee);
    setDelta(delta);
    setCollection(vaultData.vault.nft);
    const paymentToken = tokens.filter(
      token => token.address.toLowerCase() === vaultData.vault.tokenAddress
    )[0];
    setToken(paymentToken);
    setPoolType(2);
    setStep(2);
  }, [exponentialCurveAddress, linearCurveAddress, vaultData?.vault]);

  useEffect(() => {
    if (!collectionData?.collection) {
      return;
    }

    setCollection(collectionData.collection);
    setPoolType(1);
    setFee(0);
    setCurve(bondingCurves[0]);
    setSellAmount(selectedNfts?.length ?? 0);
    setModeType(0);
    setStep(3);
  }, [collectionData?.collection, selectedNfts]);

  useEffect(() => {
    if (!pairToken) {
      return;
    }

    const paymentToken = tokens.filter(
      token =>
        token.address.toLowerCase() === (pairToken as string).toLowerCase()
    )[0];
    setToken(paymentToken);
  }, [pairToken]);

  useEffect(() => {
    if (step == 8) {
      return;
    }

    if (collectionData?.collection && step > 3) {
      setStep(8);
    }
  }, [collectionData?.collection, step]);

  return (
    <>
      <Head>
        <title>Snip Pool | Create Pair</title>
      </Head>
      <div className='flex flex-col w-full min-h-full h-[max-content]'>
        <div className='flex flex-1 flex-col items-center p-5 w-full border-[1px] border-slate-600 rounded-md text-white'>
          <div className='flex flex-col items-center w-full'>
            <h1 className='my-3 text-4xl text-center'>Create Pool</h1>
            <p className='my-2 text-base text-center'>
              Provide liquidity to buy, sell, or trade NFTs on your behalf.
            </p>
            <div className='w-full h-[1px] bg-slate-600' />
            <div className='flex w-full'>
              <span className='my-2 text-base text-slate-200'>
                Step {step + 1}/{modeType === 0 ? (poolType === 2 ? 9 : 8) : 5}:{' '}
                {step == 1 && 'Selecting Pool Type'}
                {step == 2 && 'Selecting Assets'}
                {step == 3
                  ? modeType === 1
                    ? 'Configuring Pool Parameters'
                    : 'Configuring Price'
                  : ''}
                {step == 4
                  ? modeType === 1
                    ? 'Finalizing Deposit'
                    : 'Configuring Curve'
                  : ''}
                {step === 5 && 'Configuring Delta'}
                {step === 6
                  ? poolType === 2
                    ? 'Configuring Fee'
                    : 'Configuring Assets'
                  : ''}
                {step === 7
                  ? poolType === 2
                    ? 'Configuring Assets'
                    : 'Finalizing Deposit'
                  : ''}
                {step === 8 && 'Finalizing Deposit'}
              </span>
            </div>
          </div>
          <div className='flex items-center justify-center flex-1 w-full py-5'>
            {step == 0 && (
              <CreateModeSelect mode={modeType} setModeType={setModeType} />
            )}
            {step == 1 && (
              <PoolTypeSelect type={poolType} setType={setPoolType} />
            )}
            {step == 2 && (
              <AssetSelect
                type={poolType}
                token={token}
                collection={collection}
                setToken={setToken}
                setCollection={setCollection}
              />
            )}
            {step == 3 && modeType === 1 ? (
              <ConfiguringParameter
                collection={collection!}
                token={token}
                type={poolType}
                fee={fee}
                setFee={setFee}
                startPrice={startPrice}
                setStartPrice={setStartPrice}
                curve={curve}
                setCurve={setCurve}
                delta={delta}
                setDelta={setDelta}
                buyAmount={buyAmount}
                setBuyAmount={setBuyAmount}
                sellAmount={sellAmount}
                setSellAmount={setSellAmount}
                setError={setError}
              />
            ) : step == 3 && modeType === 0 ? (
              <SetPrice
                startPrice={startPrice}
                setStartPrice={setStartPrice}
                token={token}
                collection={collection!}
                curve={curve}
                delta={delta}
              />
            ) : (
              ''
            )}
            {step == 4 && modeType === 1 ? (
              <FinalizingPool
                collection={collection!}
                token={token}
                type={poolType}
                fee={fee}
                startPrice={startPrice}
                curve={curve}
                delta={delta}
                buyAmount={buyAmount}
                sellAmount={sellAmount}
              />
            ) : step == 4 && modeType === 0 ? (
              <BondingCurve curve={curve} setCurve={setCurve} />
            ) : (
              ''
            )}

            {step === 5 && (
              <DeltaSetting
                startPrice={startPrice}
                curve={curve}
                type={poolType}
                delta={delta}
                setDelta={setDelta}
                token={token}
              />
            )}
            {step === 6 ? (
              poolType === 2 ? (
                <FeeSetting fee={fee} setFee={setFee} />
              ) : (
                <AssetSetting
                  startPrice={startPrice}
                  collection={collection!}
                  token={token}
                  buyAmount={buyAmount}
                  setBuyAmount={setBuyAmount}
                  setError={setError}
                  curve={curve}
                  delta={delta}
                  poolType={poolType}
                  sellAmount={sellAmount}
                  setSellAmount={setSellAmount}
                />
              )
            ) : (
              ''
            )}
            {step === 7 ? (
              poolType === 2 ? (
                <AssetSetting
                  startPrice={startPrice}
                  collection={collection!}
                  token={token}
                  buyAmount={buyAmount}
                  setBuyAmount={setBuyAmount}
                  setError={setError}
                  curve={curve}
                  delta={delta}
                  poolType={poolType}
                  sellAmount={sellAmount}
                  setSellAmount={setSellAmount}
                />
              ) : (
                <FinalizingPool
                  collection={collection!}
                  token={token}
                  type={poolType}
                  fee={fee}
                  startPrice={startPrice}
                  curve={curve}
                  delta={delta}
                  buyAmount={buyAmount}
                  sellAmount={sellAmount}
                />
              )
            ) : (
              ''
            )}
            {step === 8 && (
              <FinalizingPool
                collection={collection!}
                token={token}
                type={poolType}
                fee={fee}
                startPrice={startPrice}
                curve={curve}
                delta={delta}
                buyAmount={buyAmount}
                sellAmount={sellAmount}
              />
            )}
          </div>
          <div className='flex items-center justify-between w-full'>
            {step == 0 ? (
              <div></div>
            ) : (
              <button
                type='button'
                onClick={() => (nft ? setStep(3) : setStep(prev => prev - 1))}
                className='py-2 w-24 md:w-[160px] text-center border-[1px] border-slate-600 rounded-md'
                disabled={(!!vault && step == 2) || (!!nft && step == 2)}
              >
                Prev Step
              </button>
            )}
            {(step >= 4 && modeType === 1) ||
            (step >= 7 && modeType === 0 && poolType !== 2) ||
            (step >= 8 && modeType === 0 && poolType === 2) ? (
              <></>
            ) : (
              <button
                type='button'
                disabled={
                  (step == 2 && !collection) ||
                  (step == 3 && !fee && !startPrice && !delta) ||
                  error
                }
                onClick={() => setStep(prev => prev + 1)}
                className='py-2 w-24 md:w-[160px] text-center border-[1px] border-slate-600 rounded-md'
              >
                Next Step
              </button>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default CreatePool;
