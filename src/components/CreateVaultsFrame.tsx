import { TextField } from '@mui/material';
import { Box } from '@mui/system';
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { useContext, useEffect, useState, useCallback } from 'react';
import { NotificationManager } from 'react-notifications';
import styled from 'styled-components';
import { InputField } from './Input';
import abiContractRewardToken from '../helpers/contractAbis/contractRewardToken.json';
import abiCollectionStaker from '../helpers/contractAbis/collectionstakerAbi.json';

import { useSigner, useContract, useAccount, useNetwork } from 'wagmi';
import { DeltaChart } from './DeltaChart';
import { MdAddBox } from 'react-icons/md';
import { ModalFrame } from './ModalFrame';
import TransactionDialog from './TransactionDialog';
import { useRouter } from 'next/router';
import ChainContext from '../contexts/ChainContext';
import CollectionSelect from './common/CollectionSelect';
import { parseEther } from 'ethers/lib/utils.js';
import { BigNumber } from 'ethers';
import { tokens } from '@/constants';

const convertDateToMiliSeconds = (date: any) => {
  let tempDate = new Date(date);
  return tempDate.getTime(); //return miliseconds
};

const convertDateToSeconds = (date: any) => {
  let tempDate = new Date(date);
  return Math.floor(tempDate.getTime() / 1000); //return miliseconds
};

function tokenAmountInHex(units: number, decimals: number) {
  return '0x' + (units * Math.pow(10, decimals)).toString(16);
}

function error(message: string) {
  NotificationManager.error(message, '', 10000);
}

const Select = ({
  options,
  optionValues = [],
  placeholder,
  setSelected,
}: {
  options: string[];
  optionValues?: { label: string; value: string }[];
  placeholder: string;
  setSelected: (value: string) => void;
}) => {
  return (
    <select
      onChange={(e: any) => setSelected(e.target.value)}
      className='px-3 py-3 text-[20px] rounded-[8px] bg-transparent border border-white/30 focus:outline-none text-white'
    >
      <option selected disabled className='bg-black'>
        {placeholder}
      </option>
      {options.map((label, index) => (
        <option
          key={index}
          className='bg-black'
          value={
            optionValues.filter(({ label: label2 }) => label2 === label)[0]
              ?.value || label
          }
        >
          {label}
        </option>
      ))}
    </select>
  );
};

const InputNFTAddress = ({
  setNftCollection,
}: {
  setNftCollection: (nftCollection: string) => void;
}) => {
  const [collection, setCollection] = useState<CollectionData>();

  useEffect(() => {
    if (collection) {
      setNftCollection(collection.id);
    }
  }, [collection, setNftCollection]);

  return (
    <BoxEachInput01>
      <TextDescription>NFT Collection Address</TextDescription>
      <CollectionSelect
        collection={collection}
        setCollection={setCollection}
        disabled={false}
      />
    </BoxEachInput01>
  );
};

const InputBondingCurve = ({
  linearCurveAddress,
  exponentialCurveAddress,
  setBondingCurve,
}: {
  linearCurveAddress: string;
  exponentialCurveAddress: string;
  setBondingCurve: (bondingCurve: string) => void;
}) => {
  const options = [
    {
      value: linearCurveAddress,
      label: 'Linear Curve',
    },
    {
      value: exponentialCurveAddress,
      label: 'Exponential Curve',
    },
  ];

  return (
    <div className='flex flex-col w-full'>
      <TextDescription>Bonding Curve</TextDescription>
      <Select
        placeholder='Choose Bonding Curve'
        options={['Linear Curve', 'Exponential Curve']}
        setSelected={setBondingCurve}
        optionValues={options}
      />
    </div>
  );
};

const InputRewardToken = ({
  rewardTokenList,
  setRewardToken,
}: {
  rewardTokenList: { value: string; label: string }[];
  setRewardToken: (rewardToken: string) => void;
}) => {
  return (
    <div className='flex flex-col w-full'>
      <TextDescription>Reward Token</TextDescription>
      <Select
        placeholder='Choose Reward Token'
        options={rewardTokenList.map(token => token.label)}
        setSelected={setRewardToken}
        optionValues={rewardTokenList}
      />
    </div>
  );
};

