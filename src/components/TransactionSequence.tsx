import { useCallback, useEffect, useState } from 'react';
import { NotificationManager } from 'react-notifications';
import Transaction from './Transaction';

const TransactionSequence = ({
  data,
  onCompletion,
  initiate = true,
}: {
  initiate: boolean;
  data: { title: string; action: Function }[];
  onCompletion: Function;
}) => {
  let [isCompleted, setIsCompleted] = useState(false);
  let [states, setStates] = useState<string[]>(
    data.map((_, index) => (index == 0 ? 'ready' : 'null'))
  );
  let [output, setOutput] = useState<any>({});

  const setState = useCallback(
    (index: number, newState: string) => {
      const newStates = states.map((oldState, i) =>
        i == index ? newState : oldState
      );
      setStates(newStates);
    },
    [states]
  );

  if (!isCompleted && states.every(state => state === 'succeeded')) {
    setIsCompleted(true);
    onCompletion();
    NotificationManager.success('All transactions completed!', '', 3000);
  }

  const generateActionAndProceed = useCallback(
    (index: number, action: Function) => {
      return async () => {
        try {
          setState(index, 'loading');
          const result = await action(output);
          setState(index, 'succeeded');
          setOutput(result);
        } catch (error: any) {
          setState(index, 'failed');
          let errorMessage = error?.message ?? error?.reason ?? 'Unknown error';
          if (errorMessage.includes('user rejected transaction')) {
            errorMessage = 'You rejected the transaction.';
          }
          if (errorMessage.includes('reason="')) {
            errorMessage = errorMessage
              .split('reason="')[1]
              .split('", method=')[0];
          }
          NotificationManager.error(errorMessage, '', 10000);
          console.error(error);
        }
      };
    },
    [output, setState]
  );

  useEffect(() => {
    if (initiate) {
      const indexLastSucceeded = states.lastIndexOf('succeeded');
      const indexNext = indexLastSucceeded + 1;
      if (indexNext >= 0 && ['null', 'ready'].includes(states[indexNext])) {
        const action = data[indexNext].action;
        const actionAndProceed = generateActionAndProceed(indexNext, action);
        actionAndProceed();
      }
    }
  }, [data, generateActionAndProceed, initiate, states]);

  return (
    <>
      {data.map(({ title, action }, index) => {
        let actionAndProceed = () => generateActionAndProceed(index, action);

        let state = states[index];
        if (index > 0 && state == 'null' && states[index - 1] == 'succeeded') {
          state = 'ready';
        }

        return (
          <Transaction
            key={index}
            title={title}
            onClick={actionAndProceed}
            state={state}
          />
        );
      })}
    </>
  );
};

export default TransactionSequence;
