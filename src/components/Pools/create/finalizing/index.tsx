import { FC } from 'react';
import { EthToNft } from './EthToNft';
import { NftToEth } from './NftToEth';
import { EthNftToFee } from './EthNftToFee';

interface Props {
  collection: CollectionData;
  token: PaymentToken;
  type: number;
  fee: number;
  startPrice: number;
  curve: BondingCurve;
  delta: number;
  buyAmount: number;
  sellAmount: number;
}

export const FinalizingPool: FC<Props> = ({
  type,
  collection,
  token,
  fee,
  startPrice,
  curve,
  delta,
  buyAmount,
  sellAmount,
}) => {
  return (
    <>
      {type == 0 && (
        <EthToNft
          collection={collection}
          token={token}
          startPrice={startPrice}
          curve={curve}
          delta={delta}
          buyAmount={buyAmount}
        />
      )}
      {type == 1 && (
        <NftToEth
          collection={collection}
          token={token}
          startPrice={startPrice}
          curve={curve}
          delta={delta}
          sellAmount={sellAmount}
        />
      )}
      {type == 2 && (
        <EthNftToFee
          collection={collection}
          token={token}
          fee={fee}
          startPrice={startPrice}
          curve={curve}
          delta={delta}
          buyAmount={buyAmount}
          sellAmount={sellAmount}
        />
      )}
    </>
  );
};
