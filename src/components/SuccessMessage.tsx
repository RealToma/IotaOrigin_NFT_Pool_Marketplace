import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { FaCheck } from 'react-icons/fa';

export default function SuccessMessage() {
  return (
    <div className='bg-[#00FF00]/20 border-b-[1px] border-white/20 fixed top-0 left-0 right-0 z-[200] p-3 text-center text-white backdrop-blur-md'>
      <FaCheck className='inline mt-[-4px] mr-2' /> Vault created successfully!
    </div>
  );
}
