export interface MintResult {
    success: boolean;
    error?: Error | string; // Adjusted to accept string type as well
  }