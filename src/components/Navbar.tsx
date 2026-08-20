import React from 'react';
import { Cpu, Pause, Play, Settings2, RefreshCw } from 'lucide-react';
import type { NetworkStatsData, RpcEndpointConfig } from '../types/blockchain';
import { formatNumber } from '../utils/formatters';

interface NavbarProps {
  stats: NetworkStatsData;
  isPaused: boolean;
  onTogglePause: () => void;
  onOpenRpcModal: () => void;
  onResetSession: () => void;
  currentEndpoint: RpcEndpointConfig;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  isPaused,
  onTogglePause,
  onOpenRpcModal,
  onResetSession,
  currentEndpoint,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[rgba(255,255,255,0.08)] bg-[#050505]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.12)] flex items-center justify-center text-[#8A7CFF] shadow-[0_0_12px_rgba(138,124,255,0.2)]">
            <svg className="w-4 h-4" viewBox="0 0 32 32" fill="currentColor">
              <path d="M16 2L6 18.5l10 6 10-6L16 2zm0 3.25l7.5 12.35-7.5 4.5-7.5-4.5L16 5.25zM16 26l-10-5.8 10 9.8 10-9.8L16 26z" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-tight text-[#F5F5F5] text-sm sm:text-base">
                ETH TRANSPARENCY
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-[#8A7CFF]/10 text-[#8A7CFF] border border-[#8A7CFF]/20 font-medium">
                Mainnet
              </span>
            </div>
            <p className="text-[11px] text-[#8A8A8A] tracking-normal hidden sm:block">
              Ethereum Blockchain Observatory
            </p>
          </div>
        </div>

        {/* Center/Right: Network Indicator & Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Current Block Badge */}
          {stats.latestBlock > 0 && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0B0B0B] border border-[rgba(255,255,255,0.08)] text-xs font-mono text-[#F5F5F5]">
              <Cpu className="w-3.5 h-3.5 text-[#8A7CFF]" />
              <span className="text-[#8A8A8A]">Block:</span>
              <span className="font-medium text-[#F5F5F5]">#{formatNumber(stats.latestBlock)}</span>
            </div>
          )}

          {/* Connection Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0B0B0B] border border-[rgba(255,255,255,0.08)] text-xs">
            <span className="relative flex h-2 w-2">
              {stats.networkStatus === 'CONNECTED' && !isPaused && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#35D07F] opacity-75"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isPaused
                    ? 'bg-[#F5B84B]'
                    : stats.networkStatus === 'CONNECTED'
                    ? 'bg-[#35D07F]'
                    : stats.networkStatus === 'RECONNECTING'
                    ? 'bg-[#F5B84B]'
                    : 'bg-[#FF5A5F]'
                }`}
              ></span>
            </span>

            <span className="font-mono font-medium text-[#F5F5F5] uppercase tracking-wider text-[11px]">
              {isPaused ? 'PAUSED' : stats.networkStatus}
            </span>

            {stats.latencyMs > 0 && stats.networkStatus === 'CONNECTED' && (
              <span className="text-[10px] text-[#8A8A8A] font-mono border-l border-[rgba(255,255,255,0.08)] pl-2 hidden sm:inline">
                {stats.latencyMs}ms
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={onTogglePause}
              title={isPaused ? 'Resume live transaction ingestion' : 'Pause live ingestion'}
              className="p-2 rounded-md bg-[#0B0B0B] hover:bg-[#151515] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors"
            >
              {isPaused ? <Play className="w-3.5 h-3.5 text-[#35D07F]" /> : <Pause className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onResetSession}
              title="Reset session telemetry"
              className="p-2 rounded-md bg-[#0B0B0B] hover:bg-[#151515] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors hidden sm:flex items-center"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onOpenRpcModal}
              title={`Configure RPC (Current: ${currentEndpoint.name})`}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#0B0B0B] hover:bg-[#151515] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.15)] text-xs text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors"
            >
              <Settings2 className="w-3.5 h-3.5 text-[#8A7CFF]" />
              <span className="hidden lg:inline text-[11px]">RPC Settings</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
