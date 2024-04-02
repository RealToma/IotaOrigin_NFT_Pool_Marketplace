import { shortenAddress } from '@/utils';
import { FC } from 'react';
import { NotificationManager } from 'react-notifications';

type Props = {
  address: string | `0x${string}`;
};

const AddressField: FC<Props> = ({ address }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    NotificationManager.success('Copied address');
  };

  return (
    <div className='cursor-pointer' onClick={handleCopy}>
      {shortenAddress(address)}
    </div>
  );
};

export default AddressField;
