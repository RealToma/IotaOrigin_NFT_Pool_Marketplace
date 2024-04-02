export default function Button({
  children,
  onClick,
  enabled = true,
}: {
  children: any;
  onClick: Function;
  enabled?: boolean;
}) {
  return (
    <button
      className='rounded-lg font-semibold text-[22px] p-3  bg-[#1fcec1] w-full max-w-[300px] mx-auto mt-4 disabled:opacity-40 disabled:cursor-not-allowed'
      onClick={() => onClick()}
      disabled={!enabled}
    >
      {children}
    </button>
  );
}
