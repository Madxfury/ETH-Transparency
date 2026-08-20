export interface EthTransaction {
  hash: string;
  from: string;
  to: string | null; // null if contract creation
  value: string; // formatted in ETH string (e.g. "1.4250")
  valueWei: bigint;
  gas: string;
  gasPriceGwei: string;
  gasFeeEth: string;
  blockNumber: number;
  timestamp: number; // unix timestamp in ms
  timeFormatted: string; // e.g. "12:41:03"
  isContractCreation: boolean;
  status: 'SUCCESS' | 'MINED';
  inputDataSnippet?: string;
  nonce?: number;
}

export interface EthBlock {
  number: number;
  hash: string;
  timestamp: number;
  transactionCount: number;
  gasUsed: string;
  gasLimit: string;
  baseFeePerGas?: string;
}

export interface NetworkStatsData {
  latestBlock: number;
  transactionsObserved: number;
  ethObserved: number;
  activeWalletsCount: number;
  avgGasPriceGwei: number;
  networkStatus: 'CONNECTED' | 'RECONNECTING' | 'DISCONNECTED' | 'PAUSED';
  currentEndpoint: string;
  latencyMs: number;
}

export interface RepeatedWalletInfo {
  address: string;
  transactionCount: number;
  transactions: EthTransaction[];
  totalSentEth: number;
  totalReceivedEth: number;
  counterparties: string[];
  firstSeen: number;
  lastSeen: number;
}

export interface WalletTrackerState {
  address: string;
  isValid: boolean;
  balanceEth: string | null;
  onChainTxCount: number | null;
  sessionTxCount: number;
  totalSentEth: number;
  totalReceivedEth: number;
  firstObserved: number | null;
  lastActivity: number | null;
  counterparties: string[];
  transactions: {
    tx: EthTransaction;
    direction: 'SENT' | 'RECEIVED' | 'SELF';
  }[];
  isLoading: boolean;
  error: string | null;
}

export interface GraphNode {
  id: string; // address
  shortAddress: string;
  txCount: number;
  totalVolume: number;
  isRepeated: boolean;
  isSearched: boolean;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  value: number; // eth value
  hash: string;
  timestamp: number;
}

export interface RpcEndpointConfig {
  name: string;
  httpUrl: string;
  wsUrl?: string;
  isCustom?: boolean;
}
