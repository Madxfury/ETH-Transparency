import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, ShieldCheck, Layers, FileCode, CheckCircle2 } from 'lucide-react';
import type { EthTransaction } from '../types/blockchain';
import { formatNumber, formatRelativeTime } from '../utils/formatters';

interface TransactionDrawerProps {
  tx: EthTransaction | null;
  onClose: () => void;
  onTrackWallet: (address: string) => void;
}

export const TransactionDrawer: React.FC<TransactionDrawerProps> = ({
  tx,
  onClose,
  onTrackWallet,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!tx) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const etherscanUrl = `https://etherscan.io/tx/${tx.hash}`;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-[#0B0B0B] border-l border-[rgba(255,255,255,0.08)] shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#151515] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#8A7CFF]">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A7CFF] font-semibold">
                  EVM Record
                </span>
                <h3 className="text-lg font-semibold text-[#F5F5F5]">
                  Transaction Details
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-[#111111] hover:bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Status & Value Banner */}
            <div className="p-4 rounded-xl bg-[#111111] border border-[rgba(255,255,255,0.08)] flex items-center justify-between">
              <div>
                <div className="text-xs text-[#8A8A8A] font-medium mb-1">Transferred Amount</div>
                <div className="text-2xl font-bold font-mono text-[#F5F5F5]">{tx.value} ETH</div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#35D07F]/10 border border-[#35D07F]/20 text-[#35D07F] text-xs font-mono font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{tx.status}</span>
                </div>
                <div className="text-[11px] font-mono text-[#8A8A8A] mt-1.5">
                  Block #{formatNumber(tx.blockNumber)}
                </div>
              </div>
            </div>

            {/* Transaction Hash */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#8A8A8A] uppercase tracking-wider font-mono">
                Transaction Hash
              </label>
              <div className="p-3 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)] flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-[#F5F5F5] break-all select-all">
                  {tx.hash}
                </span>
                <button
                  onClick={() => handleCopy(tx.hash, 'hash')}
                  className="p-1.5 rounded-md hover:bg-[#222222] text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors shrink-0"
                  title="Copy Hash"
                >
                  {copiedKey === 'hash' ? <Check className="w-4 h-4 text-[#35D07F]" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* From & To Addresses */}
            <div className="space-y-4">
              {/* From */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-[#8A8A8A] uppercase tracking-wider font-mono">
                    Sender (From)
                  </label>
                  <button
                    onClick={() => {
                      onTrackWallet(tx.from);
                      onClose();
                    }}
                    className="text-[11px] font-mono text-[#8A7CFF] hover:underline"
                  >
                    Track in Observatory →
                  </button>
                </div>
                <div className="p-3 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)] flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-[#F5F5F5] break-all select-all">
                    {tx.from}
                  </span>
                  <button
                    onClick={() => handleCopy(tx.from, 'from')}
                    className="p-1.5 rounded-md hover:bg-[#222222] text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors shrink-0"
                    title="Copy Address"
                  >
                    {copiedKey === 'from' ? <Check className="w-4 h-4 text-[#35D07F]" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* To */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-[#8A8A8A] uppercase tracking-wider font-mono">
                    Recipient (To)
                  </label>
                  {tx.to && (
                    <button
                      onClick={() => {
                        onTrackWallet(tx.to!);
                        onClose();
                      }}
                      className="text-[11px] font-mono text-[#8A7CFF] hover:underline"
                    >
                      Track in Observatory →
                    </button>
                  )}
                </div>
                <div className="p-3 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)] flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-[#F5F5F5] break-all select-all">
                    {tx.to ? tx.to : 'Contract Creation (0x0)'}
                  </span>
                  {tx.to && (
                    <button
                      onClick={() => handleCopy(tx.to!, 'to')}
                      className="p-1.5 rounded-md hover:bg-[#222222] text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors shrink-0"
                      title="Copy Address"
                    >
                      {copiedKey === 'to' ? <Check className="w-4 h-4 text-[#35D07F]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Block & Gas Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)]">
                <div className="text-[11px] text-[#8A8A8A] font-mono">Timestamp</div>
                <div className="text-xs font-medium text-[#F5F5F5] mt-1 font-mono">{tx.timeFormatted} UTC</div>
                <div className="text-[10px] text-[#555555] mt-0.5">{formatRelativeTime(tx.timestamp)}</div>
              </div>

              <div className="p-3 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)]">
                <div className="text-[11px] text-[#8A8A8A] font-mono">Gas Fee</div>
                <div className="text-xs font-medium text-[#F5F5F5] mt-1 font-mono">{tx.gasFeeEth} ETH</div>
                <div className="text-[10px] text-[#8A8A8A] mt-0.5">Base: {tx.gasPriceGwei} Gwei</div>
              </div>

              <div className="p-3 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)]">
                <div className="text-[11px] text-[#8A8A8A] font-mono">Gas Units Limit</div>
                <div className="text-xs font-medium text-[#F5F5F5] mt-1 font-mono">{tx.gas}</div>
              </div>

              <div className="p-3 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)]">
                <div className="text-[11px] text-[#8A8A8A] font-mono">Account Nonce</div>
                <div className="text-xs font-medium text-[#F5F5F5] mt-1 font-mono">{tx.nonce ?? '0'}</div>
              </div>
            </div>

            {/* Input Data / Calldata snippet if present */}
            {tx.inputDataSnippet && tx.inputDataSnippet !== '0x' && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-[#8A8A8A] uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-[#F5B84B]" />
                  <span>Call Data (Smart Contract Payload)</span>
                </label>
                <div className="p-3 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)] font-mono text-xs text-[#8A8A8A] break-all">
                  {tx.inputDataSnippet}
                </div>
              </div>
            )}

            {/* Educational Transparency Note */}
            <div className="p-4 rounded-xl bg-[#8A7CFF]/5 border border-[#8A7CFF]/20 space-y-2">
              <div className="flex items-center gap-2 text-[#8A7CFF] text-xs font-semibold uppercase tracking-wider font-mono">
                <ShieldCheck className="w-4 h-4" />
                <span>Observatory Transparency Note</span>
              </div>
              <p className="text-xs text-[#8A8A8A] leading-relaxed">
                This transaction was permanently broadcast to all ~8,000+ Ethereum validating nodes. The value, timestamp, gas, and sender address are completely public. However, the sender address is a cryptographic 160-bit hash with no innate personal name or government ID.
              </p>
            </div>
          </div>

          {/* Footer Action */}
          <div className="p-6 border-t border-[rgba(255,255,255,0.08)] bg-[#0E0E0E]">
            <a
              href={etherscanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-[#8A7CFF] hover:bg-[#7968FF] text-black font-semibold text-sm transition-all shadow-[0_0_20px_rgba(138,124,255,0.25)]"
            >
              <span>View on Etherscan</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
