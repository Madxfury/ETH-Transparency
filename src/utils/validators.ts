export function isValidEthAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  // Match 0x followed by exactly 40 hex characters
  return /^0x[a-fA-F0-9]{40}$/.test(address.trim());
}

export function isValidTxHash(hash: string): boolean {
  if (!hash || typeof hash !== 'string') return false;
  // Match 0x followed by exactly 64 hex characters
  return /^0x[a-fA-F0-9]{64}$/.test(hash.trim());
}
