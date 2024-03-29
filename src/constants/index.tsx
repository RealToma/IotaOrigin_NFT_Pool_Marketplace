import { ethers } from 'ethers';

// rome-ignore lint/style/noNonNullAssertion: <explanation>
export const IPFS_GATEWAY = process.env.NEXT_PUBLIC_IPFS_GATEWAY!;
export const IPFS_GATEWAY_TOKEN = process.env.NEXT_PUBLIC_IPFS_GATEWAY_TOKEN!;

export const IS_MAINNET = process.env.NEXT_PUBLIC_NETWORK === 'mainnet';
export const LAUNCHPAD_URL = IS_MAINNET
  ? 'https://launchpad.snippool.xyz/'
  : 'https://set.launchpad.snippool.xyz/';

export const publicPaths = [
  '/',
  '/Collections',
  '/collection/[address]',
  '/vaults',
  '/vaults/[address]',
];

export const projectId = process.env.NEXT_PUBLIC_WALLECTCONNECT_PROJECTID!;

// export const tokens: PaymentToken[] = [
//   {
//     address: ethers.constants.AddressZero,
//     symbol: 'SMR',
//     name: 'Shimmer',
//     icon: 'smr.svg',
//   },
//   {
//     address: '0x795474E6A6BbeF02C018A06B684Cb149e4525819',
//     symbol: 'AUR',
//     name: 'Aurous',
//     icon: 'aur.png',
//   },
// ];
export const tokens: PaymentToken[] = [
  {
    address: ethers.constants.AddressZero,
    symbol: 'SMR',
    name: 'Shimmer',
    icon: 'smr.svg',
    priceFeed: '0x1074010000000000000000000000000000000000',
    decimals: 18,
  },
  {
    address: '0x174d211F46994860500DB4d66B3EFE605A82BF95',
    symbol: 'AUR',
    name: 'Aureus',
    icon: 'aur.png',
    priceFeed: '0x174d211f46994860500db4d66b3efe605a82bf95',
    decimals: 18,
  },
  /*  {
    address: '0x408E00c35c1537dd06a0cB24f78bA1ac5B3d7900',
    symbol: 'sETH',
    name: 'Wrap ETH',
    icon: 'eth.svg',
    priceFeed: '0xa158A39d00C79019A01A6E86c56E96C461334Eb0',
    decimals: 18,
  },*/
  {
    address: '0xa4f8C7C1018b9dD3be5835bF00f335D9910aF6Bd',
    symbol: 'USDT',
    name: 'Tether USD',
    icon: 'usdt.svg',
    priceFeed: '0xa4f8C7C1018b9dD3be5835bF00f335D9910aF6Bd',
    decimals: 6,
  },
  {
    address: '0x3C844FB5AD27A078d945dDDA8076A4084A76E513',
    symbol: 'sSOON',
    name: 'Wrap SOON',
    icon: 'soon.png',
    priceFeed: '0x3C844FB5AD27A078d945dDDA8076A4084A76E513',
    decimals: 6,
  },
  {
    address: '0x83b090759017EFC9cB4d9E45B813f5D5CbBFeb95',
    symbol: 'FUEL',
    name: 'Epoch Zero FUEL Token',
    icon: 'fuel.webp',
    priceFeed: '0x83b090759017EFC9cB4d9E45B813f5D5CbBFeb95',
    decimals: 6,
  },
  {
    address: '0xbD17705cA627EFBB55dE22A0F966Af79E9191c89',
    symbol: 'RUST',
    name: 'Rusty Robot Country Club',
    icon: 'rust.svg',
    priceFeed: '0xbD17705cA627EFBB55dE22A0F966Af79E9191c89',
    decimals: 18,
  },
];
