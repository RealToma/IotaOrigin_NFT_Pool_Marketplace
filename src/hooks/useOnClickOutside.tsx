import { useEffect } from 'react';

interface Props {
  ref: any;
  onClickOutside: () => void;
}

const useOnClickOutside: React.FC<Props> = ({ ref, onClickOutside }) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [ref]); //eslint-disable-line

  return <></>;
};

export default useOnClickOutside;
