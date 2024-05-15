import { ObjTxResult } from "../interfaces/ObjTxResult";

export interface ContractResult {
  success: boolean;
  error?: Error | string;
  value: ObjTxResult;
}