const InputReward = ({
  setReward,
}: {
  setReward: (reward: number) => void;
}) => {
  const validateAndSetReward = (reward: any) => {
    if (reward <= 0) {
      error(`Reward must be greater than 0.`);
    }
    setReward(reward);
  };

  return (
    <InputField
      min={0}
      label='Reward'
      value={1}
      setValue={validateAndSetReward}
      type='number'
      enabled
    />
  );
};

const InputDelta = ({
  isLinearBondingCurve,
  TOKEN_SYMBOL,
  setDelta,
  minDelta,
}: {
  isLinearBondingCurve: boolean;
  TOKEN_SYMBOL: string;
  setDelta: (delta: number) => void;
  minDelta: number;
}) => {
  const validateAndSetDelta = (delta: any) => {
    if (delta <= minDelta) {
      error(`Delta must be greater than ${minDelta}.`);
    }
    setDelta(delta);
  };

  //const isLinearBondingCurve = bondingCurve === linearCurveAddress;
  return (
    <InputField
      min={0}
      label={`Delta in ${isLinearBondingCurve ? TOKEN_SYMBOL : '%'}`}
      value={1}
      setValue={validateAndSetDelta}
      type='number'
      enabled
    />
  );
};

const InputToken = ({ setToken }: { setToken: (token: string) => void }) => {
  return (
    <div className='flex flex-col w-full'>
      <TextDescription>Pair Token</TextDescription>
      <Select
        placeholder='Choose Pair Token'
        options={tokens.map(token => token.name)}
        setSelected={setToken}
        optionValues={tokens.map(token => ({
          value: token.address,
          label: token.name,
        }))}
      />
    </div>
  );
};

const InputFee = ({ setFee }: { setFee: (fee: number) => void }) => {
  const validateAndSetFee = (fee: any) => {
    if (fee <= 0) {
      error('Fee must be greater than zero.');
    } else if (fee >= 90) {
      error('Fee must be less than 90%');
    }
    setFee(fee);
  };

  return (
    <InputField
      min={0}
      label='Fee in %'
      value={80}
      step={0.1}
      max={89.999999}
      setValue={validateAndSetFee}
      type='number'
      enabled
    />
  );
};

const DateTimeInput = ({
  value: valueOuter,
  setValue: setValueOuter,
}: {
  value: any;
  setValue: Function;
}) => {
  const [value, setValue] = useState(valueOuter);
  const setBothValue = (value: number) => {
    setValue(value);
    setValueOuter(value);
  };

  const color = '#FFFFFF';
  const sx = {
    svg: { color },
    input: { color },
    label: { color },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#444',
      },
    },
  };
  return (
    <div className='mt-2 rounded-md'>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <DatePicker
          className='inline-block w-[195px] mr-2'
          label='Date'
          value={value}
          onChange={newValue => {
            if (typeof newValue === typeof 0) {
              setBothValue(newValue);
            } else {
              setBothValue(+new Date(newValue));
            }
          }}
          renderInput={params => <TextField sx={sx} {...params} />}
        />
        <TimePicker
          className='inline-block w-[180px]'
          label='Time'
          value={value}
          onChange={newValue => {
            if (typeof newValue === typeof 0) {
              setBothValue(newValue);
            } else {
              setBothValue(+new Date(newValue));
            }
          }}
          renderInput={params => <TextField sx={sx} {...params} />}
        />
      </LocalizationProvider>
    </div>
  );
};

const InputStartTime = ({
  startTime,
  setStartTime,
}: {
  startTime: number;
  setStartTime: (startTime: number) => void;
}) => {
  return (
    <div className='text-white'>
      <p>Start Time</p>
      <DateTimeInput value={startTime} setValue={setStartTime} />
    </div>
  );
};

const InputEndTime = ({
  endTime,
  setEndTime,
}: {
  endTime: number;
  setEndTime: (endTime: number) => void;
}) => {
  return (
    <div className='text-white'>
      <p>End Time</p>
      <DateTimeInput value={endTime} setValue={setEndTime} />
    </div>
  );
};

const InputRow = ({ children }: { children: any }) => {
  return (
    <Box
      display='flex'
      alignItems={'center'}
      justifyContent={'space-between'}
      mt={'30px'}
    >
      {children}
    </Box>
  );
};

