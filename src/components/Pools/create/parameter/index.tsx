import { FC } from 'react';
import { EthToNft } from './EthToNft';
import { NftToEth } from './NftToEth';
import { EthNftToFee } from './EthNftToFee';

interface Props {
  collection: CollectionData;
  token: PaymentToken;
  type: number;
  fee: number;
  setFee: (fee: number) => void;
  startPrice: number;
  setStartPrice: (startPrice: number) => void;
  curve: BondingCurve;
  setCurve: (curve: BondingCurve) => void;
  delta: number;
  setDelta: (delta: number) => void;
  buyAmount: number;
  setBuyAmount: (amount: number) => void;
  sellAmount: number;
  setSellAmount: (amount: number) => void;
  setError: (error: boolean) => void;
}

export const ConfiguringParameter: FC<Props> = ({
  type,
  collection,
  token,
  fee,
  startPrice,
  curve,
  delta,
  buyAmount,
  sellAmount,
  setFee,
  setStartPrice,
  setCurve,
  setDelta,
  setBuyAmount,
  setSellAmount,
  setError,
}) => {
  return (
    <>
      {type == 0 && (
        <EthToNft
          collection={collection}
          token={token}
          startPrice={startPrice}
          setStartPrice={setStartPrice}
          curve={curve}
          setCurve={setCurve}
          delta={delta}
          setDelta={setDelta}
          buyAmount={buyAmount}
          setBuyAmount={setBuyAmount}
          setError={setError}
        />
      )}
      {type == 1 && (
        <NftToEth
          collection={collection}
          token={token}
          startPrice={startPrice}
          setStartPrice={setStartPrice}
          curve={curve}
          setCurve={setCurve}
          delta={delta}
          setDelta={setDelta}
          sellAmount={sellAmount}
          setSellAmount={setSellAmount}
          setError={setError}
        />
      )}
      {type == 2 && (
        <EthNftToFee
          collection={collection}
          token={token}
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
      )}
    </>
  );
};
