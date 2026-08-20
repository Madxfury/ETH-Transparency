export function shortenAddress(address: string | null, leading: number = 6, trailing: number = 4): string {
  if (!address) return 'Contract Creation';
  if (address.length <= leading + trailing) return address;
  return `${address.slice(0, leading)}...${address.slice(-trailing)}`;
}

export function shortenHash(hash: string, leading: number = 8, trailing: number = 6): string {
  if (!hash) return '';
  if (hash.length <= leading + trailing) return hash;
  return `${hash.slice(0, leading)}...${hash.slice(-trailing)}`;
}

export function formatEth(val: string | number): string {
  const num = typeof val === 'string' ? parseFloat(val) : val;
  if (isNaN(num)) return '0.0000 ETH';
  if (num === 0) return '0.0000 ETH';
  if (num < 0.0001) return '< 0.0001 ETH';
  return `${num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })} ETH`;
}

export function formatNumber(num: number): string {
  return num.toLocaleString();
}

export function formatRelativeTime(timestampMs: number): string {
  const now = Date.now();
  const diffSec = Math.max(0, Math.floor((now - timestampMs) / 1000));

  if (diffSec < 5) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  return `${diffHour}h ago`;
}

export function formatUtcDateTime(timestampMs: number): string {
  return new Date(timestampMs).toUTCString();
}
