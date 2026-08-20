import React, { useState } from 'react';
import { Copy, Check, ArrowRight } from 'lucide-react';
import type { EthTransaction } from '../types/blockchain';
import { shortenAddress, shortenHash } from '../utils/formatters';

interface TransactionRowProps {
  tx: EthTransaction;
  onSelectTx: (tx: EthTransaction) => void;
  onTrackWallet: (address: string) => void;
  isNew?: boolean;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({
  tx,
  onSelectTx,
  onTrackWallet,
  isNew = false,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string, field: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1800);
  };

  const handleTrack = (e: React.MouseEvent, address: string) => {
    e.stopPropagation();
    onTrackWallet(address);
  };

  const valueNum = parseFloat(tx.value) || 0;
  const isHighValue = valueNum >= 1.0;

  return (
    <tr
      onClick={() => onSelectTx(tx)}
      className={`group border-b border-[rgba(255,255,255,0.04)] hover:bg-[#111111]/80 cursor-pointer transition-colors duration-150 ${
        isNew ? 'animate-row-flash' : ''
      }`}
    >
      {/* Time */}
      <td className="py-3 px-4 text-xs font-mono text-[#8A8A8A] whitespace-nowrap">
        {tx.timeFormatted}
      </td>

      {/* From */}
      <td className="py-3 px-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <button
            onClick={(e) => handleTrack(e, tx.from)}
            className="text-[#F5F5F5] hover:text-[#8A7CFF] hover:underline font-medium transition-colors"
            title={`Track wallet: ${tx.from}`}
          >
            {shortenAddress(tx.from)}
          </button>
          <button
            onClick={(e) => handleCopy(e, tx.from, `from-${tx.hash}`)}
            className="opacity-0 group-hover:opacity-100 text-[#8A8A8A] hover:text-[#F5F5F5] p-0.5 rounded transition-opacity"
            title="Copy full address"
          >
            {copiedField === `from-${tx.hash}` ? (
              <Check className="w-3 h-3 text-[#35D07F]" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
      </td>

      {/* Direction Arrow */}
      <td className="py-3 px-2 text-[#555555] text-center">
        <ArrowRight className="w-3.5 h-3.5 mx-auto" />
      </td>

      {/* To */}
      <td className="py-3 px-4 whitespace-nowrap">
        <div className="flex items-center gap-1.5 font-mono text-xs">
          {tx.to ? (
            <>
              <button
                onClick={(e) => handleTrack(e, tx.to!)}
                className="text-[#F5F5F5] hover:text-[#8A7CFF] hover:underline font-medium transition-colors"
                title={`Track wallet: ${tx.to}`}
              >
                {shortenAddress(tx.to)}
              </button>
              <button
                onClick={(e) => handleCopy(e, tx.to!, `to-${tx.hash}`)}
                className="opacity-0 group-hover:opacity-100 text-[#8A8A8A] hover:text-[#F5F5F5] p-0.5 rounded transition-opacity"
                title="Copy full address"
              >
                {copiedField === `to-${tx.hash}` ? (
                  <Check className="w-3 h-3 text-[#35D07F]" />
                ) : (
                  <Copy className="w-3 h-3" />
                )}
              </button>
            </>
          ) : (
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#8A7CFF]/10 text-[#8A7CFF] border border-[#8A7CFF]/20">
              Contract Creation
            </span>
          )}
        </div>
      </td>

      {/* Value */}
      <td className="py-3 px-4 whitespace-nowrap text-right">
        <span
          className={`font-mono text-xs font-medium px-2 py-0.5 rounded ${
            isHighValue
              ? 'bg-[#35D07F]/10 text-[#35D07F] border border-[#35D07F]/20 font-semibold'
              : valueNum > 0
              ? 'text-[#F5F5F5]'
              : 'text-[#8A8A8A]'
          }`}
        >
          {tx.value} ETH
        </span>
      </td>

      {/* Gas Fee */}
      <td className="py-3 px-4 whitespace-nowrap text-right font-mono text-xs text-[#8A8A8A] hidden sm:table-cell">
        <span>{tx.gasPriceGwei} Gwei</span>
      </td>

      {/* Block */}
      <td className="py-3 px-4 whitespace-nowrap text-right font-mono text-xs text-[#8A8A8A] hidden md:table-cell">
        #{tx.blockNumber}
      </td>

      {/* Hash */}
      <td className="py-3 px-4 whitespace-nowrap text-right">
        <div className="flex items-center justify-end gap-1.5 font-mono text-xs text-[#8A7CFF]">
          <span>{shortenHash(tx.hash, 6, 4)}</span>
          <button
            onClick={(e) => handleCopy(e, tx.hash, `hash-${tx.hash}`)}
            className="opacity-0 group-hover:opacity-100 text-[#8A8A8A] hover:text-[#F5F5F5] p-0.5 rounded transition-opacity"
            title="Copy transaction hash"
          >
            {copiedField === `hash-${tx.hash}` ? (
              <Check className="w-3 h-3 text-[#35D07F]" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};
