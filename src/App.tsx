import { useState, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { NetworkStats } from './components/NetworkStats';
import { LiveTransactions } from './components/LiveTransactions';
import { TransactionDrawer } from './components/TransactionDrawer';
import { WalletTracker } from './components/WalletTracker';
import { RepeatedWalletAlert } from './components/RepeatedWalletAlert';
import { TransactionGraph } from './components/TransactionGraph';
import { TransparencyMatrix } from './components/TransparencyMatrix';
import { ExperimentSummary } from './components/ExperimentSummary';
import { RpcConfigModal } from './components/RpcConfigModal';
import { Footer } from './components/Footer';

import { useEthereumStream } from './hooks/useEthereumStream';
import { useWalletTracker } from './hooks/useWalletTracker';
import type { EthTransaction } from './types/blockchain';

export function App() {
  const {
    transactions,
    blocksObservedCount,
    statsData,
    repeatedWallets,
    isPaused,
    togglePause,
    switchRpc,
    clearSession,
    currentEndpoint,
  } = useEthereumStream();

  const {
    searchedAddress,
    setSearchedAddress,
    trackedAddress,
    trackerState,
    trackWallet,
    clearTracker,
    isLoading: isTrackerLoading,
    error: trackerError,
    notableWallets,
  } = useWalletTracker(transactions);

  const [selectedTx, setSelectedTx] = useState<EthTransaction | null>(null);
  const [isRpcModalOpen, setIsRpcModalOpen] = useState<boolean>(false);

  const handleTrackWalletFromAnywhere = useCallback((address: string) => {
    trackWallet(address);
    const el = document.getElementById('wallet-tracker-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [trackWallet]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col antialiased">
      {/* Top Sticky Navigation */}
      <Navbar
        stats={statsData}
        isPaused={isPaused}
        onTogglePause={togglePause}
        onOpenRpcModal={() => setIsRpcModalOpen(true)}
        onResetSession={clearSession}
        currentEndpoint={currentEndpoint}
      />

      {/* Hero / Experiment Introduction */}
      <HeroBanner />

      {/* Network Statistics Bar */}
      <NetworkStats stats={statsData} />

      {/* Main Content Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Section 4: Live Transaction Stream */}
        <section id="live-transactions">
          <LiveTransactions
            transactions={transactions}
            onSelectTx={(tx) => setSelectedTx(tx)}
            onTrackWallet={handleTrackWalletFromAnywhere}
            isPaused={isPaused}
          />
        </section>

        {/* Section 6 & 7: Wallet Activity Tracker & Multiple Transaction Detection */}
        <section id="wallet-tracker-section" className="grid grid-cols-1 gap-8">
          {/* Wallet Tracker */}
          <WalletTracker
            searchedAddress={searchedAddress}
            setSearchedAddress={setSearchedAddress}
            trackerState={trackerState}
            onTrack={trackWallet}
            onClear={clearTracker}
            onSelectTx={(tx) => setSelectedTx(tx)}
            notableWallets={notableWallets}
            isLoading={isTrackerLoading}
            error={trackerError}
          />

          {/* Repeated Wallet Activity Detector */}
          <RepeatedWalletAlert
            repeatedWallets={repeatedWallets}
            onTrackWallet={handleTrackWalletFromAnywhere}
            onSelectTx={(tx) => setSelectedTx(tx)}
          />
        </section>

        {/* Section 8: Interactive Transaction Network Graph */}
        <section id="transaction-graph">
          <TransactionGraph
            transactions={transactions}
            onSelectTx={(tx) => setSelectedTx(tx)}
            onTrackWallet={handleTrackWalletFromAnywhere}
            trackedAddress={trackedAddress}
          />
        </section>

        {/* Section 9: Transparency vs. Pseudo-Anonymity Educational Matrix */}
        <section id="transparency-matrix">
          <TransparencyMatrix />
        </section>

        {/* Section 10: Dynamic Experiment Summary & Telemetry Export */}
        <section id="experiment-summary">
          <ExperimentSummary
            stats={statsData}
            blocksObservedCount={blocksObservedCount}
            repeatedWallets={repeatedWallets}
            transactions={transactions}
          />
        </section>
      </main>

      {/* Transaction Detail Slide-Over Drawer */}
      <TransactionDrawer
        tx={selectedTx}
        onClose={() => setSelectedTx(null)}
        onTrackWallet={handleTrackWalletFromAnywhere}
      />

      {/* RPC Configuration Modal */}
      <RpcConfigModal
        isOpen={isRpcModalOpen}
        onClose={() => setIsRpcModalOpen(false)}
        currentEndpoint={currentEndpoint}
        onSelectEndpoint={switchRpc}
        latencyMs={statsData.latencyMs}
      />

      {/* Footer & Disclaimer */}
      <Footer />
    </div>
  );
}

export default App;
