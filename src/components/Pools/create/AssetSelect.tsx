import { FC, useContext } from 'react';
import CollectionSelect from '@/components/common/CollectionSelect';
import { useRouter } from 'next/router';
import TokenSelect from '@/components/common/TokenSelect';

interface Props {
  type: number;
  token: PaymentToken;
  collection?: CollectionData;
  setToken: (token: PaymentToken) => void;
  setCollection: (collection: CollectionData) => void;
}

export const AssetSelect: FC<Props> = ({
  type,
  collection,
  token,
  setToken,
  setCollection,
}) => {
  const router = useRouter();
  const { vault } = router.query;

  return (
    <div className='flex flex-col items-start justify-around h-full py-5 mx-auto'>
      <div className='text-3xl leading-loose'>
        Which collection you want to provide?
      </div>
      <div className='flex flex-col text-xl leading-loose md:flex-row md:items-center md:gap-24'>
        <span>deposit</span>
        {type == 0 ? (
          <TokenSelect token={token} setToken={setToken} disabled={!!vault} />
        ) : (
          <CollectionSelect
            collection={collection}
            setCollection={setCollection}
            disabled={!!vault}
          />
        )}
      </div>
      <div className='text-xl leading-loose'>and ...</div>
      <div className='flex flex-col text-xl leading-loose md:flex-row md:items-center md:gap-24'>
        <span>{type == 2 ? 'deposit' : 'receive'}</span>
        {type != 0 ? (
          <TokenSelect token={token} setToken={setToken} disabled={!!vault} />
        ) : (
          <CollectionSelect
            collection={collection}
            setCollection={setCollection}
            disabled={!!vault}
          />
        )}
      </div>
      {type == 2 && (
        <div className='text-xl leading-loose'>to earn trading fees</div>
      )}
    </div>
  );
};
