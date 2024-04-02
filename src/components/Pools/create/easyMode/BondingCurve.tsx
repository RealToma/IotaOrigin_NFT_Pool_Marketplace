import Image from 'next/image';
import { useState } from 'react';
import { FaChevronDown, FaQuestionCircle } from 'react-icons/fa';
import { bondingCurves } from '@/constants/curves';
import { useRouter } from 'next/router';

interface PropsType {
  curve: BondingCurve;
  setCurve: (curve: BondingCurve) => void;
}

const BondingCurve = ({ curve, setCurve }: PropsType) => {
  const router = useRouter();
  const { vault } = router.query;
  const [openCurve, setOpenCurve] = useState<boolean>(false);

  return (
    <div className='flex flex-col items-center mb-20'>
      <h3 className='text-3xl'>Which curve you want to use?</h3>
      <div className='flex flex-col items-start w-full mt-10'>
        <div className='flex flex-row items-center gap-2 text-sm'>
          <span>Bonding Curve</span>
          <div className='relative cursor-pointer group'>
            <FaQuestionCircle size={12} />
            <span className="absolute hidden group-hover:flex -top-4 -right-3 translate-x-full w-48 px-2 py-1 bg-slate-950 rounded-lg text-center text-white text-sm before:content-[''] before:absolute before:top-1/2  before:right-[100%] before:-translate-y-1/2 before:border-8 before:border-y-transparent before:border-l-transparent before:border-r-slate-950 z-10">
              Controls how your pool&lsquo;s price will change
            </span>
          </div>
        </div>
        <div className='relative w-full'>
          <button
            type='button'
            onClick={() => setOpenCurve(true)}
            disabled={!!vault}
            className='flex items-center justify-center w-full gap-2 py-2 rounded-sm bg-slate-800'
          >
            <Image height={16} width={50} src={curve.icon} alt='Curve Icon' />
            <span>{curve.title}</span>
            <FaChevronDown />
          </button>
          {openCurve && (
            <>
              <div
                className='fixed top-0 left-0 z-10 w-screen h-screen'
                onClick={() => setOpenCurve(false)}
              ></div>
              <div className='absolute left-0 right-0 z-20 rounded-md top-full bg-slate-900'>
                {bondingCurves.map((curve: BondingCurve) => (
                  <button
                    key={curve.type}
                    type='button'
                    onClick={e => {
                      e.stopPropagation();
                      e.preventDefault();

                      setCurve(curve);
                      setOpenCurve(false);
                    }}
                    className='flex items-center justify-center w-full gap-2 py-2 hover:bg-slate-700'
                  >
                    <Image
                      height={16}
                      width={50}
                      src={curve.icon}
                      alt='Curve Icon'
                    />
                    <span>{curve.title}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BondingCurve;
