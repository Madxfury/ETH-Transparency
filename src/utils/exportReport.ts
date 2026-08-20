import type { EthTransaction } from '../types/blockchain';

export interface ExperimentTelemetry {
  experimentTitle: string;
  sessionStartedAt: string;
  sessionExportedAt: string;
  totalBlocksObserved: number;
  latestBlock: number;
  totalTransactionsObserved: number;
  totalEthObserved: string;
  uniqueWalletsCount: number;
  repeatedWalletsDetected: number;
  repeatedWallets: {
    address: string;
    transactionsCount: number;
    totalSentEth: number;
    totalReceivedEth: number;
    counterpartiesCount: number;
  }[];
  sampleTransactions: EthTransaction[];
  conclusion: string;
}

export function exportExperimentReport(data: ExperimentTelemetry) {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `ethereum-transparency-experiment-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