export default function CreateVaultsFrame({
  isOpen,
  close,
}: {
  isOpen: boolean;
  close: () => void;
}) {
  const [nftCollection, setNftCollection] = useState('');
  const [startTime, setStartTime] = useState(Date.now() + 600 * 1000);
  const [endTime, setEndTime] = useState(Date.now() + 3600 * 24 * 30 * 1000);
  const [fee, setFee] = useState(0.8);
  const [delta, setDelta] = useState(1);
  const [reward, setReward] = useState(1);
  const [flagClickCreatePool, setFlagClickCreatePool] = useState(false);
  const { connector: activeConnector } = useAccount();
  const { data: signer } = useSigner();

  const {
    linearCurveAddress,
    exponentialCurveAddress,
    tokenSymbol,
    collectionStakeAddress,
    rewardTokenList,
  } = useContext(ChainContext) as ChainContextType;

  const [rewardToken, setRewardToken] = useState(rewardTokenList[0].value!);
  const [token, setToken] = useState<string>(tokens[0].address);
  const [bondingCurve, setBondingCurve] = useState(linearCurveAddress!);

  const contractCollectionStaker = useContract({
    address: collectionStakeAddress,
    abi: abiCollectionStaker,
    signerOrProvider: signer,
  });

  const contractRewardToken = useContract({
    address: rewardToken,
    abi: abiContractRewardToken,
    signerOrProvider: signer,
  });

  const CreatePoolTransactionDialog = () => {
    const router = useRouter();

    const data: any[] = [
      {
        title: 'Approve Reward Token',
        action: async () => {
          await approveRewardToken();
        },
      },
      {
        title: 'Create Incentive Eth',
        action: async () => {
          await createIncentiveEth(delta, fee);
        },
      },
    ];

    if (reward == 0) {
      data.shift();
    }

    const onCompletion = () => {
      close();
      setFlagClickCreatePool(false);
      router.reload();
    };

    const onClose = () => {
      setFlagClickCreatePool(false);
    };

    return (
      <TransactionDialog
        isOpen={flagClickCreatePool}
        title='Create Pool'
        data={data}
        onCompletion={onCompletion}
        closeDialog={onClose}
      />
    );
  };

  const minDelta = () => {
    if (bondingCurve == linearCurveAddress) return 0.0;
    if (bondingCurve == exponentialCurveAddress) return 1.0;
    return -1;
  };

  function checkInputs({
    nftCollection,
    startTime,
    endTime,
  }: {
    nftCollection: string;
    startTime: number;
    endTime: number;
  }) {
    if (!activeConnector) {
      throw 'Wallet not connected.';
    }

    if (flagClickCreatePool === true) {
      throw 'Please wait for processing.';
    }

    if (nftCollection === '') {
      throw 'Please input NFT Collection Address. ';
    }

    if (delta <= minDelta()) {
      throw 'Delta must be greater than ' + minDelta();
    }

    if (
      convertDateToMiliSeconds(startTime) < convertDateToMiliSeconds(new Date())
    ) {
      throw 'Start Time must be greater than current time!';
    }

    if (
      convertDateToMiliSeconds(startTime) > convertDateToMiliSeconds(endTime)
    ) {
      throw 'End Time should be greater than start time!';
    }

    if (fee <= 0) {
      throw 'Fee must be greater than zero.';
    } else if (fee >= 90) {
      throw 'Fee must be less than 90%.';
    }

    if (delta <= minDelta()) {
      throw `Delta must be greater than ${minDelta()}.`;
    }

    if (reward <= 0) {
      throw `Reward must be greater than 0.`;
    }
  }

  const approveRewardToken = useCallback(async () => {
    if (!signer || !contractRewardToken) {
      return;
    }
    const address = await signer.getAddress();
    const allowance = await contractRewardToken.allowance(
      address,
      collectionStakeAddress
    );

    const amount = parseEther(reward + '');
    if (allowance.lt(amount)) {
      const approveRewardToken = await contractRewardToken?.approve(
        collectionStakeAddress,
        amount
      );
      await approveRewardToken.wait();
    }
  }, [collectionStakeAddress, contractRewardToken, reward, signer]);

  const createIncentiveEth = useCallback(
    async (delta: number, fee: number) => {
      if (!contractCollectionStaker) {
        return;
      }

      const deltaValue =
        bondingCurve === linearCurveAddress
          ? delta.toString()
          : (1 + delta / 100).toString();

      const eventCollectionStaker =
        await contractCollectionStaker.createIncentiveETH(
          token,
          nftCollection,
          bondingCurve,
          parseEther(deltaValue),
          parseEther(fee / 100 + ''),
          rewardToken,
          parseEther(reward + ''),
          convertDateToSeconds(startTime),
          convertDateToSeconds(endTime)
        );
      await eventCollectionStaker.wait();
    },
    [
      bondingCurve,
      contractCollectionStaker,
      endTime,
      linearCurveAddress,
      nftCollection,
      reward,
      rewardToken,
      startTime,
      token,
    ]
  );

  const createPool = async () => {
    if (!signer) {
      NotificationManager.error('Please connect your wallet');
      return;
    }

    try {
      checkInputs({ nftCollection, startTime, endTime });
      setFlagClickCreatePool(true);
    } catch (e: any) {
      error('Error: ' + e.toString());
      setFlagClickCreatePool(false);
      console.log(e);
    }
  };

  return (
    <ModalFrame isOpen={isOpen} close={close} title='Create Vault'>
      <InputNFTAddress setNftCollection={setNftCollection} />
      <div className='flex flex-col items-center justify-start w-full gap-2 md:flex-row mt-7'>
        <InputBondingCurve
          setBondingCurve={setBondingCurve}
          linearCurveAddress={linearCurveAddress}
          exponentialCurveAddress={exponentialCurveAddress}
        />
        <InputDelta
          isLinearBondingCurve={bondingCurve === linearCurveAddress}
          TOKEN_SYMBOL={tokenSymbol}
          setDelta={setDelta}
          minDelta={minDelta()}
        />
      </div>
      <DeltaChart
        delta={delta}
        curve={bondingCurve === linearCurveAddress ? 'linear' : 'exponential'}
      />

      <div className='flex flex-col items-center justify-start w-full gap-2 md:flex-row mt-7'>
        <InputRewardToken
          rewardTokenList={rewardTokenList}
          setRewardToken={setRewardToken}
        />
        <InputReward setReward={setReward} />
      </div>

      <div className='flex flex-col items-center justify-start w-full gap-2 md:flex-row mt-7'>
        <InputFee setFee={setFee} />
        <InputToken setToken={setToken} />
      </div>

      <div className='flex flex-col items-center justify-start w-full gap-2 md:flex-row mt-7'>
        <InputStartTime startTime={startTime} setStartTime={setStartTime} />
        <InputEndTime endTime={endTime} setEndTime={setEndTime} />
      </div>

      <ButtonCreatePoolModal onClick={() => createPool()}>
        <Box display={'flex'} mr={'10px'}>
          <MdAddBox fontSize={'1.6rem'} />
        </Box>
        <Box display={'flex'}>Create Vault</Box>
      </ButtonCreatePoolModal>

      {flagClickCreatePool ? <CreatePoolTransactionDialog /> : null}
    </ModalFrame>
  );
}

