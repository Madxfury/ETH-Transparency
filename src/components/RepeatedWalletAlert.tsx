import React, { useState } from 'react';
import { ArrowRight, ChevronDown, ChevronUp, Fingerprint, ShieldAlert, Sparkles } from 'lucide-react';
import type { RepeatedWalletInfo, EthTransaction } from '../types/blockchain';
import { shortenAddress } from '../utils/formatters';

interface RepeatedWalletAlertProps {
  repeatedWallets: RepeatedWalletInfo[];
  onTrackWallet: (address: string) => void;
  onSelectTx: (tx: EthTransaction) => void;
}

export const RepeatedWalletAlert: React.FC<RepeatedWalletAlertProps> = ({
  repeatedWallets,
  onTrackWallet,
  onSelectTx,
}) => {
  const [expandedAddress, setExpandedAddress] = useState<string | null>(null);

  if (repeatedWallets.length === 0) {
    return (
      <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0B0B0B] p-5 sm:p-6 shadow-2xl">
        <div className="flex items-center gap-2 pb-4 border-b border-[rgba(255,255,255,0.08)]">
          <Fingerprint className="w-5 h-5 text-[#8A7CFF]" />
          <h2 className="text-base sm:text-lg font-semibold text-[#F5F5F5] tracking-tight">
            Multiple Transaction Correlation Detector
          </h2>
        </div>
        <div className="py-8 text-center text-xs text-[#8A8A8A]">
          <p className="font-mono text-[#F5F5F5]">Monitoring session for repeated wallet activity...</p>
          <p className="text-[11px] text-[#555555] mt-1 max-w-md mx-auto">
            When an address executes multiple transactions in this session, this detector highlights how temporal patterns correlate an entity despite lack of real-world identity.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#8A7CFF]/30 bg-[#0B0B0B] p-5 sm:p-6 shadow-2xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8A7CFF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#8A7CFF]"></span>
            </span>
            <h2 className="text-base sm:text-lg font-semibold text-[#F5F5F5] tracking-tight">
              Multiple Transaction Activity Detected ({repeatedWallets.length})
            </h2>
          </div>
          <p className="text-xs text-[#8A8A8A] mt-1">
            Empirical evidence of pseudonymity: Individual addresses observed performing multiple public actions
          </p>
        </div>

        <div className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#8A7CFF]/10 text-[#8A7CFF] border border-[#8A7CFF]/20 self-start sm:self-auto">
          {repeatedWallets.length} Correlated {repeatedWallets.length === 1 ? 'Entity' : 'Entities'}
        </div>
      </div>

      {/* List of Repeated Entities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {repeatedWallets.slice(0, 6).map((wallet) => {
          const isExpanded = expandedAddress === wallet.address;

          return (
            <div
              key={wallet.address}
              className="rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)] hover:border-[#8A7CFF]/40 transition-all overflow-hidden"
            >
              {/* Entity Summary Header */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono uppercase text-[#8A7CFF] font-semibold tracking-wider flex items-center gap-1.5">
                    <ShieldAlert className="w-3 h-3 text-[#8A7CFF]" />
                    <span>Repeated Activity Detected</span>
                  </div>
                  <div className="font-mono text-sm font-semibold text-[#F5F5F5] mt-1">
                    {shortenAddress(wallet.address, 8, 6)}
                  </div>
                  <div className="text-xs text-[#8A8A8A] mt-0.5 font-mono">
                    <strong className="text-[#35D07F] font-semibold">{wallet.transactionCount} transactions</strong> observed in session
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onTrackWallet(wallet.address)}
                    className="px-2.5 py-1 rounded bg-[#161616] hover:bg-[#222222] border border-[rgba(255,255,255,0.08)] text-[11px] font-mono text-[#8A7CFF] hover:underline"
                  >
                    Track
                  </button>
                  <button
                    onClick={() => setExpandedAddress(isExpanded ? null : wallet.address)}
                    className="p-1.5 rounded bg-[#161616] hover:bg-[#222222] text-[#8A8A8A] hover:text-[#F5F5F5]"
                    title="Toggle transactions breakdown"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Transactions List */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-[rgba(255,255,255,0.06)] bg-[#0C0C0C] space-y-2">
                  <div className="text-[11px] font-mono text-[#8A8A8A] uppercase">
                    Correlated Transactions:
                  </div>
                  {wallet.transactions.map((tx, idx) => (
                    <div
                      key={tx.hash}
                      onClick={() => onSelectTx(tx)}
                      className="p-2.5 rounded bg-[#141414] hover:bg-[#1C1C1C] border border-[rgba(255,255,255,0.04)] cursor-pointer text-xs font-mono flex items-center justify-between text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#8A7CFF] font-medium">#{String(idx + 1).padStart(2, '0')}</span>
                        <span>{shortenAddress(tx.from)}</span>
                        <ArrowRight className="w-3 h-3 text-[#555555]" />
                        <span>{shortenAddress(tx.to)}</span>
                      </div>
                      <div className="font-medium text-[#F5F5F5]">
                        {tx.value} ETH
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Educational takeaway note */}
      <div className="p-3.5 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.06)] text-xs text-[#8A8A8A] flex items-start gap-2.5">
        <Sparkles className="w-4 h-4 text-[#8A7CFF] shrink-0 mt-0.5" />
        <div>
          <strong className="text-[#F5F5F5]">Pseudonymity in Practice:</strong> Although the holder's physical identity is never written to Ethereum's state, observing temporal sequences across blocks enables clustering, balance tracking, and behavioral fingerprinting.
        </div>
      </div>
    </div>
  );
};
