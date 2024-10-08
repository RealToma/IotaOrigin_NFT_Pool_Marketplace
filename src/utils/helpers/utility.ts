const isServer = () => typeof window === 'undefined';

const isEmpty = (value: any) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const roundDown = (value: number, decimals: number = 18) => {
  const valueString = value.toString();
  const integerString = valueString.split('.')[0];
  const decimalsString = valueString.split('.')[1];
  if (!decimalsString) {
    return integerString;
  }
  return `${integerString}.${decimalsString.slice(0, decimals)}`;
};

export { isServer, isEmpty, delay, roundDown };
