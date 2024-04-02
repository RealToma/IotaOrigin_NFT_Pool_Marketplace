import { useState } from 'react';
import { useAccount } from 'wagmi';
import Button from './Button';
import { ModalFrame } from './ModalFrame';
import NFTWallet from './NFTWallet';

export default function NFTPicker({
  setSelected,
  collection,
}: {
  setSelected: (nfts: any[]) => void;
  collection: string;
}) {
  const [selected, setSelectedInner] = useState<any[]>([]);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const { address } = useAccount();

  return (
    <>
      <ModalFrame
        isOpen={isWalletOpen}
        close={() => setIsWalletOpen(false)}
        title='Select NFTs to Deposit'
      >
        <NFTWallet setSelected={setSelectedInner} collection={collection} />
        <Button
          onClick={() => {
            setSelected(selected);
            setIsWalletOpen(false);
          }}
        >
          Deposit {selected.length + ' NFT' + (selected.length == 1 ? '' : 's')}
        </Button>
      </ModalFrame>
      <Button onClick={() => setIsWalletOpen(true)}>Select</Button>
    </>
  );
}
