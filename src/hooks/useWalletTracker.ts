import { useState, useCallback, useMemo } from 'react';
import type { EthTransaction, WalletTrackerState } from '../types/blockchain';
import { isValidEthAddress } from '../utils/validators';
import { ethereumService } from '../services/ethereum';

export const NOTABLE_WALLETS = [
  {
    name: 'vitalik.eth',
    address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    category: 'Ecosystem',
  },
  {
    name: 'Uniswap V3 Router',
    address: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
    category: 'DeFi Protocol',
  },
  {
    name: 'Binance Hot Wallet',
    address: '0x28C6c06298d514Db089934071355E5743bf21d60',
    category: 'Exchange',
  },
  {
    name: 'Tether (USDT) Deployer',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    category: 'Smart Contract',
  },
];

export function useWalletTracker(allTransactions: EthTransaction[]) {
  const [searchedAddress, setSearchedAddress] = useState<string>('');
  const [trackedAddress, setTrackedAddress] = useState<string | null>(null);
  const [balanceEth, setBalanceEth] = useState<string | null>(null);
  const [onChainTxCount, setOnChainTxCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const trackWallet = useCallback(async (addressToTrack: string) => {
    const cleanAddress = addressToTrack.trim().toLowerCase();
    
    if (!isValidEthAddress(cleanAddress)) {
      setError('Invalid Ethereum address format (must be 0x + 40 hex characters).');
      return;
    }

    setError(null);
    setTrackedAddress(cleanAddress);
    setSearchedAddress(cleanAddress);
    setIsLoading(true);

    try {
      const [balance, txCount] = await Promise.all([
        ethereumService.getWalletBalance(cleanAddress),
        ethereumService.getWalletTxCount(cleanAddress),
      ]);
      setBalanceEth(balance);
      setOnChainTxCount(txCount);
    } catch (err: any) {
      console.error('[useWalletTracker] Error fetching on-chain data:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearTracker = useCallback(() => {
    setTrackedAddress(null);
    setSearchedAddress('');
    setBalanceEth(null);
    setOnChainTxCount(null);
    setError(null);
  }, []);

  const trackerState: WalletTrackerState | null = useMemo(() => {
    if (!trackedAddress) return null;

    let sentEth = 0;
    let receivedEth = 0;
    const counterparties = new Set<string>();
    let firstObserved: number | null = null;
    let lastActivity: number | null = null;

    const matchedTxs: { tx: EthTransaction; direction: 'SENT' | 'RECEIVED' | 'SELF' }[] = [];

    allTransactions.forEach((tx) => {
      const fromMatch = tx.from === trackedAddress;
      const toMatch = tx.to === trackedAddress;

      if (fromMatch || toMatch) {
        if (firstObserved === null || tx.timestamp < firstObserved) {
          firstObserved = tx.timestamp;
        }
        if (lastActivity === null || tx.timestamp > lastActivity) {
          lastActivity = tx.timestamp;
        }

        const val = parseFloat(tx.value) || 0;

        let direction: 'SENT' | 'RECEIVED' | 'SELF' = 'SENT';
        if (fromMatch && toMatch) {
          direction = 'SELF';
        } else if (fromMatch) {
          direction = 'SENT';
          sentEth += val;
          if (tx.to) counterparties.add(tx.to);
        } else {
          direction = 'RECEIVED';
          receivedEth += val;
          counterparties.add(tx.from);
        }

        matchedTxs.push({ tx, direction });
      }
    });

    return {
      address: trackedAddress,
      isValid: true,
      balanceEth,
      onChainTxCount,
      sessionTxCount: matchedTxs.length,
      totalSentEth: sentEth,
      totalReceivedEth: receivedEth,
      firstObserved,
      lastActivity,
      counterparties: Array.from(counterparties),
      transactions: matchedTxs,
      isLoading,
      error,
    };
  }, [trackedAddress, allTransactions, balanceEth, onChainTxCount, isLoading, error]);

  return {
    searchedAddress,
    setSearchedAddress,
    trackedAddress,
    trackerState,
    trackWallet,
    clearTracker,
    isLoading,
    error,
    notableWallets: NOTABLE_WALLETS,
  };
}
