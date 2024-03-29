import { Box } from '@mui/system';
import styled from 'styled-components';

export const ValueField = ({
  name,
  value,
  fullValue = null,
}: {
  name: string;
  value: string;
  fullValue: string | null;
}) => {
  return (
    <BoxRewards>
      <BoxLeft02>{name}</BoxLeft02>
      <BoxRight02
        onClick={() => {
          navigator.clipboard.writeText(fullValue ? fullValue : value);
        }}
      >
        {value}
        {fullValue == null ? (
          ''
        ) : (
          <BoxAddress className='BoxAddress'>{fullValue}</BoxAddress>
        )}
      </BoxRight02>
    </BoxRewards>
  );
};

const BoxRewards = styled(Box)`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
`;

const BoxAddress = styled(Box)`
  color: white;
  background-color: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px) !important;
  padding: 10px;
  border-radius: 10px;
  width: 100%;
  display: block;
  font-size: 0.8rem;
  font-family: monospace;
  font-weight: 400;
  margin-top: 5px;
  border: 1px solid #333;
`;

const BoxLeft02 = styled(Box)`
  display: flex;
  color: #666;
  font-size: 1.2rem;
  font-weight: 400;

  @media only screen and (max-width: 768px) {
    font-size: 1rem;
  }
`;
const BoxRight02 = styled(Box)`
  display: flex;
  color: white;
  font-size: 1.2rem;
  font-weight: 400;
  cursor: pointer;
  position: relative;

  .BoxAddress {
    position: absolute;
    display: none;
    width: 350px;
    margin-top: 26px;
    margin-left: 30px;
    z-index: 10;
  }

  &:hover .BoxAddress {
    display: block;
  }

  @media only screen and (max-width: 768px) {
    font-size: 1rem;
  }
`;
