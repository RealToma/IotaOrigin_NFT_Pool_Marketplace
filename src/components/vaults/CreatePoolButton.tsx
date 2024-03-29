import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import collectionswapAbi from '@/helpers/contractAbis/collectionswapAbi.json';
import { utils } from 'ethers';

const CreatePoolButton = () => {
  const nftAddress = '0xcf38c128C5B30622c1Fe3dC9e9e5464b56F1D548';
  const bondingCurveAddress = '0x4e11deb1A67B8E684d9c8841D4D8974D92FE6BdA';
  const delta = 5;
  const fee = 1;
  const spotPrice = 1;
  const initialIds = 1;

  const { config, error }: { config: any; error: any } =
    usePrepareContractWrite({
      address: '0x701956C3e0B4c19d039788e263495246367288fd',
      abi: collectionswapAbi,
      functionName: 'createDirectPairETH',
      args: [
        nftAddress,
        bondingCurveAddress,
        delta,
        fee,
        spotPrice,
        initialIds,
      ],
      overrides: {
        value: utils.parseEther('0.001').toNumber(),
      },
      onSuccess() {
        console.log('Create pool config: ', config);
      },
      onError() {
        console.log('Create pool error: ', error);
      },
    });

  const { data, isLoading, isSuccess, write } = useContractWrite(config);

  return <button onClick={() => write?.()}>Create Example Pool</button>;
};

export default CreatePoolButton;
