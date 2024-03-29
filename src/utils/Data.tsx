import {
  MdSwapHorizontalCircle,
  MdOutlineSupport,
  MdShoppingBag,
  MdSecurity,
  MdSpeed,
  MdMouse,
} from 'react-icons/md';

export const dataFeatures = [
  {
    icon: <MdSwapHorizontalCircle />,
    title: 'Swap',
    description:
      'Buy, sell and explore NFTs and Collections on Shimmer network.',
    callToAction: 'Swap your NFTs',
  },
  {
    icon: <MdOutlineSupport />,
    title: 'Provide',
    description: 'Earn pool fees by providing liquidity with your NFTs.',
    callToAction: 'Provide liquidity',
  },
  {
    icon: <MdShoppingBag />,
    title: 'Earn',
    description: 'Get rewards from pools through NFT liquidity mining.',
    callToAction: 'Earn swapping fees',
  },
];

export const dataWhyUs = [
  {
    icon: <MdSecurity />,
    title: 'Security',
    description: 'Secured transactions.',
  },
  {
    icon: <MdSpeed />,
    title: 'Fast',
    description: 'Fast transactions.',
  },
  {
    icon: <MdMouse />,
    title: 'Simple',
    description: 'Easy to use UI.',
  },
];
