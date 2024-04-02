import { Box } from '@mui/system';
import { MouseEventHandler } from 'react';
import { MdRemoveRedEye } from 'react-icons/md';
import styled from 'styled-components';
import Button from '../Button';
import { isAddress } from 'ethers/lib/utils.js';
import { useCollectionIcon } from '@/hooks/useCollectionIcon';
import { ValueField } from './ValueField';

const AddressField = ({ name, address }: { name: string; address: string }) => {
  return (
    <ValueField
      name={name}
      value={address.substring(0, 6) + '...'}
      fullValue={address}
    />
  );
};

export const ValueBox = ({
  title,
  buttonTitle,
  buttonOnClick,
  data,
  collection,
}: {
  title: string;
  collection: string;
  buttonTitle: string;
  buttonOnClick: MouseEventHandler<HTMLDivElement>;
  data: Array<{ name: string; value: string }>;
}) => {
  const { image, type: imageType } = useCollectionIcon(collection);

  return (
    <div className='w-full'>
      <div className='flex flex-col items-center w-full h-full p-7 rounded-lg border-[1px] border-slate-600 cursor-pointer transform-[0.12s] hover:border-[#1fcec1]'>
        <TextTitle>
          <TextBig>{title?.length ? title : 'Unknown'}</TextBig>
        </TextTitle>
        {image ? (
          imageType == 'mp4' ? (
            <video
              className='w-[100px] rounded-md mx-auto my-2'
              autoPlay
              loop
              src={image}
            />
          ) : (
            <img
              className='w-[100px] rounded-md mx-auto my-2'
              src={image}
              alt='Collection Icon'
            />
          )
        ) : (
          <div className='my-2 rounded w-[100px] h-[100px] bg-white/10'></div>
        )}
        {data.map(({ name, value }, index) =>
          isAddress(value) ? (
            <AddressField name={name} key={index} address={value} />
          ) : (
            <ValueField
              name={name}
              key={index}
              value={value}
              fullValue={null}
            />
          )
        )}

        <Button onClick={buttonOnClick}>
          <MdRemoveRedEye className='inline-block mt-[-4px]' /> {buttonTitle}
        </Button>
      </div>
    </div>
  );
};

const TextTitle = styled(Box)`
  display: flex;
  align-items: center;
`;

const TextBig = styled(Box)`
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
  text-shadow: 4px 4px 0.5px rgb(0 0 0 / 40%);
`;
