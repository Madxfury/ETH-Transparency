import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { EthBlock, EthTransaction, NetworkStatsData, RepeatedWalletInfo, RpcEndpointConfig } from '../types/blockchain';
import { ethereumService } from '../services/ethereum';

const MAX_TRANSACTIONS_BUFFER = 80;

export function useEthereumStream() {
  const [transactions, setTransactions] = useState<EthTransaction[]>([]);
  const [latestBlock, setLatestBlock] = useState<EthBlock | null>(null);
  const [blocksObservedCount, setBlocksObservedCount] = useState<number>(0);
  const [totalTxCount, setTotalTxCount] = useState<number>(0);
  const [totalEthObserved, setTotalEthObserved] = useState<number>(0);
  const [networkStatus, setNetworkStatus] = useState<NetworkStatsData['networkStatus']>('CONNECTED');
  const [latencyMs, setLatencyMs] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [currentEndpoint, setCurrentEndpoint] = useState<RpcEndpointConfig>(ethereumService.getCurrentEndpoint());
  const [avgGasPriceGwei, setAvgGasPriceGwei] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeWalletsCount, setActiveWalletsCount] = useState<number>(0);
  const [repeatedWallets, setRepeatedWallets] = useState<RepeatedWalletInfo[]>([]);

  // Persistent accumulator refs for fast processing across block intervals
  const uniqueWalletsSet = useRef<Set<string>>(new Set());
  const walletFrequencyMap = useRef<Map<string, EthTransaction[]>>(new Map());
  const lastProcessedBlockNum = useRef<bigint | null>(null);
  const isPollingRef = useRef<boolean>(false);

  const computeRepeatedWallets = useCallback(() => {
    const list: RepeatedWalletInfo[] = [];
    walletFrequencyMap.current.forEach((txs, address) => {
      if (txs.length >= 2) {
        let sentEth = 0;
        let receivedEth = 0;
        const counterparties = new Set<string>();
        let firstSeen = Infinity;
        let lastSeen = 0;

        txs.forEach((tx) => {
          firstSeen = Math.min(firstSeen, tx.timestamp);
          lastSeen = Math.max(lastSeen, tx.timestamp);
          const val = parseFloat(tx.value) || 0;
          if (tx.from === address) {
            sentEth += val;
            if (tx.to) counterparties.add(tx.to);
          }
          if (tx.to === address) {
            receivedEth += val;
            counterparties.add(tx.from);
          }
        });

        list.push({
          address,
          transactionCount: txs.length,
          transactions: [...txs].reverse(),
          totalSentEth: sentEth,
          totalReceivedEth: receivedEth,
          counterparties: Array.from(counterparties),
          firstSeen: firstSeen === Infinity ? txs[0].timestamp : firstSeen,
          lastSeen,
        });
      }
    });

    return list.sort((a, b) => b.transactionCount - a.transactionCount);
  }, []);

  const processBlockAndTransactions = useCallback((block: EthBlock, newTxs: EthTransaction[]) => {
    setLatestBlock(block);
    setBlocksObservedCount((prev) => prev + 1);

    if (newTxs.length === 0) return;

    let addedEth = 0;
    let gasSum = 0;
    let validGasCount = 0;

    newTxs.forEach((tx) => {
      const valNum = parseFloat(tx.value);
      if (!isNaN(valNum)) addedEth += valNum;

      const gasGwei = parseFloat(tx.gasPriceGwei);
      if (!isNaN(gasGwei) && gasGwei > 0) {
        gasSum += gasGwei;
        validGasCount++;
      }

      if (tx.from) {
        uniqueWalletsSet.current.add(tx.from);
        const fromList = walletFrequencyMap.current.get(tx.from) || [];
        fromList.push(tx);
        walletFrequencyMap.current.set(tx.from, fromList);
      }
      if (tx.to) {
        uniqueWalletsSet.current.add(tx.to);
        const toList = walletFrequencyMap.current.get(tx.to) || [];
        toList.push(tx);
        walletFrequencyMap.current.set(tx.to, toList);
      }
    });

    setActiveWalletsCount(uniqueWalletsSet.current.size);
    setTotalTxCount((prev) => prev + newTxs.length);
    setTotalEthObserved((prev) => prev + addedEth);

    if (validGasCount > 0) {
      setAvgGasPriceGwei(Math.round((gasSum / validGasCount) * 10) / 10);
    }

    setRepeatedWallets(computeRepeatedWallets());

    setTransactions((prev) => {
      const combined = [...newTxs, ...prev];
      return combined.slice(0, MAX_TRANSACTIONS_BUFFER);
    });
  }, [computeRepeatedWallets]);

  const pollLatestBlock = useCallback(async () => {
    if (isPaused || isPollingRef.current) return;
    isPollingRef.current = true;

    try {
      setErrorMsg(null);
      const currentBlockNum = await ethereumService.getLatestBlockNumber();
      setLatencyMs(ethereumService.getLatency());
      setCurrentEndpoint(ethereumService.getCurrentEndpoint());

      if (lastProcessedBlockNum.current === null || currentBlockNum > lastProcessedBlockNum.current) {
        setNetworkStatus('CONNECTED');
        const { block, transactions: fetchedTxs } = await ethereumService.getBlockWithTransactions(currentBlockNum);
        lastProcessedBlockNum.current = currentBlockNum;
        processBlockAndTransactions(block, fetchedTxs);
      }
    } catch (err: any) {
      console.error('[useEthereumStream] Error polling block:', err);
      setNetworkStatus('RECONNECTING');
      setErrorMsg(err.message || 'Connecting to Ethereum RPC...');
    } finally {
      isPollingRef.current = false;
    }
  }, [isPaused, processBlockAndTransactions]);

  useEffect(() => {
    let isMounted = true;
    const executePoll = async () => {
      if (isMounted) {
        await pollLatestBlock();
      }
    };
    executePoll();

    const interval = setInterval(() => {
      if (isMounted) {
        pollLatestBlock();
      }
    }, 3500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [pollLatestBlock]);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => {
      const next = !prev;
      setNetworkStatus(next ? 'PAUSED' : 'CONNECTED');
      return next;
    });
  }, []);

  const switchRpc = useCallback(async (endpoint: RpcEndpointConfig) => {
    ethereumService.setEndpoint(endpoint);
    setCurrentEndpoint(endpoint);
    lastProcessedBlockNum.current = null;
    await pollLatestBlock();
  }, [pollLatestBlock]);

  const clearSession = useCallback(() => {
    setTransactions([]);
    setTotalTxCount(0);
    setTotalEthObserved(0);
    setBlocksObservedCount(0);
    uniqueWalletsSet.current.clear();
    walletFrequencyMap.current.clear();
    setActiveWalletsCount(0);
    setRepeatedWallets([]);
  }, []);

  const statsData: NetworkStatsData = useMemo(() => ({
    latestBlock: latestBlock ? latestBlock.number : 0,
    transactionsObserved: totalTxCount,
    ethObserved: totalEthObserved,
    activeWalletsCount,
    avgGasPriceGwei,
    networkStatus,
    currentEndpoint: currentEndpoint.name,
    latencyMs,
  }), [latestBlock, totalTxCount, totalEthObserved, activeWalletsCount, avgGasPriceGwei, networkStatus, currentEndpoint, latencyMs]);

  return {
    transactions,
    latestBlock,
    blocksObservedCount,
    statsData,
    repeatedWallets,
    isPaused,
    togglePause,
    switchRpc,
    clearSession,
    currentEndpoint,
    errorMsg,
  };
}
