export const bondingCurves: BondingCurve[] = [
  {
    type: 'lin',
    title: 'Linear Curve',
    description: 'Price changes by flat amount each time',
    icon: '/images/curves/lin.svg',
    unit: null,
    unitAmount: 1,
  },
  {
    type: 'exp',
    title: 'Exponential Curve',
    description:
      'Price increases faster, but decreases faster. Uses percentage changes.',
    icon: '/images/curves/exp.svg',
    unit: '%',
    unitAmount: 100,
  },
/*  {
    type: 'XYK',
    title: 'Concentrated XYK',
    description:
      'Price follows a constant product invariant, with an added concentration factor.',
    icon: '/images/curves/xyk.svg',
    unit: 'X',
    unitAmount: 1,
  },*/
];
