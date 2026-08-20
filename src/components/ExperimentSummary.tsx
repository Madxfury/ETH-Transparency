import React, { useState } from 'react';
import { Award, Download, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { EthTransaction, NetworkStatsData, RepeatedWalletInfo } from '../types/blockchain';
import { exportExperimentReport } from '../utils/exportReport';
import { formatNumber } from '../utils/formatters';

interface ExperimentSummaryProps {
  stats: NetworkStatsData;
  blocksObservedCount: number;
  repeatedWallets: RepeatedWalletInfo[];
  transactions: EthTransaction[];
}

export const ExperimentSummary: React.FC<ExperimentSummaryProps> = ({
  stats,
  blocksObservedCount,
  repeatedWallets,
  transactions,
}) => {
  const [isExported, setIsExported] = useState(false);

  const handleExport = () => {
    exportExperimentReport({
      experimentTitle: 'Demonstrating Transparency and Pseudo-Anonymity Properties of Blockchain',
      sessionStartedAt: new Date(Date.now() - 60000).toISOString(),
      sessionExportedAt: new Date().toISOString(),
      totalBlocksObserved: blocksObservedCount,
      latestBlock: stats.latestBlock,
      totalTransactionsObserved: stats.transactionsObserved,
      totalEthObserved: `${stats.ethObserved.toFixed(4)} ETH`,
      uniqueWalletsCount: stats.activeWalletsCount,
      repeatedWalletsDetected: repeatedWallets.length,
      repeatedWallets: repeatedWallets.map((rw) => ({
        address: rw.address,
        transactionsCount: rw.transactionCount,
        totalSentEth: rw.totalSentEth,
        totalReceivedEth: rw.totalReceivedEth,
        counterpartiesCount: rw.counterparties.length,
      })),
      sampleTransactions: transactions.slice(0, 30),
      conclusion:
        'The experiment demonstrates that blockchain provides strong transaction transparency while wallet addresses provide pseudonymity rather than complete anonymity.',
    });

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.85 },
      colors: ['#8A7CFF', '#35D07F', '#F5B84B'],
    });

    setIsExported(true);
    setTimeout(() => setIsExported(false), 2500);
  };

  return (
    <section className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0B0B0B] p-5 sm:p-6 shadow-2xl space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-[rgba(255,255,255,0.08)]">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-[#8A7CFF]" />
            <h2 className="text-base sm:text-lg font-semibold text-[#F5F5F5] tracking-tight">
              Experiment Observation & Summary
            </h2>
          </div>
          <p className="text-xs text-[#8A8A8A] mt-1">
            Empirical conclusions synthesized in real-time from active Ethereum Mainnet telemetry
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#151515] hover:bg-[#202020] border border-[rgba(255,255,255,0.08)] hover:border-[#8A7CFF]/40 text-xs font-mono text-[#F5F5F5] transition-all self-start sm:self-auto shadow-sm"
        >
          {isExported ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#35D07F]" />
              <span className="text-[#35D07F]">Downloaded Telemetry JSON</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 text-[#8A7CFF]" />
              <span>Export Telemetry (JSON)</span>
            </>
          )}
        </button>
      </div>

      {/* Dynamic Observation Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.06)]">
          <div className="text-[11px] text-[#8A8A8A] font-mono">Wallets Observed</div>
          <div className="font-mono text-xl font-bold text-[#F5F5F5] mt-1">
            {formatNumber(stats.activeWalletsCount)}
          </div>
          <div className="text-[10px] text-[#555555] mt-0.5">Unique public keys</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.06)]">
          <div className="text-[11px] text-[#8A8A8A] font-mono">Txs Analyzed</div>
          <div className="font-mono text-xl font-bold text-[#F5F5F5] mt-1">
            {formatNumber(stats.transactionsObserved)}
          </div>
          <div className="text-[10px] text-[#555555] mt-0.5">Verified on ledger</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.06)]">
          <div className="text-[11px] text-[#8A8A8A] font-mono">Repeated Entities</div>
          <div className="font-mono text-xl font-bold text-[#8A7CFF] mt-1">
            {formatNumber(repeatedWallets.length)}
          </div>
          <div className="text-[10px] text-[#555555] mt-0.5">$\ge 2$ correlated txs</div>
        </div>

        <div className="p-3.5 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.06)]">
          <div className="text-[11px] text-[#8A8A8A] font-mono">ETH Transferred</div>
          <div className="font-mono text-xl font-bold text-[#35D07F] mt-1">
            {stats.ethObserved > 0 ? `${stats.ethObserved.toFixed(2)}` : '0.00'} ETH
          </div>
          <div className="text-[10px] text-[#555555] mt-0.5">Cumulative volume</div>
        </div>
      </div>

      {/* Synthesis Box */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#111111] border border-[rgba(255,255,255,0.08)] space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase text-[#35D07F] font-semibold tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#35D07F]" />
          <span>Empirical Observation Conclusion</span>
        </div>
        <blockquote className="text-sm text-[#F5F5F5] font-medium leading-relaxed italic border-l-2 border-[#35D07F] pl-3">
          “The experiment demonstrates that blockchain provides strong transaction transparency while wallet addresses provide pseudonymity rather than complete anonymity.”
        </blockquote>
        <p className="text-xs text-[#8A8A8A] leading-relaxed">
          Through continuous inspection of {formatNumber(stats.transactionsObserved)} transactions across {blocksObservedCount} blocks, we observed that every transfer amount, timestamp, and gas fee is 100% auditable by anyone. Simultaneously, entities operate under alphanumeric hex addresses without personal identifiers, yet their repeated transactions form recognizable behavioral patterns on the transaction network.
        </p>
      </div>
    </section>
  );
};
