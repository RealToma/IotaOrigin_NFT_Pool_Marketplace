import { FC, PropsWithChildren, createContext, useState } from 'react';

const PoolContext = createContext<PoolContextType | null>(null);

export const PoolContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [fee, setFee] = useState<number>();
  const [delta, setDelta] = useState<number>();
  const [spotPrice, setSpotPrice] = useState<number>();
  const [poolAddress, setPoolAddress] = useState<string>();
  const [collection, setCollection] = useState<CollectionData>();
  const [bondingCurveAddress, setBondingCurveAddress] = useState<string>();

  return (
    <PoolContext.Provider
      value={{
        fee,
        delta,
        spotPrice,
        poolAddress,
        collection,
        bondingCurveAddress,
      }}
    >
      {children}
    </PoolContext.Provider>
  );
};

export default PoolContext;
