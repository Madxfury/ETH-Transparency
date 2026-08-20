import React from 'react';
import { Check, Eye, FileSearch, Fingerprint } from 'lucide-react';

export const TransparencyMatrix: React.FC = () => {
  return (
    <section className="rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0B0B0B] p-5 sm:p-6 shadow-2xl space-y-6">
      {/* Section Title */}
      <div>
        <div className="flex items-center gap-2">
          <FileSearch className="w-5 h-5 text-[#8A7CFF]" />
          <h2 className="text-base sm:text-lg font-semibold text-[#F5F5F5] tracking-tight">
            What the Blockchain Reveals: Transparency vs. Pseudo-Anonymity
          </h2>
        </div>
        <p className="text-xs text-[#8A8A8A] mt-1">
          A fundamental comparative breakdown of on-chain state visibility vs cryptographic identity bounds
        </p>
      </div>

      {/* Side-by-Side Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Transparent Card */}
        <div className="rounded-xl bg-[#111111] border border-[rgba(255,255,255,0.08)] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-3">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#35D07F]" />
              <span className="font-mono text-sm font-semibold tracking-wider text-[#F5F5F5] uppercase">
                100% Transparent
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#35D07F]/10 text-[#35D07F] border border-[#35D07F]/20 font-semibold">
              Public Ledger State
            </span>
          </div>

          <ul className="space-y-2.5 text-xs text-[#8A8A8A]">
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#35D07F] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#F5F5F5]">Complete Transaction History:</strong> Every transfer since genesis block #0 is permanently verifiable and immutable.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#35D07F] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#F5F5F5]">Public Wallet Addresses:</strong> Sender and recipient addresses (0x...) are universally visible.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#35D07F] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#F5F5F5]">Exact Transfer Amounts:</strong> Exact Wei/ETH values, token balances, and gas expenditures.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#35D07F] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#F5F5F5]">Block Timestamps & Nonce:</strong> Exact Unix timestamps, block sequence heights, and account transaction orders.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#35D07F] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#F5F5F5]">Transaction Relationships:</strong> Full multi-hop counterparty network graphs and fund lineage.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#35D07F] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#F5F5F5]">Public Transaction Hashes:</strong> Globally unique Keccak-256 identifiers verifiable on any node.
              </span>
            </li>
          </ul>
        </div>

        {/* Pseudo-Anonymous Card */}
        <div className="rounded-xl bg-[#111111] border border-[rgba(255,255,255,0.08)] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] pb-3">
            <div className="flex items-center gap-2">
              <Fingerprint className="w-4 h-4 text-[#8A7CFF]" />
              <span className="font-mono text-sm font-semibold tracking-wider text-[#F5F5F5] uppercase">
                Pseudo-Anonymous
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#8A7CFF]/10 text-[#8A7CFF] border border-[#8A7CFF]/20 font-semibold">
              Cryptographic Pseudonym
            </span>
          </div>

          <ul className="space-y-2.5 text-xs text-[#8A8A8A]">
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#8A7CFF] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#F5F5F5]">Wallet Address Instead of Name:</strong> Identities are represented as 20-byte public key hashes rather than legal entities.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#8A7CFF] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#F5F5F5]">No Identity Stored In State:</strong> No email, IP address, phone number, or government ID exists on-chain.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#8A7CFF] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#F5F5F5]">Recurring Behavioral Identity:</strong> One persistent address connects multiple actions over time into a trackable persona.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-[#8A7CFF] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#F5F5F5]">Off-Chain Deanonymization Risk:</strong> Identity can potentially be linked via KYC exchanges, ENS domains, or network IP sniffing.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Synthesis Quote */}
      <div className="p-4 rounded-xl bg-[#111111] border-l-4 border-[#8A7CFF] text-xs text-[#8A8A8A] leading-relaxed">
        <span className="text-[#F5F5F5] font-medium">“Ethereum transactions are transparent by design. Wallet addresses provide pseudonymity rather than guaranteed anonymity.”</span> Because all records are permanently public, anyone observing continuous transactions can correlate counterparties and build behavioral profiles.
      </div>
    </section>
  );
};
