export interface ObjTxResult {
  blockHash: string;
  blockNumber: number;
  chainId: number;
  data: string;
  from: string;
  gasLimit: number;
  gasPrice: bigint;
  hash: string;
  index: number;
  nonce: number;
  to: string;
  type: number;
  value: bigint;
}

export const emptyObjTxResult = (): ObjTxResult => {
  return {
    blockHash: "",
    blockNumber: 0,
    chainId: 0,
    data: "",
    from: "",
    gasLimit: 0,
    gasPrice: 0n,
    hash: "",
    index: 0,
    nonce: 0,
    to: "",
    type: 0,
    value: 0n,
  };
};
