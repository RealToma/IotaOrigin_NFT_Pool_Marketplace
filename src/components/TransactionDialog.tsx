import { ModalFrame } from './ModalFrame';
import TransactionSequence from './TransactionSequence';

const TransactionDialog = ({
  isOpen,
  title,
  data,
  onCompletion,
  closeDialog,
}: {
  isOpen: boolean;
  title: string;
  data: { title: string; action: Function }[];
  onCompletion: Function;
  closeDialog: Function;
}) => {
  function close() {
    if (closeDialog) {
      closeDialog();
    }
  }

  return (
    <ModalFrame title={title} isOpen={isOpen} close={close}>
      <TransactionSequence
        initiate={true}
        data={data}
        onCompletion={() => {
          onCompletion();
          close();
        }}
      />
    </ModalFrame>
  );
};

export default TransactionDialog;
