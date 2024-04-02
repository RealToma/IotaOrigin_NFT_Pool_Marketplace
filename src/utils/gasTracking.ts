import axios from 'axios';

const blockExplorerUrl = 'https://explorer.evm.testnet.shimmer.network';

export const computeGasUsedByAddress = async (
  contractAddress: string,
  startTimestamp: number,
  endTimestamp: number
) => {
  const res = await axios.get(`
    ${blockExplorerUrl}/api?module=account&action=txlist&address=${contractAddress}&start_timestamp=${startTimestamp}&end_timestamp=${endTimestamp}`);
  let gasUsed = 0;
  if (res.status == 200) {
    const transactions = res.data.result;
    transactions.map((tx: any) => {
      gasUsed += Number(tx.cumulativeGasUsed);
    });
  }

  console.log('gas Used :', gasUsed);
  return gasUsed;
};
