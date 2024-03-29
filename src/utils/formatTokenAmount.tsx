const TOKEN_DECIMALS = parseInt(process.env.NEXT_PUBLIC_TOKEN_DECIMALS || '18');

export default function formatTokenAmount(raw_token_amount: number | null) {
  if (raw_token_amount !== undefined && raw_token_amount !== null) {
    return (raw_token_amount / Math.pow(10, TOKEN_DECIMALS)).toFixed(3);
  } else {
    return null;
  }
}
