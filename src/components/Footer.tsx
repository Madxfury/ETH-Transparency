import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-[rgba(255,255,255,0.08)] bg-[#070707] py-10 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Privacy & Academic Disclaimer Box */}
        <div className="p-4 rounded-xl bg-[#0B0B0B] border border-[rgba(255,255,255,0.06)] flex items-start gap-3 text-xs text-[#8A8A8A]">
          <ShieldCheck className="w-4 h-4 text-[#8A7CFF] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="text-[#F5F5F5]">Privacy & Academic Disclaimer:</strong> This dashboard observes publicly available blockchain data directly from Ethereum Mainnet. Wallet addresses are pseudonymous identifiers and should not be assumed to correspond to real-world identities. This project is created purely for educational and scientific demonstration of blockchain transparency and pseudonymity.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[#555555]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#35D07F]"></div>
            <span>Ethereum Blockchain Observatory • Real-Time JSON-RPC</span>
          </div>

          {/* Made with ❤️🔥 by SANSKAR */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111111] border border-[rgba(255,255,255,0.08)] text-xs text-[#F5F5F5] shadow-sm">
            <span className="text-[#8A8A8A]">Made with</span>
            <span>❤️🔥</span>
            <span className="text-[#8A8A8A]">by</span>
            <span className="font-semibold text-[#8A7CFF] tracking-wide">SANSKAR</span>
          </div>

          <div className="flex items-center gap-4 text-[#8A8A8A]">
            <a
              href="https://ethereum.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F5F5F5] transition-colors flex items-center gap-1"
            >
              <span>Ethereum.org</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://etherscan.io"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F5F5F5] transition-colors flex items-center gap-1"
            >
              <span>Etherscan</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
