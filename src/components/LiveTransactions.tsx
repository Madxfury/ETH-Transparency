import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import type { EthTransaction } from '../types/blockchain';
import { TransactionRow } from './TransactionRow';

interface LiveTransactionsProps {
  transactions: EthTransaction[];
  onSelectTx: (tx: EthTransaction) => void;
  onTrackWallet: (address: string) => void;
  isPaused: boolean;
}

type FilterType = 'all' | 'high_value' | 'contracts' | 'transfers';

export const LiveTransactions: React.FC<LiveTransactionsProps> = ({
  transactions,
  onSelectTx,
  onTrackWallet,
  isPaused,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (filter === 'high_value') {
        const val = parseFloat(tx.value) || 0;
        if (val < 0.1) return false;
      } else if (filter === 'contracts') {
        if (!tx.isContractCreation && (!tx.inputDataSnippet || tx.inputDataSnippet === '0x')) return false;
      } else if (filter === 'transfers') {
        if (tx.isContractCreation || (parseFloat(tx.value) === 0 && tx.inputDataSnippet)) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchFrom = tx.from.toLowerCase().includes(q);
        const matchTo = tx.to ? tx.to.toLowerCase().includes(q) : false;
        const matchHash = tx.hash.toLowerCase().includes(q);
        const matchBlock = tx.blockNumber.toString().includes(q);
        return matchFrom || matchTo || matchHash || matchBlock;
      }

      return true;
    });
  }, [transactions, filter, searchQuery]);

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0B0B0B] overflow-hidden shadow-2xl">
      {/* Header & Controls */}
      <div className="p-4 sm:p-5 border-b border-[rgba(255,255,255,0.08)] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              {!isPaused && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8A7CFF] opacity-75"></span>
              )}
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8A7CFF]"></span>
            </span>
            <h2 className="text-base sm:text-lg font-semibold text-[#F5F5F5] tracking-tight">
              Live Ethereum Transactions
            </h2>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#151515] text-[#8A8A8A] border border-[rgba(255,255,255,0.06)]">
              {filteredTransactions.length} streaming
            </span>
          </div>
          <p className="text-xs text-[#8A8A8A] mt-1">
            Real-time block transactions continuously decoded from Ethereum Mainnet JSON-RPC
          </p>
        </div>

        {/* Filter and Search Toolbar */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
            <input
              type="text"
              placeholder="Search address / hash / block..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)] text-xs text-[#F5F5F5] placeholder-[#555555] focus:outline-none focus:border-[#8A7CFF] transition-colors"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center rounded-lg bg-[#111111] p-1 border border-[rgba(255,255,255,0.08)] text-xs">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'all'
                  ? 'bg-[#222222] text-[#F5F5F5] font-medium shadow-sm'
                  : 'text-[#8A8A8A] hover:text-[#F5F5F5]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('high_value')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'high_value'
                  ? 'bg-[#222222] text-[#35D07F] font-medium shadow-sm'
                  : 'text-[#8A8A8A] hover:text-[#F5F5F5]'
              }`}
            >
              &gt; 0.1 ETH
            </button>
            <button
              onClick={() => setFilter('transfers')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'transfers'
                  ? 'bg-[#222222] text-[#8A7CFF] font-medium shadow-sm'
                  : 'text-[#8A8A8A] hover:text-[#F5F5F5]'
              }`}
            >
              Transfers
            </button>
            <button
              onClick={() => setFilter('contracts')}
              className={`px-2.5 py-1 rounded-md transition-colors ${
                filter === 'contracts'
                  ? 'bg-[#222222] text-[#F5B84B] font-medium shadow-sm'
                  : 'text-[#8A8A8A] hover:text-[#F5F5F5]'
              }`}
            >
              Contracts
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="overflow-x-auto max-h-[540px] overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-[#0E0E0E] text-[11px] font-mono uppercase text-[#8A8A8A] border-b border-[rgba(255,255,255,0.08)] z-10">
            <tr>
              <th className="py-3 px-4 font-medium">TIME</th>
              <th className="py-3 px-4 font-medium">FROM (PSEUDONYMOUS WALLET)</th>
              <th className="py-3 px-2 text-center font-medium"></th>
              <th className="py-3 px-4 font-medium">TO (RECIPIENT / CONTRACT)</th>
              <th className="py-3 px-4 text-right font-medium">VALUE</th>
              <th className="py-3 px-4 text-right font-medium hidden sm:table-cell">GAS PRICE</th>
              <th className="py-3 px-4 text-right font-medium hidden md:table-cell">BLOCK</th>
              <th className="py-3 px-4 text-right font-medium">TX HASH</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx, idx) => (
                <TransactionRow
                  key={tx.hash}
                  tx={tx}
                  onSelectTx={onSelectTx}
                  onTrackWallet={onTrackWallet}
                  isNew={idx === 0}
                />
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-12 text-center text-xs text-[#8A8A8A]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="w-6 h-6 rounded-full border-2 border-[#8A7CFF] border-t-transparent animate-spin"></div>
                    <p className="font-mono text-[#F5F5F5]">Ingesting live Ethereum blocks...</p>
                    <p className="text-[11px] text-[#555555]">
                      Connecting to public RPC nodes and streaming transactions as they are mined.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="p-3 px-4 bg-[#080808] border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11px] text-[#8A8A8A] font-mono">
        <div>
          Click any transaction row for in-depth cryptographic and transparency inspection.
        </div>
        <div className="hidden sm:block text-[#555555]">
          Ethereum Virtual Machine (EVM) Telemetry
        </div>
      </div>
    </div>
  );
};