const ButtonCreatePoolModal = styled(Box)`
  display: flex;
  width: 100%;
  height: 50px;
  padding: 20px;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 8px;
  text-transform: uppercase;
  background-color: #181818;
  color: white;
  cursor: pointer;
  transition: 0.5s;
  &:hover {
    background-color: white;
    color: #181818;
  }
  margin-top: 30px;
`;

const InputAddress = styled.input`
  display: flex;
  width: 100%;
  height: 50px;
  border-radius: 8px;
  padding: 0px 15px;
  box-sizing: border-box;
  font-size: 1.3rem;
  color: #ffffff;
  background-color: transparent;
  outline: none;
  border: 1px solid #444;
`;

const TextDescription = styled(Box)`
  display: flex;
  align-items: flex-start;
  font-weight: 400;
  font-size: 18px;
  color: #ffffff;
  text-shadow: 4px 4px 0.5px rgb(0 0 0 / 40%);
  margin-bottom: 10px;
`;

const BoxEachInput01 = styled(Box)`
  display: flex;
  width: 100%;
  flex-direction: column;
  margin-top: 30px;
`;

const BoxEachInput03 = styled(Box)`
  display: flex;
  width: 48%;
  flex-direction: column;

  @media (max-width: 768px) {
    flex-direction: row;
  }
`;

const CustomTextField = styled(TextField)`
  border: 1px solid #fff;
  border-radius: 8px;
  font-size: 1.3rem;
  font-weight: 600;
  color: #fff;
  outline: none;

  & * {
    color: #fff;
    padding: 6px;
  }
`;
