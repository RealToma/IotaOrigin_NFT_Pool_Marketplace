import cx from 'classnames';
import Image from 'next/image';

const modeTypes = [
  {
    type: 0,
    title: 'Easy Mode',
    icon: '/ethereum-icon.png',
    description: 'The easy way for new users.',
  },
  {
    type: 1,
    title: 'Expert Mode',
    icon: '/images/eth_expert.svg',
    description: 'Advanced method for crypto experts.',
  },
];

interface PropsType {
  mode: number;
  setModeType: (mode: number) => void;
}

const CreateModeSelect = ({ mode, setModeType }: PropsType) => {
  return (
    <div className='flex flex-col items-center w-full h-full'>
      <h1 className='my-5 text-3xl'>Which mode you want to proceed with?</h1>
      <div className='grid flex-1 w-full grid-cols-1 gap-5 md:grid-cols-2'>
        {modeTypes.map(modeType => (
          <div
            key={modeType.type}
            className={cx(
              'p-5 flex flex-col justify-center items-center bg-slate-800 border border-slate-600 rounded-lg hover:bg-slate-900 hover:border-[#1fcec1] cursor-pointer transition-all',
              { '!border-[#1fcec1]': modeType.type === mode }
            )}
            onClick={() => setModeType(modeType.type)}
          >
            <h1 className='my-6 text-2xl text-center'>{modeType.title}</h1>
            <div className='h-24'>
              <Image
                className='h-full !w-auto'
                height={96}
                width={300}
                src={modeType.icon}
                alt='Pool Icon'
              />
            </div>
            <p className='mt-6 text-sm'>{modeType.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateModeSelect;
