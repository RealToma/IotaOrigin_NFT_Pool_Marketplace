import { tokens } from '@/constants';
import {
  createContext,
  FC,
  PropsWithChildren,
  useState,
  useCallback,
  useEffect,
  useContext,
} from 'react';
import axios from 'axios';

type PriceData = {
  data: Record<string, number>;
};

const TokenPriceContext = createContext<PriceData>({ data: {} });

export const TokenPriceContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [data, setData] = useState<Record<string, number>>({});

  const fetchData = useCallback(async () => {
    const tokenContracts = tokens.map(item => item.priceFeed);

    try {
      const priceData = await axios.get(
        `https://api.geckoterminal.com/api/v2/simple/networks/shimmerevm/token_price/${tokenContracts.join(
          '%2C'
        )}`
      );

      let data: Record<string, number> = {};
      for (const token of tokens) {
        data[token.address.toLowerCase()] =
          +priceData.data.data.attributes.token_prices[
            token.priceFeed.toLowerCase()
          ];
      }

      setData(data);
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => fetchData(), 60000);

    return () => clearInterval(timer);
  }, [fetchData]);

  return (
    <TokenPriceContext.Provider value={{ data }}>
      {children}
    </TokenPriceContext.Provider>
  );
};

export const useTokenPriceContext = () => {
  return useContext(TokenPriceContext);
};
