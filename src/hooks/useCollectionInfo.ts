import { useEffect, useMemo, useState } from 'react';
import { useSubgraphData } from '@/hooks/useSubgraphData';
import { GET_POOL_DETAILS } from '@/constants/subgraphQueries';
import { Contract, constants } from 'ethers';
import { formatUnits } from 'ethers/lib/utils.js';
import { useTokenPriceContext } from '@/contexts/TokenPriceContext';
import { tokens } from '@/constants';
import POOL_ABI from '@/helpers/contractAbis/lssvmpairAbi.json';
import { useProvider, useSigner } from 'wagmi';

export const useCollectionInfo = (collectionAddress: string, token: string) => {
  const [pools, setPools] = useState<any[]>([]);
  const [allNftIds, setAllNftIds] = useState<string[]>([]);
  const [bestOffer, setBestOffer] = useState<number>();
  const [floorPrice, setFloorPrice] = useState<number>();
  const [totalVolume, setTotalVolume] = useState<number>();
  const variables = useMemo(
    () => ({
      address: collectionAddress,
    }),
    [collectionAddress]
  );
  const { data: priceData } = useTokenPriceContext();
  const collectionData = useSubgraphData(GET_POOL_DETAILS, variables);
  const { data: signer } = useSigner();
  const provider = useProvider();

  const paymentToken = useMemo(
    () => tokens.filter(item => item.address == token)[0],
    [token]
  );

  const totalNftIds = useMemo(
    () =>
      (collectionData?.collection?.pairs ?? []).reduce(
        (prev: string[], pair: any) => [
          ...prev,
          ...pair.asAccount.nfts.map((item: any) => item.identifier),
        ],
        []
      ),
    [collectionData?.collection?.pairs]
  );

  useEffect(() => {
    if (!collectionData?.collection || Object.keys(priceData).length == 0) {
      return;
    }

    (async () => {
      try {
        const dataPools: any[] = [];
        for (const pair of collectionData.collection.pairs.filter(
          (pair: any) =>
            (pair.token?.id ?? constants.AddressZero) == token.toLowerCase()
        )) {
            const pairContract = new Contract(
              pair.id,
              POOL_ABI,
              signer ?? provider
            );
            const nftQuoteBuy = await pairContract.getBuyNFTQuote(1,1);
            const nftQuoteSell = await pairContract.getSellNFTQuote(1,1);
          let objectDataEachPool: any = {
            address: pair.id,
            poolType: pair.type,
            buyPrice: formatUnits(nftQuoteBuy.inputAmount, paymentToken.decimals),
            sellPrice: formatUnits(nftQuoteSell.outputAmount, paymentToken.decimals),
//             buyPrice:
//               pair.type == '1'
//                 ? undefined
//                 : +formatUnits(pair.spotPrice, paymentToken.decimals),
//             sellPrice:
//               pair.type == '0'
//                 ? undefined
//                 : +formatUnits(pair.spotPrice, paymentToken.decimals),
            spotPrice: +formatUnits(pair.spotPrice, paymentToken.decimals),
            tokenIds: pair.asAccount.nfts.map((item: any) => item.identifier),
            tokenBalance: +formatUnits(pair.balance, paymentToken.decimals),
            volume: +formatUnits(pair.volume ?? '0', paymentToken.decimals),
          };

          dataPools.push(objectDataEachPool);
          setPools([...dataPools]);
        }

        setPools([...dataPools]);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [collectionData?.collection, paymentToken.decimals, priceData, token]);

  useEffect(() => {
    let _allNftIDs: string[] = [];
    let _floorPrice: number | undefined = undefined;
    let _bestOffer: number | undefined = undefined;
    let _totalVolume = 0;

    pools.forEach((x, i) => {
      if (x.poolType != '0' && x.tokenIds.length > 0) {
        _allNftIDs = _allNftIDs.concat(x.tokenIds);
          _floorPrice = _floorPrice? Math.min(x.buyPrice, _floorPrice) : x.buyPrice ;
      }
      if (x.poolType != '1' && x.tokenBalance >= x.sellPrice) {
          _bestOffer = _bestOffer? Math.max(x.sellPrice, _bestOffer) : x.sellPrice ;
      }
      _totalVolume += x.volume;
    });

    setAllNftIds(_allNftIDs);
    setFloorPrice(_floorPrice);
    setBestOffer(_bestOffer ? _bestOffer: undefined);
    setTotalVolume(_totalVolume);
  }, [pools]);

  return {
    name: collectionData?.collection?.name,
    symbol: collectionData?.collection?.symbol,
    volume: totalVolume,
    listings: allNftIds.length,
    allNftIDs: allNftIds, // list of all tokenIds
    totalNftIds,
    pools: pools,
    bestOffer,
    floorPrice,
  };
};
