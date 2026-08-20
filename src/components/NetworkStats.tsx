import React from 'react';
import { Blocks, ArrowLeftRight, Coins, Users, Flame, Wifi } from 'lucide-react';
import type { NetworkStatsData } from '../types/blockchain';
import { formatNumber } from '../utils/formatters';

interface NetworkStatsProps {
  stats: NetworkStatsData;
}

export const NetworkStats: React.FC<NetworkStatsProps> = ({ stats }) => {
  return (
    <section className="py-4 border-b border-[rgba(255,255,255,0.06)] bg-[#080808]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Latest Block */}
          <div className="p-3.5 rounded-lg bg-[#0B0B0B] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8A8A8A] text-xs mb-1.5">
              <span>Latest Block</span>
              <Blocks className="w-3.5 h-3.5 text-[#8A7CFF]" />
            </div>
            <div className="font-mono text-base sm:text-lg font-semibold text-[#F5F5F5] truncate">
              {stats.latestBlock > 0 ? `#${formatNumber(stats.latestBlock)}` : 'Syncing...'}
            </div>
            <div className="text-[10px] text-[#8A8A8A] mt-1 truncate">
              Ethereum Mainnet
            </div>
          </div>

          {/* Transactions Observed */}
          <div className="p-3.5 rounded-lg bg-[#0B0B0B] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8A8A8A] text-xs mb-1.5">
              <span>Tx Observed</span>
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#35D07F]" />
            </div>
            <div className="font-mono text-base sm:text-lg font-semibold text-[#F5F5F5] truncate">
              {formatNumber(stats.transactionsObserved)}
            </div>
            <div className="text-[10px] text-[#8A8A8A] mt-1 truncate">
              Live Ingested
            </div>
          </div>

          {/* ETH Observed */}
          <div className="p-3.5 rounded-lg bg-[#0B0B0B] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8A8A8A] text-xs mb-1.5">
              <span>ETH Volume</span>
              <Coins className="w-3.5 h-3.5 text-[#F5B84B]" />
            </div>
            <div className="font-mono text-base sm:text-lg font-semibold text-[#F5F5F5] truncate" title={`${stats.ethObserved} ETH`}>
              {stats.ethObserved > 0 ? `${stats.ethObserved.toFixed(2)} ETH` : '0.00 ETH'}
            </div>
            <div className="text-[10px] text-[#8A8A8A] mt-1 truncate">
              Total Value Tracked
            </div>
          </div>

          {/* Active Wallets */}
          <div className="p-3.5 rounded-lg bg-[#0B0B0B] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8A8A8A] text-xs mb-1.5">
              <span>Active Wallets</span>
              <Users className="w-3.5 h-3.5 text-[#8A7CFF]" />
            </div>
            <div className="font-mono text-base sm:text-lg font-semibold text-[#F5F5F5] truncate">
              {formatNumber(stats.activeWalletsCount)}
            </div>
            <div className="text-[10px] text-[#8A8A8A] mt-1 truncate">
              Unique Identifiers
            </div>
          </div>

          {/* Gas Price */}
          <div className="p-3.5 rounded-lg bg-[#0B0B0B] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8A8A8A] text-xs mb-1.5">
              <span>Base Gas</span>
              <Flame className="w-3.5 h-3.5 text-[#FF5A5F]" />
            </div>
            <div className="font-mono text-base sm:text-lg font-semibold text-[#F5F5F5] truncate">
              {stats.avgGasPriceGwei > 0 ? `${stats.avgGasPriceGwei} Gwei` : '—'}
            </div>
            <div className="text-[10px] text-[#8A8A8A] mt-1 truncate">
              Estimated Priority
            </div>
          </div>

          {/* Network Health */}
          <div className="p-3.5 rounded-lg bg-[#0B0B0B] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[#8A8A8A] text-xs mb-1.5">
              <span>Network Status</span>
              <Wifi className="w-3.5 h-3.5 text-[#35D07F]" />
            </div>
            <div className="font-mono text-sm sm:text-base font-semibold text-[#35D07F] truncate flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#35D07F]"></span>
              <span>{stats.networkStatus}</span>
            </div>
            <div className="text-[10px] text-[#8A8A8A] mt-1 truncate">
              {stats.currentEndpoint}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
