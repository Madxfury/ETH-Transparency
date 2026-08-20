import React, { useState } from 'react';
import { Search, Wallet, ArrowUpRight, ArrowDownLeft, ExternalLink, Copy, Check, X } from 'lucide-react';
import type { EthTransaction, WalletTrackerState } from '../types/blockchain';
import { shortenAddress, formatNumber } from '../utils/formatters';

interface WalletTrackerProps {
  searchedAddress: string;
  setSearchedAddress: (val: string) => void;
  trackerState: WalletTrackerState | null;
  onTrack: (address: string) => void;
  onClear: () => void;
  onSelectTx: (tx: EthTransaction) => void;
  notableWallets: { name: string; address: string; category: string }[];
  isLoading: boolean;
  error: string | null;
}

export const WalletTracker: React.FC<WalletTrackerProps> = ({
  searchedAddress,
  setSearchedAddress,
  trackerState,
  onTrack,
  onClear,
  onSelectTx,
  notableWallets,
  isLoading,
  error,
}) => {
  const [copied, setCopied] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchedAddress.trim()) {
      onTrack(searchedAddress.trim());
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0B0B0B] p-5 sm:p-6 shadow-2xl">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[#8A7CFF]" />
            <h2 className="text-base sm:text-lg font-semibold text-[#F5F5F5] tracking-tight">
              Wallet Activity Tracker
            </h2>
          </div>
          <p className="text-xs text-[#8A8A8A] mt-1">
            Isolate and inspect an individual pseudonymous address across all observed blocks & on-chain state
          </p>
        </div>

        {/* Notable Wallets Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-[#555555] font-mono mr-1">Presets:</span>
          {notableWallets.map((item) => (
            <button
              key={item.address}
              onClick={() => {
                setSearchedAddress(item.address);
                onTrack(item.address);
              }}
              className="text-[11px] font-mono px-2 py-1 rounded bg-[#111111] hover:bg-[#1A1A1A] border border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)] text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors"
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Input Search Form */}
      <form onSubmit={handleSubmit} className="mt-5 flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A8A8A]" />
          <input
            type="text"
            placeholder="Enter Ethereum wallet address (0x...)"
            value={searchedAddress}
            onChange={(e) => setSearchedAddress(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)] text-xs sm:text-sm font-mono text-[#F5F5F5] placeholder-[#555555] focus:outline-none focus:border-[#8A7CFF] transition-colors"
          />
          {searchedAddress && (
            <button
              type="button"
              onClick={() => {
                setSearchedAddress('');
                if (trackerState) onClear();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8A8A] hover:text-[#F5F5F5]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading || !searchedAddress.trim()}
          className="px-5 py-2.5 rounded-lg bg-[#8A7CFF] hover:bg-[#7968FF] disabled:opacity-50 text-black font-semibold text-xs sm:text-sm transition-all shadow-[0_0_15px_rgba(138,124,255,0.2)] flex items-center justify-center gap-2 shrink-0 font-mono"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin"></div>
              <span>TRACKING...</span>
            </>
          ) : (
            <span>TRACK WALLET</span>
          )}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-3 p-3 rounded-lg bg-[#FF5A5F]/10 border border-[#FF5A5F]/20 text-[#FF5A5F] text-xs font-mono">
          {error}
        </div>
      )}

      {/* Tracker Details */}
      {trackerState ? (
        <div className="mt-6 space-y-6 animate-in fade-in duration-300">
          {/* Wallet Header Banner */}
          <div className="p-4 rounded-xl bg-[#111111] border border-[rgba(255,255,255,0.08)] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="text-[11px] font-mono uppercase text-[#8A7CFF] font-semibold tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8A7CFF]"></span>
                <span>Active Monitored Entity</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-sm sm:text-base font-semibold text-[#F5F5F5] break-all select-all">
                  {trackerState.address}
                </span>
                <button
                  onClick={() => handleCopy(trackerState.address)}
                  className="p-1 rounded hover:bg-[#222222] text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors"
                  title="Copy Address"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#35D07F]" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`https://etherscan.io/address/${trackerState.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#151515] hover:bg-[#222222] border border-[rgba(255,255,255,0.08)] text-xs text-[#8A7CFF] font-mono flex items-center gap-1.5 transition-colors"
              >
                <span>Etherscan</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                onClick={onClear}
                className="px-3 py-1.5 rounded-lg bg-[#151515] hover:bg-[#222222] border border-[rgba(255,255,255,0.08)] text-xs text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors font-mono"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* On-Chain Balance */}
            <div className="p-3.5 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)]">
              <div className="text-[11px] text-[#8A8A8A] font-mono">Live RPC Balance</div>
              <div className="font-mono text-base font-semibold text-[#F5F5F5] mt-1">
                {trackerState.balanceEth !== null ? `${trackerState.balanceEth} ETH` : 'Loading...'}
              </div>
            </div>

            {/* Lifetime Tx Nonce */}
            <div className="p-3.5 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)]">
              <div className="text-[11px] text-[#8A8A8A] font-mono">Lifetime Tx Nonce</div>
              <div className="font-mono text-base font-semibold text-[#F5F5F5] mt-1">
                {trackerState.onChainTxCount !== null ? formatNumber(trackerState.onChainTxCount) : '—'}
              </div>
            </div>

            {/* Session Transactions */}
            <div className="p-3.5 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)]">
              <div className="text-[11px] text-[#8A8A8A] font-mono">Session Txs</div>
              <div className="font-mono text-base font-semibold text-[#8A7CFF] mt-1">
                {trackerState.sessionTxCount}
              </div>
            </div>

            {/* ETH Sent */}
            <div className="p-3.5 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)]">
              <div className="text-[11px] text-[#8A8A8A] font-mono">ETH Sent (Session)</div>
              <div className="font-mono text-base font-semibold text-[#F5B84B] mt-1">
                {trackerState.totalSentEth.toFixed(4)} ETH
              </div>
            </div>

            {/* ETH Received */}
            <div className="p-3.5 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)]">
              <div className="text-[11px] text-[#8A8A8A] font-mono">ETH Recv (Session)</div>
              <div className="font-mono text-base font-semibold text-[#35D07F] mt-1">
                {trackerState.totalReceivedEth.toFixed(4)} ETH
              </div>
            </div>

            {/* Unique Counterparties */}
            <div className="p-3.5 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)]">
              <div className="text-[11px] text-[#8A8A8A] font-mono">Counterparties</div>
              <div className="font-mono text-base font-semibold text-[#F5F5F5] mt-1">
                {trackerState.counterparties.length}
              </div>
            </div>
          </div>

          {/* Counterparties Tags */}
          {trackerState.counterparties.length > 0 && (
            <div className="p-4 rounded-xl bg-[#111111] border border-[rgba(255,255,255,0.08)]">
              <div className="text-xs font-mono uppercase text-[#8A8A8A] mb-2 font-medium">
                Observed Counterparty Connections ({trackerState.counterparties.length})
              </div>
              <div className="flex flex-wrap gap-1.5">
                {trackerState.counterparties.map((cp) => (
                  <button
                    key={cp}
                    onClick={() => onTrack(cp)}
                    className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#161616] hover:bg-[#202020] border border-[rgba(255,255,255,0.06)] hover:border-[#8A7CFF]/40 text-[#F5F5F5] transition-colors"
                  >
                    {shortenAddress(cp)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Transaction History for this wallet */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#F5F5F5] font-mono uppercase tracking-wider">
                Session Transaction History ({trackerState.transactions.length})
              </h3>
              <span className="text-xs text-[#8A8A8A]">
                Sorted by most recent
              </span>
            </div>

            {trackerState.transactions.length > 0 ? (
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {trackerState.transactions.map(({ tx, direction }) => (
                  <div
                    key={tx.hash}
                    onClick={() => onSelectTx(tx)}
                    className="p-3 rounded-lg bg-[#111111] hover:bg-[#161616] border border-[rgba(255,255,255,0.06)] cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs font-mono"
                  >
                    <div className="flex items-center gap-3">
                      {/* Direction Tag */}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                          direction === 'SENT'
                            ? 'bg-[#F5B84B]/10 text-[#F5B84B] border border-[#F5B84B]/20'
                            : direction === 'RECEIVED'
                            ? 'bg-[#35D07F]/10 text-[#35D07F] border border-[#35D07F]/20'
                            : 'bg-[#8A7CFF]/10 text-[#8A7CFF] border border-[#8A7CFF]/20'
                        }`}
                      >
                        {direction === 'SENT' ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownLeft className="w-3 h-3" />
                        )}
                        <span>{direction}</span>
                      </span>

                      <div className="text-[#8A8A8A]">
                        {tx.timeFormatted} • Block #{tx.blockNumber}
                      </div>

                      <div className="text-[#F5F5F5] hidden sm:block">
                        {direction === 'SENT'
                          ? `To: ${shortenAddress(tx.to)}`
                          : `From: ${shortenAddress(tx.from)}`}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-[#F5F5F5]">
                        {tx.value} ETH
                      </span>
                      <span className="text-[#8A7CFF] hover:underline">
                        Details →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.06)] text-center text-xs text-[#8A8A8A]">
                <p>No new transactions involving this address observed in the current live buffer.</p>
                <p className="text-[11px] text-[#555555] mt-1">
                  The dashboard will automatically correlate transactions if this address transacts while streaming.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6 p-8 rounded-xl bg-[#111111]/40 border border-[rgba(255,255,255,0.04)] text-center text-xs text-[#8A8A8A]">
          <p className="font-mono text-[#F5F5F5]">Enter any Ethereum wallet address or click a preset to begin tracking.</p>
          <p className="text-[11px] text-[#555555] mt-1">
            Observe on-chain balance, lifetime nonce, session flows, and counterparty graphs.
          </p>
        </div>
      )}
    </div>
  );
};
