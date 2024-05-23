import type { MetaMaskInpageProvider } from "@metamask/providers";

//Check if MetaMask is installed and the provider is available
export const useMetaMask = () => {
  const ethereum = window?.ethereum;
  if (!ethereum || !ethereum.isMetaMask) return;
  return ethereum as unknown as MetaMaskInpageProvider;
};