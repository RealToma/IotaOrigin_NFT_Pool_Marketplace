import { useState } from 'react';
import { createContext } from 'react';

export const StatsContext = createContext(null);

export const StatsContextProvider = ({ children }: any) => {
  const [lawCollections, setLawCollections] = useState<any[]>([]);
  const [eachCollection, setEachCollection] = useState({});

  return (
    <StatsContext.Provider
      value={
        {
          lawCollections,
          setLawCollections,
          eachCollection,
          setEachCollection,
        } as any
      }
    >
      {children}
    </StatsContext.Provider>
  );
};
