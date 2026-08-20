import React from 'react';
import { Eye, ShieldAlert } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  return (
    <section className="relative pt-6 pb-4 border-b border-[rgba(255,255,255,0.06)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="max-w-3xl">
            {/* Experiment Badge */}
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#111111] border border-[rgba(255,255,255,0.08)] mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8A7CFF] animate-pulse"></span>
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#8A7CFF] font-medium">
                Real-Time Experiment
              </span>
              <span className="text-[#555555] text-xs">•</span>
              <span className="text-[11px] font-mono text-[#8A8A8A]">
                Demonstrating Transparency & Pseudo-Anonymity
              </span>
            </div>

            {/* Core Thesis Headline */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#F5F5F5] leading-tight mb-2">
              “Blockchain is transparent. Identity isn't.”
            </h1>

            {/* Supporting description */}
            <p className="text-sm sm:text-base text-[#8A8A8A] leading-relaxed max-w-2xl">
              Every Ethereum transaction is publicly observable on the distributed ledger, while participants are represented primarily by cryptographic wallet addresses rather than real-world names.
            </p>
          </div>

          {/* Quick Concept Highlights */}
          <div className="flex sm:flex-row md:flex-col gap-2 shrink-0">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0B0B0B] border border-[rgba(255,255,255,0.08)] text-xs text-[#8A8A8A]">
              <Eye className="w-3.5 h-3.5 text-[#35D07F]" />
              <span>
                <strong className="text-[#F5F5F5] font-medium">100% Transparent:</strong> Hashes, values, & timestamps
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0B0B0B] border border-[rgba(255,255,255,0.08)] text-xs text-[#8A8A8A]">
              <ShieldAlert className="w-3.5 h-3.5 text-[#8A7CFF]" />
              <span>
                <strong className="text-[#F5F5F5] font-medium">Pseudonymous:</strong> Correlated via public address
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
