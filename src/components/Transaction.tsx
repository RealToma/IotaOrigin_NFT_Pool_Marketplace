import { FaCheck, FaPlay, FaStop, FaTimes } from 'react-icons/fa';

function iconForState(state: string) {
  let icon = null;
  switch (state) {
    case 'succeeded':
      return <FaCheck />;
    case 'failed':
      return <FaTimes />;
    case 'ready':
      return <FaPlay />;
    case 'loading':
      return <img src='/loading.gif' width={26} />;
    case 'null':
      return <FaStop />;
    default:
      throw new Error('invalid state ' + state);
  }
}

const Transaction = ({
  title,
  onClick,
  state,
}: {
  title: string;
  onClick: Function;
  state: string;
}) => {
  let enabled = state == 'ready';
  let failed = state == 'failed';
  const bg = failed ? 'bg-red-500/20 text-red-300' : 'bg-white/10';

  return (
    <div
      className={`border ${bg} m-3 shadow-xl text-white rounded-[15px] p-3 ${
        enabled ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'
      }`}
      onClick={() => (enabled ? onClick() : null)}
    >
      <div className='align-top mt-[7px] inline-block text-[26px] ml-3 mr-3'>
        {iconForState(state)}
      </div>
      <div className='align-top inline-block text-[26px]'>{title}</div>
    </div>
  );
};

export default Transaction;
