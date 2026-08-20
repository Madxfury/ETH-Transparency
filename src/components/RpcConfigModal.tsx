import React, { useState } from 'react';
import { X, Server, Check, Plus } from 'lucide-react';
import type { RpcEndpointConfig } from '../types/blockchain';
import { DEFAULT_RPC_ENDPOINTS, saveCustomRpc } from '../services/rpcEndpoints';

interface RpcConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEndpoint: RpcEndpointConfig;
  onSelectEndpoint: (endpoint: RpcEndpointConfig) => void;
  latencyMs: number;
}

export const RpcConfigModal: React.FC<RpcConfigModalProps> = ({
  isOpen,
  onClose,
  currentEndpoint,
  onSelectEndpoint,
  latencyMs,
}) => {
  const [customName, setCustomName] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    if (!customUrl.startsWith('http://') && !customUrl.startsWith('https://')) {
      setError('RPC URL must start with https:// or http://');
      return;
    }

    setError(null);
    const newConfig: RpcEndpointConfig = {
      name: customName.trim() || 'Custom RPC Node',
      httpUrl: customUrl.trim(),
      isCustom: true,
    };

    saveCustomRpc(newConfig);
    onSelectEndpoint(newConfig);
    setCustomName('');
    setCustomUrl('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#0B0B0B] border border-[rgba(255,255,255,0.1)] shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#151515] border border-[rgba(255,255,255,0.1)] flex items-center justify-center text-[#8A7CFF]">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#F5F5F5]">Ethereum RPC Configuration</h3>
              <p className="text-xs text-[#8A8A8A]">Choose or configure JSON-RPC endpoints</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#111111] hover:bg-[#1A1A1A] text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Available Endpoints List */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase text-[#8A8A8A] font-semibold">
            Public High-Availability Endpoints
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {DEFAULT_RPC_ENDPOINTS.map((endpoint) => {
              const isSelected = currentEndpoint.httpUrl === endpoint.httpUrl;

              return (
                <button
                  key={endpoint.httpUrl}
                  onClick={() => {
                    onSelectEndpoint(endpoint);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#151515] border-[#8A7CFF] text-[#F5F5F5]'
                      : 'bg-[#111111] border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.15)] text-[#8A8A8A] hover:text-[#F5F5F5]'
                  }`}
                >
                  <div>
                    <div className="font-medium text-xs sm:text-sm flex items-center gap-2">
                      <span>{endpoint.name}</span>
                      {isSelected && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#8A7CFF]/15 text-[#8A7CFF] font-semibold">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-mono text-[#555555] truncate max-w-xs mt-0.5">
                      {endpoint.httpUrl}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs">
                    {isSelected && (
                      <span className="text-[#35D07F] text-[11px]">
                        {latencyMs}ms
                      </span>
                    )}
                    {isSelected && <Check className="w-4 h-4 text-[#8A7CFF]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom RPC Node Input */}
        <form onSubmit={handleAddCustom} className="space-y-3 pt-2 border-t border-[rgba(255,255,255,0.08)]">
          <label className="text-xs font-mono uppercase text-[#8A8A8A] font-semibold flex items-center justify-between">
            <span>Add Custom RPC (Alchemy / Infura / Private Node)</span>
          </label>

          <div className="space-y-2">
            <input
              type="text"
              placeholder="Provider Label (e.g. My Alchemy Node)"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)] text-xs text-[#F5F5F5] placeholder-[#555555] focus:outline-none focus:border-[#8A7CFF]"
            />
            <input
              type="text"
              placeholder="https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#111111] border border-[rgba(255,255,255,0.08)] text-xs font-mono text-[#F5F5F5] placeholder-[#555555] focus:outline-none focus:border-[#8A7CFF]"
            />
          </div>

          {error && (
            <div className="text-xs text-[#FF5A5F] font-mono">{error}</div>
          )}

          <button
            type="submit"
            disabled={!customUrl.trim()}
            className="w-full py-2.5 rounded-lg bg-[#8A7CFF] hover:bg-[#7968FF] disabled:opacity-50 text-black font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Connect & Save Custom RPC</span>
          </button>
        </form>
      </div>
    </div>
  );
};
